import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Report from '@/models/Report';
import Candidate from '@/models/Candidate';
import Question from '@/models/Question';

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

    const candidate = await Candidate.findOne({
      _id: params.id,
      companyId,
    }).lean();

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    const report = await Report.findOne({
      candidateId: params.id,
      companyId,
    }).lean();

    const questions = await Question.find({
      candidateId: params.id,
    })
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ candidate, report, questions });
  } catch (error) {
    console.error('Fetch candidate details error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const companyId = (session?.user as any)?.companyId;
    
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const candidateId = params.id;

    const candidate = await Candidate.findOneAndDelete({ 
      _id: candidateId, 
      companyId: companyId 
    });
    
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found or unauthorized' }, { status: 404 });
    }
    
    // Also delete their AI report if it exists
    await Report.deleteOne({ candidateId: candidateId });
    
    return NextResponse.json({ message: 'Candidate and report deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json(
      { error: 'Failed to delete candidate' },
      { status: 500 }
    );
  }
}
