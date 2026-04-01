import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';

export async function GET(
  req: NextRequest,
  { params }: { params: { link: string } }
) {
  try {
    await dbConnect();

    const assessment = await Assessment.findOne({
      uniqueLink: params.link,
      status: 'active',
    })
      .populate('companyId', 'name logo')
      .lean();

    if (!assessment) {
      return NextResponse.json(
        { error: 'Assessment not found or no longer active' },
        { status: 404 }
      );
    }

    if (assessment.expiresAt && new Date(assessment.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'This assessment link has expired' },
        { status: 410 }
      );
    }

    return NextResponse.json({
      assessment: {
        _id: assessment._id,
        title: assessment.title,
        description: assessment.description,
        company: assessment.companyId,
        questionCount: assessment.questionCount,
        difficulty: assessment.difficulty,
        skills: assessment.skills,
        faqs: assessment.faqs,
      },
    });
  } catch (error) {
    console.error('Fetch assessment by link error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
