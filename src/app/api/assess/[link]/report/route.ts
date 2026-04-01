import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import Question from "@/models/Question";
import Report from "@/models/Report";
import Assessment from "@/models/Assessment";
import { generateReport } from "@/lib/gemini";

export async function POST(
  req: NextRequest,
  { params }: { params: { link: string } },
) {
  try {
    const body = await req.json();
    const candidateId = body.candidateId;
    const force = !!body.force;
    // Default to AI-preferred report generation unless explicitly disabled
    const useAI = body.useAI !== undefined ? !!body.useAI : true;

    if (!candidateId) {
      return NextResponse.json(
        { error: "candidateId is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 },
      );
    }

    if (candidate.status !== "completed" && candidate.status !== "evaluated") {
      return NextResponse.json(
        { error: "Assessment not yet completed" },
        { status: 400 },
      );
    }

    // Check if report already exists
    const existingReport = await Report.findOne({ candidateId });
    if (existingReport && !force) {
      return NextResponse.json({ report: existingReport });
    }

    // If force regeneration requested, delete existing report and continue
    if (existingReport && force) {
      console.log(
        `Force regeneration requested for candidate ${candidateId}. Deleting existing report ${existingReport._id}`,
      );
      await Report.deleteOne({ _id: existingReport._id });
    }

    // Get all answered questions
    const questions = await Question.find({ candidateId })
      .sort({ order: 1 })
      .lean();

    // Get assessment details to pass context to AI
    const assessment = await Assessment.findById(candidate.assessmentId);

    // Generate comprehensive report (prefer AI-generated fields by default)
    console.log(
      `Generating report for candidate ${candidateId} (useAI=${useAI})`,
    );
    const reportData = await generateReport(
      candidate.name,
      candidate.resumeSkills,
      candidate.resumeText || "",
      assessment?.faqs || [],
      assessment?.aiPrompt || "",
      candidate.experienceLevel,
      questions.map((q) => ({
        question: q.question,
        category: q.category,
        answer: q.answer,
        evaluation: q.evaluation,
      })),
      { preferAI: useAI },
    );

    // Sanitize and ensure enum values are correct
    const validRecommendations = ["hire", "maybe", "fail"];
    const recom = (reportData.recommendation || "").toString().toLowerCase();
    const sanitizedRecommendation = validRecommendations.includes(recom)
      ? recom
      : Number(reportData.overallScore) >= 75
        ? "hire"
        : Number(reportData.overallScore) >= 50
          ? "maybe"
          : "fail";

    // Save report
    const report = await Report.create({
      candidateId: candidate._id,
      companyId: candidate.companyId,
      assessmentId: candidate.assessmentId,
      overallScore: Number(reportData.overallScore) || 0,
      skillScores: reportData.skillScores || [],
      behavioralAnalysis: {
        communicationClarity:
          Number(reportData.behavioralAnalysis?.communicationClarity) || 50,
        technicalDepth:
          Number(reportData.behavioralAnalysis?.technicalDepth) || 50,
        problemSolving:
          Number(reportData.behavioralAnalysis?.problemSolving) || 50,
        consistency: Number(reportData.behavioralAnalysis?.consistency) || 50,
      },
      suspicionFlags: Array.isArray(reportData.suspicionFlags)
        ? reportData.suspicionFlags.map((flag: any) => ({
            type: flag.type || "unknown",
            severity: ["low", "medium", "high"].includes(
              flag.severity?.toLowerCase(),
            )
              ? flag.severity.toLowerCase()
              : "medium",
            description: flag.description || "",
          }))
        : [],
      suspicionScore: Number(reportData.suspicionScore) || 0,
      // Use AI-generated summary (or fallback)
      summary:
        (reportData.summary && reportData.summary.toString()) ||
        "No summary provided.",
      recommendation: sanitizedRecommendation,
      detailedFeedback: reportData.detailedFeedback || "No feedback provided.",
    });

    // Update candidate status
    candidate.status = "evaluated";
    await candidate.save();

    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("Generate report error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
