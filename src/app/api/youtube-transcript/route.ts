import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url } = (await request.json()) as { url?: string };
    if (!url) return NextResponse.json({ error: "YouTube URL is required." }, { status: 400 });
    const { YoutubeTranscript } = await import("youtube-transcript");
    const transcript = await YoutubeTranscript.fetchTranscript(url);
    return NextResponse.json({ text: transcript.map((item) => item.text).join(" ") });
  } catch {
    return NextResponse.json(
      { error: "Transcript is unavailable for this video. Try pasting notes manually." },
      { status: 400 }
    );
  }
}
