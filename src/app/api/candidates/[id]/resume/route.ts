import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Candidate from "@/models/Candidate";
import { GridFSBucket } from "mongodb";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
): Promise<Response> {
  try {
    await dbConnect();

    const candidate = await Candidate.findById(params.id);

    if (!candidate) {
      return NextResponse.json(
        { error: "Candidate not found" },
        { status: 404 },
      );
    }

    if (!candidate.resumeFileId) {
      return NextResponse.json(
        { error: "No resume file found" },
        { status: 404 },
      );
    }

    await dbConnect();
    await dbConnect();
    const db = mongoose.connection.db!;
    const bucket = new GridFSBucket(db, { bucketName: "resumes" });

    // Download file from GridFS
    const downloadStream = bucket.openDownloadStream(candidate.resumeFileId);

    // Get file info from GridFS
    const files = await db
      .collection("resumes.files")
      .findOne({ _id: candidate.resumeFileId });
    const filename = files?.metadata?.originalName || "resume";

    // Determine content type based on file extension
    let contentType = "application/octet-stream";
    if (filename.endsWith(".pdf")) {
      contentType = "application/pdf";
    } else if (filename.endsWith(".docx")) {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (filename.endsWith(".doc")) {
      contentType = "application/msword";
    }

    // Collect the data
    const chunks: Buffer[] = [];

    const filePromise: Promise<Response> = new Promise((resolve) => {
      downloadStream.on("data", (chunk) => {
        chunks.push(chunk);
      });

      downloadStream.on("end", () => {
        const fileBuffer = Buffer.concat(chunks);

        const response = new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": fileBuffer.length.toString(),
          },
        });

        resolve(response);
      });

      downloadStream.on("error", (error: any) => {
        console.error("Resume download error:", error);
        resolve(
          NextResponse.json(
            { error: "Failed to retrieve resume" },
            { status: 500 },
          ),
        );
      });
    });

    return await filePromise;
  } catch (error: any) {
    console.error("Resume retrieval error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
