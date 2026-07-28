import "server-only";

import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import { AI_MODEL } from "@/config/ai";
import type { ExplainAction, ExplanationResult, LearningMode, SupportedLanguage } from "@/types";
import { safeJsonParse, uid } from "@/lib/utils";

interface GenerateArgs {
  input: string;
  inputLanguage: string;
  outputLanguage: SupportedLanguage;
  mode: LearningMode;
  action: ExplainAction;
  followUp?: string;
}

const fallbackResult: ExplanationResult = {
  explanation: "No explanation was returned.",
  summary: "Try again with a shorter passage.",
  example: "No example available.",
  quiz: [
    {
      id: uid("quiz"),
      type: "One-line",
      question: "What is the main idea?",
      answer: "Review the explanation and answer in your own words."
    }
  ]
};

export interface LanguageScriptRule {
  scriptName: string;
  instructions: string;
  correctExample: string;
  wrongExample: string;
}

export const LANGUAGE_SCRIPT_MAP: Record<SupportedLanguage, LanguageScriptRule> = {
  Hindi: {
    scriptName: "Devanagari script (देवनागरी)",
    instructions: "Write strictly in Hindi using Devanagari script. NEVER use Romanized Hindi or Hinglish.",
    correctExample: "यह React का Virtual DOM है।",
    wrongExample: "Arre doston, ye React ka Virtual DOM hai."
  },
  Marathi: {
    scriptName: "Devanagari script (देवनागरी)",
    instructions: "Write strictly in Marathi using Devanagari script. NEVER use Romanized Marathi.",
    correctExample: "React चे Virtual DOM अतिशय कार्यक्षम आहे.",
    wrongExample: "React che Virtual DOM khup karya-ksham ahe."
  },
  Gujarati: {
    scriptName: "Gujarati script (ગુજરાતી)",
    instructions: "Write strictly in Gujarati script. NEVER use Romanized Gujarati or English alphabets for Gujarati text.",
    correctExample: "React નું Virtual DOM ખૂબ જ ઝડપી છે.",
    wrongExample: "React nu Virtual DOM khub j zedpi che."
  },
  Tamil: {
    scriptName: "Tamil script (தமிழ்)",
    instructions: "Write strictly in Tamil script. NEVER use Romanized Tamil.",
    correctExample: "React இன் Virtual DOM மிகவும் வேகமாக செயல்படுகிறது.",
    wrongExample: "React in Virtual DOM migavum vegamaagach seyalpadugiradhu."
  },
  Telugu: {
    scriptName: "Telugu script (తెలుగు)",
    instructions: "Write strictly in Telugu script. NEVER use Romanized Telugu.",
    correctExample: "React యొక్క Virtual DOM చాలా వేగంగా పనిచేస్తుంది.",
    wrongExample: "React yokka Virtual DOM chala veganga panichesthundi."
  },
  Kannada: {
    scriptName: "Kannada script (ಕನ್ನಡ)",
    instructions: "Write strictly in Kannada script. NEVER use Romanized Kannada.",
    correctExample: "React ನ Virtual DOM ತುಂಬಾ ವೇಗವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.",
    wrongExample: "React na Virtual DOM tumba vegavagi karyanirvahisuttade."
  },
  Malayalam: {
    scriptName: "Malayalam script (മലയാളം)",
    instructions: "Write strictly in Malayalam script. NEVER use Romanized Malayalam.",
    correctExample: "React ന്റെ Virtual DOM വളരെ വേഗത്തിലാണ് പ്രവർത്തിക്കുന്നത്.",
    wrongExample: "React nte Virtual DOM valare vegathilaanu pravarthikkunnathu."
  },
  Punjabi: {
    scriptName: "Gurmukhi script (ਗੁਰਮੁਖੀ)",
    instructions: "Write strictly in Punjabi using Gurmukhi script. NEVER use Shahmukhi or Romanized Punjabi.",
    correctExample: "React ਦਾ Virtual DOM ਬਹੁਤ ਤੇਜ਼ ਹੈ।",
    wrongExample: "React da Virtual DOM bahut tez hai."
  },
  Bengali: {
    scriptName: "Bengali script (বাংলা)",
    instructions: "Write strictly in Bengali script. NEVER use Romanized Bengali.",
    correctExample: "React-এর Virtual DOM খুব দ্রুত কাজ করে।",
    wrongExample: "React-er Virtual DOM khub druto kaj kore."
  },
  Odia: {
    scriptName: "Odia script (ଓଡ଼ିଆ)",
    instructions: "Write strictly in Odia script. NEVER use Romanized Odia.",
    correctExample: "React ର Virtual DOM ବହୁତ ଦ୍ରୁତ କାମ କରେ।",
    wrongExample: "React ra Virtual DOM bahut druta kaam kare."
  }
};

