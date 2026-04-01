import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Assessment from "@/models/Assessment";
import Candidate from "@/models/Candidate";
import Question from "@/models/Question";
import { parseResume, generateQuestions } from "@/lib/gemini";
import { GridFSBucket } from "mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: { link: string } },
) {
  try {
    await dbConnect();

    const assessment = await Assessment.findOne({
      uniqueLink: params.link,
      status: "active",
    });

    if (!assessment) {
      return NextResponse.json(
        { error: "Assessment not found or no longer active" },
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const resumeFile = formData.get("resume") as File;

    if (!name || !email || !resumeFile) {
      return NextResponse.json(
        { error: "Name, email, and resume are required" },
        { status: 400 },
      );
    }

    // Check if candidate already took this assessment
    const existingCandidate = await Candidate.findOne({
      assessmentId: assessment._id,
      email: email.toLowerCase(),
    });

    if (existingCandidate) {
      return NextResponse.json(
        {
          error: "You have already started this assessment",
          candidateId: existingCandidate._id,
        },
        { status: 409 },
      );
    }

    // Parse the resume file
    let resumeText = "";
    const fileBuffer = Buffer.from(await resumeFile.arrayBuffer());

    if (resumeFile.name.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const pdfData = await pdfParse(fileBuffer);
      resumeText = pdfData.text;
    } else if (
      resumeFile.name.endsWith(".docx") ||
      resumeFile.name.endsWith(".doc")
    ) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      resumeText = result.value;
    } else {
      resumeText = fileBuffer.toString("utf-8");
    }

    if (!resumeText.trim()) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from the resume. Please upload a valid PDF or DOC file.",
        },
        { status: 400 },
      );
    }

    // AI: Parse resume for skills
    const resumeAnalysis = await parseResume(resumeText);

    // Create candidate record
    const candidate = await Candidate.create({
      companyId: assessment.companyId,
      assessmentId: assessment._id,
      name,
      email: email.toLowerCase(),
      resumeText,
      resumeSkills: resumeAnalysis.skills,
      experienceLevel: resumeAnalysis.experienceLevel,
      status: "in_progress",
      startedAt: new Date(),
    });

    // Store resume file in GridFS
    try {
      await dbConnect();
      const db = mongoose.connection.db!;
      const bucket = new GridFSBucket(db, { bucketName: "resumes" });

      const uploadStream = bucket.openUploadStream(
        `${candidate._id}-${resumeFile.name}`,
        {
          metadata: {
            candidateId: candidate._id.toString(),
            assessmentId: assessment._id.toString(),
            originalName: resumeFile.name,
            uploadedAt: new Date(),
          },
        },
      );

      uploadStream.end(fileBuffer);

      const fileId = await new Promise((resolve, reject) => {
        uploadStream.on("finish", () => resolve(uploadStream.id));
        uploadStream.on("error", reject);
      });

      // Update candidate with file ID
      await Candidate.updateOne(
        { _id: candidate._id },
        { resumeFileId: fileId },
      );
    } catch (gridfsError) {
      console.error("GridFS storage error:", gridfsError);
      // Continue without storing file - not critical
    }

    // AI: Generate questions
    const generatedQuestions = await generateQuestions(
      resumeAnalysis.skills,
      resumeAnalysis.experienceLevel,
      resumeAnalysis.summary,
      assessment.questionCount,
      assessment.difficulty,
      assessment.skills,
      assessment.aiPrompt,
    );

    // Store questions in database
    const questionDocs = await Question.insertMany(
      generatedQuestions.map((q, index) => ({
        candidateId: candidate._id,
        assessmentId: assessment._id,
        question: q.question,
        category: q.category,
        difficulty: q.difficulty,
        expectedConcepts: q.expectedConcepts,
        order: index,
      })),
    );

    // Increment candidate count
    await Assessment.updateOne(
      { _id: assessment._id },
      { $inc: { candidateCount: 1 } },
    );

    return NextResponse.json(
      {
        candidateId: candidate._id,
        totalQuestions: questionDocs.length,
        firstQuestion: {
          _id: questionDocs[0]._id,
          question: questionDocs[0].question,
          category: questionDocs[0].category,
          order: 0,
        },
        resumeAnalysis: {
          skills: resumeAnalysis.skills,
          experienceLevel: resumeAnalysis.experienceLevel,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Start assessment error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
