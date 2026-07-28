export type SupportedLanguage =
  | "Hindi"
  | "Marathi"
  | "Gujarati"
  | "Tamil"
  | "Telugu"
  | "Kannada"
  | "Malayalam"
  | "Punjabi"
  | "Bengali"
  | "Odia";

export type LearningMode = "Simple" | "Detailed" | "Exam Preparation" | "Child Friendly";
export type ExplainAction = "Explain" | "Summarize" | "Simplify" | "Generate Quiz" | "Chat";

export interface QuizQuestion {
  id: string;
  type: "MCQ" | "True/False" | "Fill in blanks" | "One-line";
  question: string;
  options?: string[];
  answer: string;
}

export interface ExplanationResult {
  explanation: string;
  summary: string;
  example: string;
  quiz: QuizQuestion[];
}

export interface HistoryItem {
  id: string;
  user_id?: string;
  input: string;
  explanation: string;
  language: SupportedLanguage;
  mode: LearningMode;
  quiz_score?: number | null;
  created_at: string;
  bookmarked?: boolean;
  favorite?: boolean;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  language: SupportedLanguage;
  speechSpeed: number;
  speechPitch: number;
  voiceName: string;
  highContrast: boolean;
}
