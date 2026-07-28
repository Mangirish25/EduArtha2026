"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLocalHistory } from "@/services/history";
import type { HistoryItem } from "@/types";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setItems(getLocalHistory());
  }, []);

  return (
    <main className="container py-8">
      <h1 className="text-3xl font-bold">Learning History</h1>
      <p className="mt-2 text-muted-foreground">Stored input, explanation, language, timestamp, and quiz score.</p>
      <div className="mt-6 space-y-4">
        {items.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              No local history yet. Create your first explanation to begin tracking progress.
            </CardContent>
          </Card>
        )}
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>{item.input.slice(0, 64)}{item.input.length > 64 ? "..." : ""}</CardTitle>
                <div className="flex gap-2">
                  <Badge>{item.language}</Badge>
                  <Badge>{new Date(item.created_at).toLocaleString()}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-4 whitespace-pre-wrap leading-7 text-muted-foreground">{item.explanation}</p>
              <p className="mt-3 text-sm font-semibold">Quiz score: {item.quiz_score ?? "Not attempted"}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
