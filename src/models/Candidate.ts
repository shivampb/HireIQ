import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICandidate extends Document {
  companyId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  resumeText: string;
  resumeSkills: string[];
  experienceLevel: string;
  status: 'pending' | 'in_progress' | 'completed' | 'evaluated';
  currentQuestionIndex: number;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

const CandidateSchema = new Schema<ICandidate>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    resumeText: { type: String, default: '' },
    resumeSkills: [{ type: String }],
    experienceLevel: { type: String, default: 'unknown' },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'evaluated'],
      default: 'pending',
    },
    currentQuestionIndex: { type: Number, default: 0 },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

CandidateSchema.index({ companyId: 1, assessmentId: 1 });
CandidateSchema.index({ assessmentId: 1, email: 1 }, { unique: true });

const Candidate: Model<ICandidate> =
  mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema);
export default Candidate;
