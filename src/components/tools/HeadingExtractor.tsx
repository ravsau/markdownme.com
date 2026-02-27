"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

interface Heading {
  level: number;
  text: string;
}

const levelStyles: Record<number, string> = {
  1: "text-indigo-600 bg-indigo-50 dark:text-indigo-300 dark:bg-indigo-950",
  2: "text-blue-600 bg-blue-50 dark:text-blue-300 dark:bg-blue-950",
  3: "text-cyan-600 bg-cyan-50 dark:text-cyan-300 dark:bg-cyan-950",
  4: "text-teal-600 bg-teal-50 dark:text-teal-300 dark:bg-teal-950",
  5: "text-emerald-600 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950",
  6: "text-green-600 bg-green-50 dark:text-green-300 dark:bg-green-950",
};

export default function HeadingExtractor() {
  const [markdownInput, setMarkdownInput] = useState("");
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [copied, setCopied] = useState(false);

  const handleExtract = () => {
    if (!markdownInput.trim()) return;

    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const results: Heading[] = [];
    let match: RegExpExecArray | null;

    while ((match = headingRegex.exec(markdownInput)) !== null) {
      results.push({
        level: match[1].length,
        text: match[2].trim(),
      });
    }

    setHeadings(results);
  };

  const getPlainTextOutline = (): string => {
    return headings
      .map((h) => {
        const indent = "  ".repeat(h.level - 1);
        return `${indent}${h.text}`;
      })
      .join("\n");
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(getPlainTextOutline());
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Markdown Input
        </label>
        <textarea
          value={markdownInput}
          onChange={(e) => setMarkdownInput(e.target.value)}
          className="tool-textarea min-h-[350px]"
          placeholder="Paste your markdown here..."
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleExtract}
          disabled={!markdownInput.trim()}
          className="tool-btn"
        >
          Extract Headings
        </button>
      </div>

      {headings.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Found{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {headings.length}
              </span>{" "}
              heading{headings.length !== 1 ? "s" : ""}
            </p>
            <button
              onClick={handleCopy}
              className="tool-btn-secondary"
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy as Plain Text"}
            </button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
            <ul className="space-y-1.5">
              {headings.map((heading, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2"
                  style={{ marginLeft: `${(heading.level - 1) * 16}px` }}
                >
                  <span
                    className={`inline-flex items-center justify-center rounded px-1.5 py-0.5 text-xs font-semibold ${levelStyles[heading.level]}`}
                  >
                    H{heading.level}
                  </span>
                  <span className="text-sm text-gray-900 dark:text-gray-100">
                    {heading.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
