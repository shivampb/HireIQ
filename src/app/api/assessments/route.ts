import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Assessment from '@/models/Assessment';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).companyId;
    await dbConnect();

    const assessments = await Assessment.find({ companyId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error('Fetch assessments error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const companyId = (session.user as any).companyId;
    const { title, description, skills, questionCount, difficulty, expiresAt, aiPrompt, faqs } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    await dbConnect();

    const uniqueLink = uuidv4().replace(/-/g, '').substring(0, 12);

    const assessment = await Assessment.create({
      companyId,
      title,
      description: description || '',
      uniqueLink,
      skills: skills || [],
      questionCount: questionCount || 10,
      difficulty: difficulty || 'mid',
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      aiPrompt: aiPrompt || '',
      faqs: faqs || [],
    });

    return NextResponse.json({ assessment }, { status: 201 });
  } catch (error) {
    console.error('Create assessment error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
