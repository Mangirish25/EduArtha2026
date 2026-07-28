import { getSupabaseClient } from "@/lib/supabase";
import type { HistoryItem } from "@/types";

const LOCAL_KEY = "eduartha_history";

export function getLocalHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]") as HistoryItem[];
}

export function saveLocalHistory(item: HistoryItem) {
  if (typeof window === "undefined") return;
  const next = [item, ...getLocalHistory()].slice(0, 50);
  localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
}

export async function saveHistory(item: HistoryItem) {
  saveLocalHistory(item);
  const supabase = await getSupabaseClient();
  if (!supabase) return;
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("learning_history").insert({
    user_id: user.id,
    input: item.input,
    explanation: item.explanation,
    language: item.language,
    mode: item.mode,
    quiz_score: item.quiz_score,
    bookmarked: item.bookmarked,
    favorite: item.favorite
  });
}
