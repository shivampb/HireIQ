import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export async function parseResume(resumeText: string): Promise<{
  skills: string[];
  experienceLevel: string;
  summary: string;
}> {
  const prompt = `You are an expert resume analyzer. Analyze the following resume text and extract structured information.

Resume Text:
"""
${resumeText}
"""

Return a JSON object with exactly these fields:
{
  "skills": ["skill1", "skill2", ...],  // List of technical skills, frameworks, languages, tools found
  "experienceLevel": "junior|mid|senior|lead",  // Estimated experience level
  "summary": "Brief 2-3 sentence summary of the candidate's background"
}

Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();
  
  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      skills: [],
      experienceLevel: 'unknown',
      summary: 'Unable to parse resume',
    };
  }
}

export async function generateQuestions(
  skills: string[],
  experienceLevel: string,
  resumeSummary: string,
  questionCount: number,
  difficulty: string,
  targetSkills: string[],
  aiPrompt?: string
): Promise<
  {
    question: string;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    expectedConcepts: string[];
  }[]
> {
  const skillFocus = targetSkills.length > 0 ? targetSkills : skills;
  
  const prompt = `You are a technical interviewer generating ${questionCount} concise interview questions.

Candidate Profile:
- Skills: ${skills.join(', ')}
- Experience Level: ${experienceLevel}
- Assessment difficulty: ${difficulty}
- Focus skills: ${skillFocus.join(', ')}
${aiPrompt && aiPrompt.trim() !== '' ? `\nSPECIAL ADMIN INSTRUCTIONS:\n${aiPrompt}\n` : ''}
STRICT REQUIREMENTS FOR QUESTIONS:
1. MUST BE BITE-SIZED AND FEASIBLE for a quick web-based assessment.
2. NO long-form architecture questions or full application build requests.
3. Use formats like: 
   - Short code logic (e.g., "What will this snippet output?", "Write a 3-line function to do X")
   - Multiple Choice Questions (e.g., "Which is true? A) ... B) ... (Explain why)")
   - Brief Q&A testing specific knowledge ("What is the difference between X and Y?")
4. Mix of easy, medium, and hard based on the difficulty setting.
5. Cover different skill areas from the resume.

Return a JSON array with exactly this format:
[
  {
    "question": "The full question text. USE MARKDOWN FORMATTING (e.g. 'backticks' for code snippets, **bolding**, and lists for MCQ options)",
    "category": "skill or topic category (e.g., 'React', 'JavaScript', 'Logic')",
    "difficulty": "easy|medium|hard",
    "expectedConcepts": ["concept1", "concept2"]
  }
]

Return ONLY the JSON array, no markdown formatting, no code blocks, no additional text.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return [
      {
        question: 'Tell me about your most challenging project.',
        category: 'Behavioral',
        difficulty: 'medium' as const,
        expectedConcepts: ['problem-solving', 'experience'],
      },
    ];
  }
}

export async function evaluateAnswer(
  question: string,
  answer: string,
  expectedConcepts: string[],
  resumeSkills: string[],
  category: string
): Promise<{
  score: number;
  feedback: string;
  matchesResume: boolean;
  confidenceLevel: 'high' | 'medium' | 'low';
}> {
  const prompt = `You are an expert technical interviewer evaluating a candidate's answer.

Question: "${question}"
Category: ${category}
Expected Concepts: ${expectedConcepts.join(', ')}
Candidate's Resume Skills: ${resumeSkills.join(', ')}

Candidate's Answer:
"""
${answer}
"""

Evaluate the answer and return a JSON object:
{
  "score": 0-100,  // How well they answered (0=terrible, 100=perfect)
  "feedback": "Brief evaluation of the answer quality and accuracy",
  "matchesResume": true/false,  // Does the answer demonstrate genuine knowledge matching their resume claims?
  "confidenceLevel": "high|medium|low"  // How confident does the candidate seem? (low = vague, generic, possibly fake)
}

Scoring guidelines:
- 0-20: Completely wrong or irrelevant
- 21-40: Shows very basic understanding but major gaps
- 41-60: Decent but lacks depth or has some errors
- 61-80: Good answer with solid understanding
- 81-100: Excellent, demonstrates deep expertise

For matchesResume: Mark false if the answer contradicts claims on their resume or shows ignorance of skills they listed.
For confidenceLevel: Mark "low" if the answer is very vague, generic, or sounds copy-pasted.

Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`;

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  try {
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    return {
      score: 50,
      feedback: 'Unable to evaluate automatically',
      matchesResume: true,
      confidenceLevel: 'medium',
    };
  }
}

