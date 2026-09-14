"use client";

import { useState } from "react";
import SearchBox from "@/components/SearchBox";
import ConfirmScreen from "@/components/ConfirmScreen";
import StackCard from "@/components/StackCard";
import { matchStack } from "@/lib/matcher";
import { buildStarterPrompt } from "@/lib/starter-prompt";
import type {
  ExtractedTags,
  ExtractionResponse,
  MatchResult,
} from "@/lib/types";

type Step = "input" | "confirm" | "result";

export default function Home() {
  const [step, setStep] = useState<Step>("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  const [tags, setTags] = useState<ExtractedTags | null>(null);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [starterPrompt, setStarterPrompt] = useState("");

  async function handleExtract(idea: string) {
    setLoading(true);
    setError(null);
    setBanner(null);
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = (await res.json()) as ExtractionResponse;

      if (data.status === "too-vague" || data.status === "rate-limited") {
        // Stay on input, show the friendly message.
        setError(data.message ?? "Try describing your idea a little differently.");
        return;
      }

      // ok or fallback → move to confirm (fallback carries a gentle banner).
      setTags(data.tags);
      setBanner(data.status === "fallback" ? data.message ?? null : null);
      setStep("confirm");
    } catch {
      setError(
        "Couldn't reach the analyzer. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleConfirm(confirmed: ExtractedTags) {
    const matched = matchStack(confirmed);
    setTags(confirmed);
    setResult(matched);
    setStarterPrompt(buildStarterPrompt(confirmed, matched));
    setStep("result");
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  function reset() {
    setStep("input");
    setTags(null);
    setResult(null);
    setError(null);
    setBanner(null);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  return (
    <main>
      {step === "input" && (
        <SearchBox onSubmit={handleExtract} loading={loading} error={error} />
      )}

      {step === "confirm" && tags && (
        <ConfirmScreen
          initial={tags}
          banner={banner}
          onBack={reset}
          onConfirm={handleConfirm}
        />
      )}

      {step === "result" && tags && result && (
        <StackCard
          tags={tags}
          result={result}
          starterPrompt={starterPrompt}
          onBack={reset}
        />
      )}
    </main>
  );
}
