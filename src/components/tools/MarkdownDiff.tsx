"use client";

import { useState } from "react";
import { diffLines } from "diff";
import { GitCompareArrows, Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

interface DiffResult {
  value: string;
  added?: boolean;
  removed?: boolean;
}

export default function MarkdownDiff() {
  const [original, setOriginal] = useState("");
  const [modified, setModified] = useState("");
  const [diffResult, setDiffResult] = useState<DiffResult[]>([]);
  const [stats, setStats] = useState({ additions: 0, deletions: 0 });
  const [copied, setCopied] = useState(false);

  const handleCompare = () => {
    if (!original.trim() && !modified.trim()) return;

    const result = diffLines(original, modified);
    setDiffResult(result);

    let additions = 0;
    let deletions = 0;
    for (const part of result) {
      const lineCount = part.value.split("\n").filter((l) => l !== "").length;
      if (part.added) additions += lineCount;
      if (part.removed) deletions += lineCount;
    }
    setStats({ additions, deletions });
  };

  const getDiffText = (): string => {
    return diffResult
      .map((part) => {
        const lines = part.value.split("\n").filter((l) => l !== "");
        return lines
          .map((line) => {
            if (part.added) return `+ ${line}`;
            if (part.removed) return `- ${line}`;
            return `  ${line}`;
          })
          .join("\n");
      })
      .join("\n");
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(getDiffText());
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Original
          </label>
          <textarea
            value={original}
            onChange={(e) => setOriginal(e.target.value)}
            className="tool-textarea min-h-[400px]"
            placeholder="Paste the original markdown here..."
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Modified
          </label>
          <textarea
            value={modified}
            onChange={(e) => setModified(e.target.value)}
            className="tool-textarea min-h-[400px]"
            placeholder="Paste the modified markdown here..."
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          disabled={!original.trim() && !modified.trim()}
          className="tool-btn"
        >
          <GitCompareArrows className="h-4 w-4" />
          Compare
        </button>
      </div>

      {diffResult.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Diff Result
              </span>
              <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                +{stats.additions} addition{stats.additions !== 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
                -{stats.deletions} deletion{stats.deletions !== 1 ? "s" : ""}
              </span>
            </div>
            <button onClick={handleCopy} className="tool-btn-secondary">
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="overflow-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <pre className="font-mono text-sm p-4">
              <code>
                {diffResult.map((part, i) => {
                  const lines = part.value.split("\n");
                  return lines.map((line, j) => {
                    // Skip the last empty line from split
                    if (j === lines.length - 1 && line === "") return null;

                    let className = "";
                    let prefix = "  ";

                    if (part.added) {
                      className =
                        "bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-300";
                      prefix = "+ ";
                    } else if (part.removed) {
                      className =
                        "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300";
                      prefix = "- ";
                    }

                    return (
                      <div key={`${i}-${j}`} className={className}>
                        {prefix}
                        {line}
                      </div>
                    );
                  });
                })}
              </code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
