"use client";

import { useEffect, useState } from "react";
import type { UserSettings } from "@/types";

const defaultSettings: UserSettings = {
  theme: "light",
  language: "Hindi",
  speechSpeed: 0.95,
  speechPitch: 1,
  voiceName: "",
  highContrast: false
};

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  useEffect(() => {
    const stored = localStorage.getItem("eduartha_settings");
    if (stored) setSettings({ ...defaultSettings, ...JSON.parse(stored) });
  }, []);

  useEffect(() => {
    localStorage.setItem("eduartha_settings", JSON.stringify(settings));
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
    document.documentElement.classList.toggle("high-contrast", settings.highContrast);
  }, [settings]);

  return { settings, setSettings };
}
