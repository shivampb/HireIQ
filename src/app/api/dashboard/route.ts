import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
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

    const [
      totalAssessments,
      activeAssessments,
      totalCandidates,
      completedCandidates,
      evaluatedCandidates,
      recentCandidates,
      reports,
    ] = await Promise.all([
      Assessment.countDocuments({ companyId }),
      Assessment.countDocuments({ companyId, status: 'active' }),
      Candidate.countDocuments({ companyId }),
      Candidate.countDocuments({ companyId, status: 'completed' }),
      Candidate.countDocuments({ companyId, status: 'evaluated' }),
      Candidate.find({ companyId })
        .populate('assessmentId', 'title')
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
      Report.find({ companyId }).lean(),
    ]);

    const avgScore = reports.length > 0
      ? Math.round(reports.reduce((sum, r) => sum + r.overallScore, 0) / reports.length)
      : 0;

    const recommendationCounts = {
      hire: reports.filter(r => r.recommendation === 'hire').length,
      maybe: reports.filter(r => r.recommendation === 'maybe').length,
      fail: reports.filter(r => r.recommendation === 'fail').length,
    };

    return NextResponse.json({
      stats: {
        totalAssessments,
        activeAssessments,
        totalCandidates,
        completedCandidates,
        evaluatedCandidates,
        avgScore,
        recommendationCounts,
      },
      recentCandidates,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
