import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import Candidate from '@/models/Candidate';
import Report from '@/models/Report';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).companyId;
    await dbConnect();

    const assessment = await Assessment.findOne({
      _id: params.id,
      companyId,
    }).lean();

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const candidates = await Candidate.find({
      assessmentId: params.id,
      companyId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const candidateIds = candidates.map((c: any) => c._id);
    const reports = await Report.find({ candidateId: { $in: candidateIds } }).lean();

    const candidatesWithReports = candidates.map((c: any) => {
      const report = reports.find((r: any) => r.candidateId.toString() === c._id.toString());
      return { 
        ...c, 
        report: report ? { recommendation: report.recommendation, overallScore: report.overallScore } : null 
      };
    });

    return NextResponse.json({ assessment, candidates: candidatesWithReports });
  } catch (error) {
    console.error('Fetch assessment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).companyId;
    const updates = await req.json();

    await dbConnect();

    const assessment = await Assessment.findOneAndUpdate(
      { _id: params.id, companyId },
      { $set: updates },
      { new: true }
    );

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    return NextResponse.json({ assessment });
  } catch (error) {
    console.error('Update assessment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).companyId;
    await dbConnect();

    const assessment = await Assessment.findOneAndDelete({
      _id: params.id,
      companyId,
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Cascade delete all candidates for this assessment
    const candidates = await Candidate.find({ assessmentId: params.id, companyId });
    const candidateIds = candidates.map(c => c._id);

    await Candidate.deleteMany({ assessmentId: params.id, companyId });
    
    // Delete all reports belonging to those candidates
    if (candidateIds.length > 0) {
      await Report.deleteMany({ candidateId: { $in: candidateIds } });
    }

    return NextResponse.json({ message: 'Assessment and all associated data deleted completely' });
  } catch (error) {
    console.error('Delete assessment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
