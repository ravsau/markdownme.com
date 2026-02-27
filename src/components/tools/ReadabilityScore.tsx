"use client";

import { useState, useMemo } from "react";
import { stripMarkdown } from "@/lib/utils";

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!word) return 0;

  // Special short words
  if (word.length <= 2) return 1;

  // Count vowel groups
  const vowelGroups = word.match(/[aeiouy]+/g);
  let count = vowelGroups ? vowelGroups.length : 1;

  // Subtract silent e at end
  if (word.endsWith("e") && !word.endsWith("le") && count > 1) {
    count--;
  }

  // Ensure minimum 1 syllable
  return Math.max(1, count);
}

function getFleschLabel(
  score: number
): { label: string; color: string } {
  if (score >= 90)
    return {
      label: 'Very Easy (5th grade)',
      color: "text-green-600 dark:text-green-400",
    };
  if (score >= 80)
    return {
      label: 'Easy (6th grade)',
      color: "text-green-600 dark:text-green-400",
    };
  if (score >= 70)
    return {
      label: 'Fairly Easy (7th grade)',
      color: "text-emerald-600 dark:text-emerald-400",
    };
  if (score >= 60)
    return {
      label: 'Standard (8th-9th grade)',
      color: "text-blue-600 dark:text-blue-400",
    };
  if (score >= 50)
    return {
      label: 'Fairly Difficult (10th-12th grade)',
      color: "text-amber-600 dark:text-amber-400",
    };
  if (score >= 30)
    return {
      label: 'Difficult (College)',
      color: "text-orange-600 dark:text-orange-400",
    };
  return {
    label: 'Very Difficult (Graduate)',
    color: "text-red-600 dark:text-red-400",
  };
}

interface Metric {
  label: string;
  value: string | number;
}

function computeReadability(markdown: string): {
  metrics: Metric[];
  fleschLabel: { label: string; color: string };
} {
  const cleanText = stripMarkdown(markdown);

  const words = cleanText.split(/\s+/).filter((w) => w.length > 0);
  const totalWords = markdown.trim() === "" ? 0 : words.length;

  const sentences =
    markdown.trim() === ""
      ? []
      : cleanText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const totalSentences = sentences.length || (cleanText.trim() ? 1 : 0);

  const totalSyllables =
    totalWords === 0
      ? 0
      : words.reduce((sum, word) => sum + countSyllables(word), 0);

  const avgWordsPerSentence =
    totalSentences === 0 ? 0 : totalWords / totalSentences;
  const avgSyllablesPerWord =
    totalWords === 0 ? 0 : totalSyllables / totalWords;

  // Flesch Reading Ease
  const fleschScore =
    totalWords === 0
      ? 0
      : 206.835 -
        1.015 * avgWordsPerSentence -
        84.6 * avgSyllablesPerWord;
  const clampedFlesch = Math.max(0, Math.min(100, fleschScore));

  // Flesch-Kincaid Grade Level
  const fkGrade =
    totalWords === 0
      ? 0
      : 0.39 * avgWordsPerSentence +
        11.8 * avgSyllablesPerWord -
        15.59;
  const clampedGrade = Math.max(0, fkGrade);

  const fleschLabel = getFleschLabel(clampedFlesch);

  const metrics: Metric[] = [
    {
      label: "Flesch Reading Ease",
      value: totalWords === 0 ? "--" : clampedFlesch.toFixed(1),
    },
    {
      label: "Flesch-Kincaid Grade",
      value: totalWords === 0 ? "--" : clampedGrade.toFixed(1),
    },
    {
      label: "Avg Words / Sentence",
      value: totalWords === 0 ? "--" : avgWordsPerSentence.toFixed(1),
    },
    {
      label: "Avg Syllables / Word",
      value: totalWords === 0 ? "--" : avgSyllablesPerWord.toFixed(2),
    },
    { label: "Total Words", value: totalWords },
    { label: "Total Sentences", value: totalSentences },
  ];

  return { metrics, fleschLabel };
}

export default function ReadabilityScore() {
  const [input, setInput] = useState("");

  const { metrics, fleschLabel } = useMemo(
    () => computeReadability(input),
    [input]
  );

  const hasContent = input.trim().length > 0;

  return (
    <div className="space-y-6">
      <textarea
        className="tool-textarea min-h-[350px]"
        placeholder="Type or paste your markdown here for real-time readability analysis..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Readability label */}
      {hasContent && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center dark:border-gray-700 dark:bg-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Reading Level
          </p>
          <p className={`text-lg font-bold ${fleschLabel.color}`}>
            {fleschLabel.label}
          </p>
        </div>
      )}

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg border p-4">
            <div className="text-3xl font-bold text-indigo-600">
              {metric.value}
            </div>
            <div className="text-sm text-gray-500">{metric.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
