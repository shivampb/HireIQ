import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IQuestion extends Document {
  candidateId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  question: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  expectedConcepts: string[];
  answer: string;
  evaluation: {
    score: number;
    feedback: string;
    matchesResume: boolean;
    confidenceLevel: 'high' | 'medium' | 'low';
  };
  order: number;
  answeredAt?: Date;
}

const QuestionSchema = new Schema<IQuestion>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true, index: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    question: { type: String, required: true },
    category: { type: String, required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    expectedConcepts: [{ type: String }],
    answer: { type: String, default: '' },
    evaluation: {
      score: { type: Number, default: 0 },
      feedback: { type: String, default: '' },
      matchesResume: { type: Boolean, default: true },
      confidenceLevel: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
    },
    order: { type: Number, required: true },
    answeredAt: { type: Date },
  },
  { timestamps: true }
);

QuestionSchema.index({ candidateId: 1, order: 1 });

const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
export default Question;
