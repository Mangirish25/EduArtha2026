import { NextResponse } from "next/server";
import { z } from "zod";
import { callGemma } from "@/services/ai";
import { SUPPORTED_LANGUAGES, LEARNING_MODES } from "@/utils/constants";

const requestSchema = z.object({
  input: z.string().min(1, "Please enter content to explain."),
  inputLanguage: z.string().default("English"),
  outputLanguage: z.enum(SUPPORTED_LANGUAGES),
  mode: z.enum(LEARNING_MODES),
  action: z.enum(["Explain", "Summarize", "Simplify", "Generate Quiz", "Chat"]),
  followUp: z.string().optional()
});

export async function POST(request: Request) {
  try {
    const payload = requestSchema.parse(await request.json());
    const result = await callGemma(payload);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Something went wrong.";
    const lower = message.toLowerCase();
    const status =
      lower.includes("api key") || lower.includes("api_key")
        ? 503
        : lower.includes("rate limit") || lower.includes("quota")
        ? 429
        : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

