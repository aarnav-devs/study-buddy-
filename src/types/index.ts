export type LearningMode = 'explain' | 'example' | 'quiz' | 'exam' | 'teach' | 'verify';

export interface FlowStep {
  step: number;
  label: string;
  detail: string;
  icon?: string;
}

export interface SparkStep {
  step: number;
  title: string;
  description: string;
  visualHint?: string;
}

export interface TeachStep {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  encouragement: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface TopicData {
  topic: string;
  emoji: string;
  headline: string;
  userQuestion?: string;
  directAnswer?: string;
  isAiGenerated?: boolean;
  flow: FlowStep[];
  analogy: string;
  keyPoints: string[];
  curiousQuestion: string;
  sparkSteps: SparkStep[];
  teachChallenge: {
    problem: string;
    steps: TeachStep[];
  };
  quizQuestions: QuizQuestion[];
}

export interface ProgressItem {
  id: string;
  topic: string;
  emoji: string;
  percent: number;
  lastSubtopic: string;
  lastUpdated: string;
}

export interface VerifyResult {
  verified: boolean;
  confidence: 'High' | 'Medium';
  headline: string;
  summary: string;
  explanation: string;
  correction?: string | null;
  socraticPrompt?: string;
}

export interface UserPreferences {
  name: string;
  learningStyle: 'visual' | 'step-by-step' | 'socratic';
  gradeLevel: 'middle' | 'high' | 'college';
  soundEnabled: boolean;
  streakDays: number;
}
