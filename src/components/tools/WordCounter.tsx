"use client";

import { useState, useMemo } from "react";
import { stripMarkdown } from "@/lib/utils";

interface Stat {
  label: string;
  value: string | number;
}

function computeStats(markdown: string): Stat[] {
  const cleanText = stripMarkdown(markdown);

  const words = cleanText
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const wordCount = markdown.trim() === "" ? 0 : words.length;

  const charsWithSpaces = cleanText.length;
  const charsWithoutSpaces = cleanText.replace(/\s/g, "").length;

  const sentences =
    markdown.trim() === ""
      ? 0
      : (cleanText.match(/[.!?]+/g) || []).length || (cleanText.trim() ? 1 : 0);

  const paragraphs =
    markdown.trim() === ""
      ? 0
      : cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length || (cleanText.trim() ? 1 : 0);

  const totalSeconds = Math.round((wordCount / 200) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const readingTime =
    wordCount === 0
      ? "0 min 0 sec"
      : `${minutes} min ${seconds} sec`;

  return [
    { label: "Words", value: wordCount },
    { label: "Characters (no spaces)", value: charsWithoutSpaces },
    { label: "Characters (with spaces)", value: charsWithSpaces },
    { label: "Sentences", value: sentences },
    { label: "Paragraphs", value: paragraphs },
    { label: "Reading Time", value: readingTime },
  ];
}

export default function WordCounter() {
  const [input, setInput] = useState("");

  const stats = useMemo(() => computeStats(input), [input]);

  return (
    <div className="space-y-6">
      <textarea
        className="tool-textarea min-h-[350px]"
        placeholder="Type or paste your markdown here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border p-4"
          >
            <div className="text-3xl font-bold text-indigo-600">
              {stat.value}
            </div>
            <div className="text-sm text-gray-500">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