export function getLanguageInstruction(language: SupportedLanguage): string {
  const rule = LANGUAGE_SCRIPT_MAP[language];
  if (!rule) {
    return `CRITICAL LANGUAGE RULE FOR ${language.toUpperCase()}:
- Write ALL output strictly using the native writing system of ${language}.
- NEVER use Roman transliteration or English letters for ${language} words.`;
  }

  return `CRITICAL LANGUAGE & SCRIPT RULE FOR ${language.toUpperCase()}:
- ${rule.instructions}
- Target Script: ${rule.scriptName}.
- Correct Example: "${rule.correctExample}"
- FORBIDDEN (Wrong Example): "${rule.wrongExample}"
- Absolute prohibition: NEVER write ${language} words in Roman/English alphabets.`;
}

export function buildEduArthaPrompt(args: GenerateArgs) {
  const languageInstruction = getLanguageInstruction(args.outputLanguage);

  return `You are EduArtha, an empathetic, patient, and knowledgeable AI teacher. EduArtha is designed for students, adults, elderly people, and rural learners who often cannot understand English or read English alphabets.

====================================================
1. MANDATORY NATIVE SCRIPT POLICY (CRITICAL)
====================================================
${languageInstruction}

- NO ROMAN TRANSLITERATION: Never write Indian languages using English letters (e.g., Hinglish, Tanglish, etc. are STRICTLY FORBIDDEN).
- TECHNICAL TERMS EXCEPTION: Only essential technical computer science & software terms (such as React, Virtual DOM, Component, Hook, Props, State, Node.js, JavaScript, TypeScript, etc.) may remain in English script.
- ACCESSIBILITY FORMAT: When a technical English term is necessary, write it as: Virtual DOM (Virtual DOM), and immediately explain it in simple ${args.outputLanguage} using native script.
- All non-technical words, explanations, summaries, everyday analogies, quiz questions, options, and answers MUST be written in the native script of ${args.outputLanguage}.

====================================================
2. TEACHING STYLE & PERSONA
====================================================
- Tone: Calm, respectful, clear, classroom teacher tone.
- FORBIDDEN GREETINGS: You are NOT a YouTuber or influencer. NEVER use greetings like "Hello friends", "Arre doston", "Guys", or "Welcome back".
- PEDAGOGICAL PHRASES: Use respectful teacher phrases such as "मान लीजिए" (Suppose/Imagine), "उदाहरण के लिए" (For example), "कल्पना कीजिए" (Imagine), or their exact equivalents in ${args.outputLanguage}.

====================================================
3. READABILITY & ACCESSIBILITY
====================================================
- Audience: Learner with limited English knowledge (Class 6–8 reading level).
- Style: Use short sentences, simple everyday vocabulary, and familiar real-world analogies.
- Avoid: Overly complex, literary, formal, or Sanskrit-heavy words. Make it simple and easy to understand.

====================================================
4. PEDAGOGIC TASK & MODE
====================================================
- Do NOT perform literal line-by-line translation. Teach and explain the concepts pedagogical style.
- Learning Mode: ${args.mode}.
- Action Requested: ${args.action}.
- Input Language: ${args.inputLanguage}.

====================================================
5. OUTPUT FORMAT & JSON SCHEMA
====================================================
Return valid JSON ONLY with this exact shape:
{
  "explanation": "pedagogical explanation in native script",
  "summary": "short summary in native script",
  "example": "everyday example in native script",
  "quiz": [
    {
      "id": "q1",
      "type": "MCQ",
      "question": "question text in native script",
      "options": ["Option A in native script", "Option B in native script", "Option C in native script", "Option D in native script"],
      "answer": "correct answer in native script"
    }
  ]
}

Include a mix of question types (MCQ, True/False, Fill in blanks, One-line) when generating a quiz. Ensure all fields inside the JSON adhere strictly to the native script rules.

Learner Content to Explain:
${args.input}

${args.followUp ? `Follow-up Question: ${args.followUp}` : ""}`;
}


