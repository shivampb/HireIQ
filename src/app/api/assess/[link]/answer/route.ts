import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import Question from '@/models/Question';
import { evaluateAnswer } from '@/lib/gemini';

export async function POST(
  req: NextRequest,
  { params }: { params: { link: string } }
) {
  try {
    const { candidateId, questionId, answer } = await req.json();

    if (!candidateId || !questionId || !answer) {
      return NextResponse.json(
        { error: 'candidateId, questionId, and answer are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const candidate = await Candidate.findById(candidateId);
    if (!candidate || candidate.status === 'completed' || candidate.status === 'evaluated') {
      return NextResponse.json(
        { error: 'Invalid candidate or assessment already completed' },
        { status: 400 }
      );
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // AI: Evaluate the answer
    const evaluation = await evaluateAnswer(
      question.question,
      answer,
      question.expectedConcepts,
      candidate.resumeSkills,
      question.category
    );

    // Save answer and evaluation
    question.answer = answer;
    question.evaluation = evaluation;
    question.answeredAt = new Date();
    await question.save();

    // Get next question
    const nextQuestion = await Question.findOne({
      candidateId,
      order: question.order + 1,
    }).lean();

    // Update candidate progress
    candidate.currentQuestionIndex = question.order + 1;
    await candidate.save();

    if (nextQuestion) {
      return NextResponse.json({
        evaluated: true,
        nextQuestion: {
          _id: nextQuestion._id,
          question: nextQuestion.question,
          category: nextQuestion.category,
          order: nextQuestion.order,
        },
        currentIndex: question.order + 1,
      });
    } else {
      // No more questions - mark as completed
      candidate.status = 'completed';
      candidate.completedAt = new Date();
      await candidate.save();

      return NextResponse.json({
        evaluated: true,
        completed: true,
        message: 'Assessment completed! Your responses are being evaluated.',
      });
    }
  } catch (error) {
    console.error('Answer submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
