import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReport extends Document {
  candidateId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  overallScore: number;
  skillScores: {
    skill: string;
    score: number;
    questionsAsked: number;
    correctAnswers: number;
  }[];
  behavioralAnalysis: {
    communicationClarity: number;
    technicalDepth: number;
    problemSolving: number;
    consistency: number;
  };
  suspicionFlags: {
    type: string;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }[];
  suspicionScore: number;
  summary: string;
  recommendation: 'hire' | 'maybe' | 'fail';
  detailedFeedback: string;
  generatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: 'Candidate', required: true, unique: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    overallScore: { type: Number, required: true, min: 0, max: 100 },
    skillScores: [
      {
        skill: String,
        score: Number,
        questionsAsked: Number,
        correctAnswers: Number,
      },
    ],
    behavioralAnalysis: {
      communicationClarity: { type: Number, min: 0, max: 100 },
      technicalDepth: { type: Number, min: 0, max: 100 },
      problemSolving: { type: Number, min: 0, max: 100 },
      consistency: { type: Number, min: 0, max: 100 },
    },
    suspicionFlags: [
      {
        type: { type: String },
        severity: { type: String, enum: ['low', 'medium', 'high'] },
        description: { type: String },
      },
    ],
    suspicionScore: { type: Number, default: 0, min: 0, max: 100 },
    summary: { type: String, required: true },
    recommendation: {
      type: String,
      enum: ['hire', 'maybe', 'fail'],
      required: true,
    },
    detailedFeedback: { type: String },
    generatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ReportSchema.index({ companyId: 1, assessmentId: 1 });

// Force re-register with updated schema (clear cached model from hot-reload)
if (mongoose.models.Report) {
  delete mongoose.models.Report;
}
const Report: Model<IReport> = mongoose.model<IReport>('Report', ReportSchema);
export default Report;
