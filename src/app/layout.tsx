import type { Metadata, Viewport } from "next";
import { Navigation } from "@/components/navigation";
import { ServiceWorkerRegister } from "@/components/service-worker-register";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduArtha",
  description: "AI-powered pedagogical explanations for Indian adult and elderly learners.",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  themeColor: "#16877a"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ServiceWorkerRegister />
        <Navigation />
        {children}
      </body>
    </html>
  );
}