function getErrorText(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "";
  }
}

function normalizeGoogleAiError(error: unknown) {
  const text = getErrorText(error);
  const lower = text.toLowerCase();

  if (lower.includes("api key") || lower.includes("apikey") || lower.includes("permission_denied") || lower.includes("unauthenticated")) {
    return "Google AI API key is invalid or not authorized. Check GOOGLE_API_KEY in .env.local.";
  }

  if (lower.includes("not_found") || lower.includes("not found") || lower.includes("404") || lower.includes("model")) {
    return `The configured AI model "${AI_MODEL}" was not found or is unavailable for this API key. Update AI_MODEL in src/config/ai.ts.`;
  }

  if (lower.includes("rate") || lower.includes("429")) {
    return "Google AI rate limit reached. Please wait a moment and try again.";
  }

  if (lower.includes("quota") || lower.includes("resource_exhausted") || lower.includes("billing")) {
    return "Google AI quota is exhausted or billing is not enabled for this key.";
  }

  if (lower.includes("fetch") || lower.includes("network") || lower.includes("econn") || lower.includes("timeout")) {
    return "Network error while contacting Google AI. Check your connection and try again.";
  }

  return "Google AI request failed. Please try again with a shorter passage or check your configuration.";
}

function validateEduArthaResult(value: ExplanationResult) {
  if (!value.explanation?.trim() || !value.summary?.trim() || !value.example?.trim() || !Array.isArray(value.quiz)) {
    throw new Error("Invalid JSON returned by Google AI. EduArtha expected explanation, summary, example, and quiz fields.");
  }

  return {
    ...value,
    quiz: value.quiz.map((question) => ({
      ...question,
      id: question.id || uid("quiz")
    }))
  };
}

function logDevelopmentMetadata(response: GenerateContentResponse, durationMs: number) {
  if (process.env.NODE_ENV !== "development") return;

  console.log("[EduArtha AI]", {
    model: AI_MODEL,
    durationMs,
    tokenUsage: response.usageMetadata ?? null,
    metadata: {
      modelVersion: response.modelVersion,
      responseId: response.responseId,
      promptFeedback: response.promptFeedback,
      sdkHttpResponse: response.sdkHttpResponse
    }
  });
}

export async function callGemma(args: GenerateArgs) {
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY is missing. Add it to .env.local before using AI features.");
  }

  const prompt = buildEduArthaPrompt(args);
  const startedAt = Date.now();

  try {
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_API_KEY!
    });

    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents: prompt,
      config: {
        temperature: 0.55,
        topP: 0.9,
        responseMimeType: "application/json"
      }
    });

    logDevelopmentMetadata(response, Date.now() - startedAt);

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Empty response returned by Google AI.");
    }

    const parsed = safeJsonParse<ExplanationResult>(text, fallbackResult);
    if (parsed === fallbackResult && text !== fallbackResult.explanation) {
      throw new Error("Invalid JSON returned by Google AI.");
    }

    return validateEduArthaResult(parsed);
  } catch (error) {
    const message = getErrorText(error);
    if (
      message.includes("Empty response") ||
      message.includes("Invalid JSON") ||
      message.includes("GOOGLE_API_KEY is missing")
    ) {
      throw new Error(message);
    }

    throw new Error(normalizeGoogleAiError(error));
  }
}