export async function generateReport(
  candidateName: string,
  resumeSkills: string[],
  resumeText: string,
  faqs: { question: string; answer: string }[],
  aiPrompt: string,
  experienceLevel: string,
  questions: {
    question: string;
    category: string;
    answer: string;
    evaluation: {
      score: number;
      feedback: string;
      matchesResume: boolean;
      confidenceLevel: string;
    };
  }[]
): Promise<{
  overallScore: number;
  skillScores: { skill: string; score: number; questionsAsked: number; correctAnswers: number }[];
  behavioralAnalysis: {
    communicationClarity: number;
    technicalDepth: number;
    problemSolving: number;
    consistency: number;
  };
  suspicionFlags: { type: string; severity: 'low' | 'medium' | 'high'; description: string }[];
  suspicionScore: number;
  summary: string;
  recommendation: 'hire' | 'maybe' | 'fail';
  detailedFeedback: string;
}> {
  const questionsData = questions.map((q, i) => 
    `Q${i + 1} [${q.category}]: ${q.question}\nAnswer: ${q.answer}\nScore: ${q.evaluation.score}/100 | Resume Match: ${q.evaluation.matchesResume} | Confidence: ${q.evaluation.confidenceLevel}\nFeedback: ${q.evaluation.feedback}`
  ).join('\n\n');

  const faqsData = faqs.length > 0 
    ? '\n\nCompany FAQs Reference (Answers expected to match):\n' + faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')
    : '';

  const adminInstructions = aiPrompt 
    ? `\n\nSPECIAL ADMIN INSTRUCTIONS:\n${aiPrompt}` 
    : '';

  const prompt = `You are a senior technical technical recruiter and hiring consultant generating a strictly unique, comprehensive assessment report tailored specifically and solely for this individual candidate. Do not use generic responses. Score the candidate independently based exclusively on their unique answers provided below.

Candidate: ${candidateName}
Resume Skills: ${resumeSkills.join(', ')}
Experience Level: ${experienceLevel}

Full Candidate Resume Text:
"""
${resumeText || 'Not provided'}
"""${adminInstructions}${faqsData}

Assessment Results (Questions asked to candidate & their Answers):
${questionsData}

Generate a comprehensive hiring report. Return a JSON object:
{
  "overallScore": 0-100,
  "skillScores": [
    {"skill": "skill name", "score": 0-100, "questionsAsked": N, "correctAnswers": N}
  ],
  "behavioralAnalysis": {
    "communicationClarity": 0-100,
    "technicalDepth": 0-100,
    "problemSolving": 0-100,
    "consistency": 0-100
  },
  "suspicionFlags": [
    {"type": "flag type", "severity": "low|medium|high", "description": "explanation"}
  ],
  "suspicionScore": 0-100,  // 0=completely genuine, 100=definitely fake
  "summary": "3-5 sentence overview of the candidate",
  "recommendation": "hire|maybe|fail",
  "detailedFeedback": "Detailed paragraph with specific observations, strengths, weaknesses, and concerns"
}

Suspicion signals to look for:
1. Answers inconsistent with resume claims
2. Very generic or textbook-like answers suggesting memorization
3. Inability to explain concepts at the claimed experience level
4. Low confidence across multiple questions
5. Contradictions between different answers

Return ONLY the JSON object, no markdown formatting, no code blocks, no additional text.`;

  try {
    // Use gemini-1.5-flash for maximum free-tier compatibility and speed while supporting JSON structured output
    const reportModel = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });
    
    const result = await reportModel.generateContent(prompt);
    const response = result.response.text();
    // Parse strictly (clean block formatting just in case, though mimeType should handle it)
    const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const reportData = JSON.parse(cleaned);

    // Deterministically calculate skill scores and overall score to prevent AI hallucinations
    const skillMap: Record<string, { totalScore: number; asked: number; correct: number }> = {};
    let totalScore = 0;

    questions.forEach(q => {
      const skill = q.category;
      if (!skillMap[skill]) {
        skillMap[skill] = { totalScore: 0, asked: 0, correct: 0 };
      }
      skillMap[skill].asked += 1;
      skillMap[skill].totalScore += q.evaluation.score;
      if (q.evaluation.score >= 60) {
        skillMap[skill].correct += 1;
      }
      totalScore += q.evaluation.score;
    });

    reportData.skillScores = Object.entries(skillMap).map(([skill, data]) => ({
      skill,
      score: Math.round(data.totalScore / data.asked),
      questionsAsked: data.asked,
      correctAnswers: data.correct,
    }));
    reportData.overallScore = questions.length > 0 ? Math.round(totalScore / questions.length) : reportData.overallScore;

    return reportData;
  } catch (error) {
    console.error('Gemini API Error during generateReport:', error);

    // Deterministically calculate fallback scores if AI generation fails (e.g. quota limits)
    const skillMap: Record<string, { totalScore: number; asked: number; correct: number }> = {};
    let totalScore = 0;
    questions.forEach(q => {
      const skill = q.category;
      if (!skillMap[skill]) skillMap[skill] = { totalScore: 0, asked: 0, correct: 0 };
      skillMap[skill].asked += 1;
      skillMap[skill].totalScore += q.evaluation.score;
      if (q.evaluation.score >= 60) skillMap[skill].correct += 1;
      totalScore += q.evaluation.score;
    });

    const fallbackSkillScores = Object.entries(skillMap).map(([skill, data]) => ({
      skill,
      score: Math.round(data.totalScore / data.asked),
      questionsAsked: data.asked,
      correctAnswers: data.correct,
    }));
    const fallbackOverallScore = questions.length > 0 ? Math.round(totalScore / questions.length) : 0;
    const suggestion = fallbackOverallScore >= 75 ? 'hire' : (fallbackOverallScore >= 50 ? 'maybe' : 'fail');

    return {
      overallScore: fallbackOverallScore,
      skillScores: fallbackSkillScores,
      behavioralAnalysis: {
        communicationClarity: 50,
        technicalDepth: fallbackOverallScore,
        problemSolving: 50,
        consistency: 50,
      },
      suspicionFlags: [{ type: 'AI Quota Exceeded', severity: 'low', description: 'Report extrapolated from numeric evaluation scores without semantic AI summary' }],
      suspicionScore: 0,
      summary: `Partial Report (Auto-Generated Fallback System): Candidate scored ${fallbackOverallScore}/100 based strictly on extrapolated mathematical assessment data.`,
      recommendation: suggestion,
      detailedFeedback: 'The AI summarization engine encountered a free-tier quota rejection or API timeout constraint from Google Gemini. However, individual question evaluations were successfully processed earlier. This mathematically compiled fallback report is provided to prevent total data loss.',
    };
  }
}
