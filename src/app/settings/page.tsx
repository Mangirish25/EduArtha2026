"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/hooks/use-settings";
import { SUPPORTED_LANGUAGES } from "@/utils/constants";
import type { SupportedLanguage } from "@/types";

export default function SettingsPage() {
  const { settings, setSettings } = useSettings();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => setVoices(window.speechSynthesis?.getVoices() || []);
    loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);
    return () => window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
  }, []);

  return (
    <main className="container max-w-3xl py-8">
      <h1 className="text-3xl font-bold">User Settings</h1>
      <p className="mt-2 text-muted-foreground">Tune EduArtha for readability, language, and voice comfort.</p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <label className="grid gap-2 font-semibold">
            Theme
            <Select
              value={settings.theme}
              onChange={(event) => setSettings({ ...settings, theme: event.target.value as "light" | "dark" | "system" })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </Select>
          </label>
          <label className="grid gap-2 font-semibold">
            Default language
            <Select
              value={settings.language}
              onChange={(event) => setSettings({ ...settings, language: event.target.value as SupportedLanguage })}
            >
              {SUPPORTED_LANGUAGES.map((language) => (
                <option key={language}>{language}</option>
              ))}
            </Select>
          </label>
          <label className="grid gap-2 font-semibold">
            Speech speed: {settings.speechSpeed.toFixed(2)}
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.05"
              value={settings.speechSpeed}
              onChange={(event) => setSettings({ ...settings, speechSpeed: Number(event.target.value) })}
            />
          </label>
          <label className="grid gap-2 font-semibold">
            Speech pitch: {settings.speechPitch.toFixed(2)}
            <input
              type="range"
              min="0.7"
              max="1.4"
              step="0.05"
              value={settings.speechPitch}
              onChange={(event) => setSettings({ ...settings, speechPitch: Number(event.target.value) })}
            />
          </label>
          <label className="grid gap-2 font-semibold">
            Voice selection
            <Select
              value={settings.voiceName}
              onChange={(event) => setSettings({ ...settings, voiceName: event.target.value })}
            >
              <option value="">Browser default</option>
              {voices.map((voice) => (
                <option key={voice.name} value={voice.name}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </Select>
          </label>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div>
              <p className="font-semibold">High contrast mode</p>
              <p className="text-sm text-muted-foreground">Improves readability for low-vision learners.</p>
            </div>
            <Switch
              label="High contrast mode"
              checked={settings.highContrast}
              onCheckedChange={(checked) => setSettings({ ...settings, highContrast: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
