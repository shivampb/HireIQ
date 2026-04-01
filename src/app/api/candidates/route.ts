import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import Report from '@/models/Report';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).companyId;
    await dbConnect();

    const candidates = await Candidate.find({ companyId })
      .populate('assessmentId', 'title')
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

    return NextResponse.json({ candidates: candidatesWithReports });
  } catch (error) {
    console.error('Fetch candidates error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
