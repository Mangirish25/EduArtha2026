"use client";

import { useState } from "react";
import { Chrome, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getSupabaseClient, isSupabaseConfigured, supabaseEnvStatus } from "@/lib/supabase";

export function AuthPanel() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function signInWithGoogle() {
    const supabase = await getSupabaseClient();
    if (!supabase) return setMessage("Supabase is not configured yet.");
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/dashboard" }
    });
  }

  async function signInWithEmail() {
    const supabase = await getSupabaseClient();
    if (!supabase) return setMessage("Supabase is not configured yet.");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + "/dashboard" }
    });
    setMessage(error ? error.message : "Check your email for the login link.");
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>Sign in to sync learning</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isSupabaseConfigured && (
          <p className="rounded-lg bg-amber-100 p-3 text-sm text-amber-950">
            {supabaseEnvStatus.message} Local learning history still works.
          </p>
        )}
        <Button className="w-full" onClick={signInWithGoogle}>
          <Chrome className="h-4 w-4" />
          Continue with Google
        </Button>
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button variant="outline" onClick={signInWithEmail} aria-label="Email login">
            <Mail className="h-4 w-4" />
          </Button>
        </div>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
      </CardContent>
    </Card>
  );
}
