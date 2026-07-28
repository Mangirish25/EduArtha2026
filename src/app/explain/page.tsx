"use client";

import { useState } from "react";
import { FileText, Image as ImageIcon, Link as LinkIcon, Loader2, Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { ResultPanel } from "@/components/result-panel";
import { LEARNING_MODES, SUPPORTED_LANGUAGES } from "@/utils/constants";
import { saveHistory } from "@/services/history";
import { uid } from "@/lib/utils";
import type { ExplainAction, ExplanationResult, LearningMode, SupportedLanguage } from "@/types";

import { useSettings } from "@/hooks/use-settings";
import { useSpeech } from "@/hooks/use-speech";

async function extractPdfText(file: File) {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ("str" in item ? item.str : "")).join(" "));
  }
  return pages.join("\n\n");
}

async function extractImageText(file: File) {
  const { createWorker } = await import("tesseract.js");
  const worker = await createWorker("eng");
  const result = await worker.recognize(file);
  await worker.terminate();
  return result.data.text;
}

export default function ExplainPage() {
  const { settings } = useSettings();
  const [input, setInput] = useState("");
  const [inputLanguage, setInputLanguage] = useState("English");
  const [outputLanguage, setOutputLanguage] = useState<SupportedLanguage>(settings.language || "Hindi");
  const speech = useSpeech(outputLanguage);
  const [mode, setMode] = useState<LearningMode>("Simple");
  const [result, setResult] = useState<ExplanationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [followUp, setFollowUp] = useState("");


  async function runAction(action: ExplainAction, question = "") {
    setError("");
    if (!input.trim()) {
      setError("Please paste textbook text, notes, a lecture transcript, or extracted content first.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, inputLanguage, outputLanguage, mode, action, followUp: question })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Network failure. Please try again.");
      setResult(data);


      // Bug 9 Fix: Automatically read aloud AI response after every action
      if (data.explanation && speech.isSynthesisSupported) {
        speech.speak(data.explanation, {
          language: outputLanguage,
          rate: settings.speechSpeed,
          pitch: settings.speechPitch,
          voiceName: settings.voiceName
        });
      }

      await saveHistory({

        id: uid("history"),
        input,
        explanation: data.explanation,
        language: outputLanguage,
        mode,
        quiz_score: null,
        created_at: new Date().toISOString(),
        bookmarked: false,
        favorite: false
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Network failure. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file?: File) {
    if (!file) return;
    setError("");
    setLoading(true);
    try {
      if (file.type === "application/pdf") {
        setInput(await extractPdfText(file));
      } else if (file.type.startsWith("image/")) {
        setInput(await extractImageText(file));
      } else {
        setInput(await file.text());
      }
    } catch {
      setError("Could not read that file. Try copying the text manually.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchTranscript() {
    setError("");
    if (!youtubeUrl.trim()) return setError("Paste a YouTube URL first.");
    setLoading(true);
    try {
      const response = await fetch("/api/youtube-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: youtubeUrl })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setInput(data.text);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Transcript fetch failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Explain Screen</h1>
        <p className="mt-2 text-muted-foreground">
          Paste English learning material and receive a teacher-like explanation in your chosen language.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Learning material</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Paste textbook content, PDF text, lecture transcript, or notes here..."
                aria-label="Learning material input"
              />

              <div className="grid gap-3 md:grid-cols-2">
                <label className="grid gap-2 text-sm font-semibold">
                  Input language
                  <Input value={inputLanguage} onChange={(event) => setInputLanguage(event.target.value)} />
                </label>
                <label className="grid gap-2 text-sm font-semibold">
                  Output language
                  <Select
                    value={outputLanguage}
                    onChange={(event) => setOutputLanguage(event.target.value as SupportedLanguage)}
                  >
                    {SUPPORTED_LANGUAGES.map((language) => (
                      <option key={language}>{language}</option>
                    ))}
                  </Select>
                </label>
              </div>

              <div className="grid gap-2">
                <p className="text-sm font-semibold">Learning mode</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {LEARNING_MODES.map((item) => (
                    <button
                      key={item}
                      onClick={() => setMode(item)}
                      className={`rounded-lg border px-3 py-3 text-left font-semibold ${
                        mode === item ? "border-primary bg-accent text-primary" : "hover:bg-secondary"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold hover:bg-secondary">
                  <FileText className="h-4 w-4" />
                  Upload PDF/Text
                  <input className="sr-only" type="file" accept=".pdf,.txt" onChange={(e) => handleUpload(e.target.files?.[0])} />
                </label>
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-3 text-sm font-semibold hover:bg-secondary">
                  <ImageIcon className="h-4 w-4" />
                  OCR Image
                  <input className="sr-only" type="file" accept="image/*" onChange={(e) => handleUpload(e.target.files?.[0])} />
                </label>
                <Button variant="outline" onClick={fetchTranscript}>
                  <LinkIcon className="h-4 w-4" />
                  Transcript
                </Button>
              </div>

              <Input
                value={youtubeUrl}
                onChange={(event) => setYoutubeUrl(event.target.value)}
                placeholder="Optional YouTube URL for transcript"
              />

              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {(["Explain", "Summarize", "Simplify", "Generate Quiz"] as ExplainAction[]).map((action) => (
                  <Button key={action} onClick={() => runAction(action)} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {action}
                  </Button>
                ))}
              </div>

              {result && (
                <div className="flex gap-2">
                  <Input
                    value={followUp}
                    onChange={(event) => setFollowUp(event.target.value)}
                    placeholder="Ask a follow-up question..."
                  />
                  <Button onClick={() => runAction("Chat", followUp)} disabled={loading} aria-label="Ask follow-up">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {error && (
                <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm font-semibold text-destructive">
                  {error}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.section>
        <ResultPanel result={result} />
      </div>
    </main>
  );
}
