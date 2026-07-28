"use client";

import Link from "next/link";
import { Clock, GraduationCap, History, Trophy } from "lucide-react";
import { AuthPanel } from "@/components/auth-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { demoHistory } from "@/utils/constants";

const stats = [
  { label: "Time spent", value: "6h 20m", icon: Clock },
  { label: "Topics learned", value: "18", icon: GraduationCap },
  { label: "Quiz score", value: "83%", icon: Trophy },
  { label: "Progress streak", value: "5 days", icon: History }
];

export default function DashboardPage() {
  return (
    <main className="container py-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <div className="flex flex-col justify-between gap-4 rounded-lg bg-primary p-6 text-primary-foreground md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold opacity-90">Welcome back</p>
              <h1 className="mt-2 text-3xl font-bold">Continue learning with EduArtha</h1>
              <p className="mt-2 max-w-2xl opacity-90">
                Pick up from your recent explanations, revise bookmarked lessons, or start with a new English passage.
              </p>
            </div>
            <Button asChild variant="secondary" size="lg">
              <Link href="/explain">Continue Learning</Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label}>
                  <CardContent className="pt-5">
                    <Icon className="h-6 w-6 text-primary" />
                    <p className="mt-4 text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recently explained concepts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoHistory.map((item) => (
                <div key={item.title} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.language} explanation · {item.time}</p>
                  </div>
                  <span className="rounded-lg bg-secondary px-3 py-1 text-sm font-semibold">{item.score}%</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-lg bg-accent text-xl font-bold">EA</div>
                <div>
                  <p className="font-semibold">EduArtha Learner</p>
                  <p className="text-sm text-muted-foreground">Preferred language: Hindi</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <AuthPanel />
        </aside>
      </div>
    </main>
  );
}
