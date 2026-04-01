import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAssessment extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  uniqueLink: string;
  skills: string[];
  questionCount: number;
  difficulty: 'junior' | 'mid' | 'senior' | 'lead';
  status: 'active' | 'paused' | 'archived';
  candidateCount: number;
  createdAt: Date;
  expiresAt?: Date;
  aiPrompt?: string;
  faqs?: { question: string; answer: string }[];
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    uniqueLink: { type: String, required: true, unique: true },
    skills: [{ type: String }],
    questionCount: { type: Number, default: 10, min: 5, max: 30 },
    difficulty: {
      type: String,
      enum: ['junior', 'mid', 'senior', 'lead'],
      default: 'mid',
    },
    status: { type: String, enum: ['active', 'paused', 'archived'], default: 'active' },
    candidateCount: { type: Number, default: 0 },
    expiresAt: { type: Date },
    aiPrompt: { type: String, trim: true },
    faqs: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true }
      }
    ],
  },
  { timestamps: true }
);

const Assessment: Model<IAssessment> =
  mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema);
export default Assessment;
