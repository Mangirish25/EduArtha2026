"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, Languages, Mic, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  { icon: Languages, title: "Native-language teaching", text: "Explains ideas in Hindi, Marathi, Tamil, Bengali, and more without word-by-word translation." },
  { icon: BookOpenText, title: "Pedagogy first", text: "Every answer includes a concept explanation, simple summary, example, and quiz question." },
  { icon: ShieldCheck, title: "Learner-safe design", text: "Large type, keyboard navigation, high contrast mode, and clear error states for confidence." }
];

export default function LandingPage() {
  return (
    <main>
      <section className="edu-gradient">
        <div className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
            <div className="inline-flex rounded-lg border bg-background/70 px-3 py-1 text-sm font-semibold text-primary">
              Built for Indian adult learners
            </div>
            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-normal md:text-6xl">
              Understand English. Learn in Your Own Language.
            </h1>
            <p className="max-w-2xl text-xl leading-8 text-muted-foreground">
              EduArtha turns English textbooks, notes, lectures, and transcripts into friendly explanations
              with everyday analogies, summaries, and quiz practice.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/explain">
                  Start Learning <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className="rounded-lg border bg-card p-5 shadow-soft"
          >
            <div className="rounded-lg bg-secondary p-5">
              <p className="text-sm font-semibold text-primary">English input</p>
              <p className="mt-3 text-2xl font-semibold">Photosynthesis is the process by which plants make food...</p>
            </div>
            <div className="mt-4 rounded-lg bg-background p-5">
              <p className="text-sm font-semibold text-primary">Hindi explanation</p>
              <p className="mt-3 leading-8">
                Sochiye plant ek chhoti kitchen ki tarah hai. Sunlight uska gas stove hai, water aur carbon dioxide
                ingredients hain, aur glucose uska food hai.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.title}>
                <CardHeader>
                  <Icon className="h-8 w-8 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">{feature.text}</CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-muted/45 py-16">
        <div className="container grid gap-6 md:grid-cols-3">
          {["My father finally understood banking terms.", "The examples feel like a local teacher.", "Voice mode helps my mother revise daily."].map((quote, index) => (
            <Card key={quote}>
              <CardContent className="pt-5">
                <p className="text-lg leading-8">"{quote}"</p>
                <p className="mt-4 text-sm font-semibold text-primary">Learner family {index + 1}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="text-3xl font-bold">FAQ</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            ["Is it translation?", "No. EduArtha explains concepts like a teacher and keeps technical terms in English where helpful."],
            ["Which languages are supported?", "Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Punjabi, Bengali, and Odia."],
            ["Can I use speech?", "Yes. Modern browsers support speech recognition and text-to-speech controls."],
            ["Are API keys safe?", "Keys are read from environment variables and never hardcoded in the app."]
          ].map(([q, a]) => (
            <Card key={q}>
              <CardHeader>
                <CardTitle>{q}</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{a}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
