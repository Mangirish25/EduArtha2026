import type { LearningMode, SupportedLanguage } from "@/types";

export const SUPPORTED_LANGUAGES = [
  "Hindi",
  "Marathi",
  "Gujarati",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Punjabi",
  "Bengali",
  "Odia"
] as const satisfies readonly SupportedLanguage[];

export const LEARNING_MODES = [
  "Simple",
  "Detailed",
  "Exam Preparation",
  "Child Friendly"
] as const satisfies readonly LearningMode[];

export const demoHistory = [
  {
    title: "Photosynthesis",
    language: "Hindi",
    score: 82,
    time: "Today"
  },
  {
    title: "Demand and Supply",
    language: "Marathi",
    score: 76,
    time: "Yesterday"
  },
  {
    title: "Newton's Laws",
    language: "Tamil",
    score: 91,
    time: "Mon"
  }
];
