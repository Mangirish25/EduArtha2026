"use client";

import { Bookmark, Download, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExplanationResult } from "@/types";
import { exportExplanationPdf } from "@/services/export";

interface ResultPanelProps {
  result: ExplanationResult | null;
}

export function ResultPanel({ result }: ResultPanelProps) {
  if (!result) {
    return (
      <Card className="min-h-[360px]">
        <CardContent className="grid min-h-[360px] place-items-center text-center text-muted-foreground">
          <div>
            <p className="text-lg font-semibold text-foreground">Your explanation will appear here.</p>
            <p className="mt-2">Paste English content, choose a mode, and let EduArtha teach it gently.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle>AI Explanation</CardTitle>
          <p className="text-sm text-muted-foreground">Pedagogical explanation, not literal translation.</p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" title="Bookmark">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" title="Favorite">
            <Heart className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Export PDF"
            onClick={() => exportExplanationPdf("EduArtha Explanation", result.explanation)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Share"
            onClick={() => navigator.share?.({ title: "EduArtha Explanation", text: result.summary })}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <section className="prose prose-lg max-w-none dark:prose-invert">
          <p className="whitespace-pre-wrap leading-8">{result.explanation}</p>
        </section>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-secondary p-4">
            <Badge>Summary</Badge>
            <p className="mt-3 leading-7">{result.summary}</p>
          </div>
          <div className="rounded-lg bg-accent p-4">
            <Badge>Example</Badge>
            <p className="mt-3 leading-7">{result.example}</p>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-lg font-semibold">Quiz</h4>
          <div className="space-y-3">
            {result.quiz.map((question, index) => (
              <div key={question.id || index} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge>{question.type}</Badge>
                  <span className="text-sm text-muted-foreground">Question {index + 1}</span>
                </div>
                <p className="font-medium">{question.question}</p>
                {question.options && (
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {question.options.map((option) => (
                      <button
                        key={option}
                        className="rounded-lg border px-3 py-2 text-left text-sm hover:bg-secondary"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-semibold text-primary">Show answer</summary>
                  <p className="mt-2 text-sm">{question.answer}</p>
                </details>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
