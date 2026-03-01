"use client";

import { useState, useMemo } from "react";
import { copyToClipboard } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

interface CleaningRule {
  id: string;
  label: string;
  enabled: boolean;
}

const defaultRules: CleaningRule[] = [
  { id: "smartQuotes", label: "Fix smart quotes → straight quotes", enabled: true },
  { id: "nonBreaking", label: "Remove non-breaking spaces", enabled: true },
  { id: "zeroWidth", label: "Remove zero-width characters", enabled: true },
  { id: "trailingSpaces", label: "Trim trailing spaces", enabled: true },
  { id: "excessiveBlanks", label: "Collapse excessive blank lines", enabled: true },
  { id: "bulletFix", label: "Normalize list bullets to -", enabled: true },
  { id: "tabsToSpaces", label: "Convert tabs to spaces", enabled: true },
  { id: "windowsLineEndings", label: "Fix Windows line endings (\\r\\n → \\n)", enabled: true },
  { id: "trailingNewline", label: "Ensure single trailing newline", enabled: true },
];

function cleanSnippet(input: string, rules: CleaningRule[]): { output: string; fixes: string[] } {
  let text = input;
  const fixes: string[] = [];
  const enabled = new Set(rules.filter((r) => r.enabled).map((r) => r.id));

  if (enabled.has("windowsLineEndings")) {
    const count = (text.match(/\r\n/g) || []).length;
    if (count > 0) {
      text = text.replace(/\r\n/g, "\n");
      fixes.push(`Fixed ${count} Windows line endings`);
    }
    text = text.replace(/\r/g, "\n");
  }

  if (enabled.has("smartQuotes")) {
    let count = 0;
    text = text.replace(/[\u2018\u2019\u201A\u201B]/g, () => { count++; return "'"; });
    text = text.replace(/[\u2014]/g, () => { count++; return "---"; });
    text = text.replace(/[\u2013]/g, () => { count++; return "--"; });
    text = text.replace(/[\u201C\u201D\u201E\u201F]/g, () => { count++; return '"'; });
    text = text.replace(/[\u2026]/g, () => { count++; return "..."; });
    if (count > 0) fixes.push(`Replaced ${count} smart characters`);
  }

  if (enabled.has("nonBreaking")) {
    const count = (text.match(/\u00A0/g) || []).length;
    if (count > 0) {
      text = text.replace(/\u00A0/g, " ");
      fixes.push(`Removed ${count} non-breaking spaces`);
    }
  }

  if (enabled.has("zeroWidth")) {
    const re = /[\u200B\u200C\u200D\uFEFF\u200E\u200F]/g;
    const count = (text.match(re) || []).length;
    if (count > 0) {
      text = text.replace(re, "");
      fixes.push(`Removed ${count} zero-width characters`);
    }
  }

  if (enabled.has("tabsToSpaces")) {
    const count = (text.match(/\t/g) || []).length;
    if (count > 0) {
      text = text.replace(/\t/g, "  ");
      fixes.push(`Converted ${count} tabs to spaces`);
    }
  }

  if (enabled.has("trailingSpaces")) {
    const lines = text.split("\n");
    let count = 0;
    text = lines
      .map((line) => {
        const trimmed = line.replace(/\s+$/, "");
        if (trimmed.length < line.length) count++;
        return trimmed;
      })
      .join("\n");
    if (count > 0) fixes.push(`Trimmed trailing spaces on ${count} lines`);
  }

  if (enabled.has("bulletFix")) {
    let count = 0;
    text = text.replace(/^(\s*)[*+]\s/gm, (_, indent) => {
      count++;
      return `${indent}- `;
    });
    if (count > 0) fixes.push(`Normalized ${count} list bullets`);
  }

  if (enabled.has("excessiveBlanks")) {
    const before = text;
    text = text.replace(/\n{3,}/g, "\n\n");
    if (text !== before) fixes.push("Collapsed excessive blank lines");
  }

  if (enabled.has("trailingNewline")) {
    if (!text.endsWith("\n")) {
      text += "\n";
      fixes.push("Added trailing newline");
    }
    text = text.replace(/\n{2,}$/, "\n");
  }

  return { output: text, fixes };
}

export default function SnippetCleaner() {
  const [input, setInput] = useState("");
  const [rules, setRules] = useState(defaultRules);
  const [copied, setCopied] = useState(false);

  const { output, fixes } = useMemo(() => cleanSnippet(input, rules), [input, rules]);

  const toggleRule = (id: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));
  };

  const handleCopy = async () => {
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Rules */}
      <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
        <h3 className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
          Cleaning Rules
        </h3>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {rules.map((rule) => (
            <label key={rule.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rule.enabled}
                onChange={() => toggleRule(rule.id)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{rule.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Paste Messy Content
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste content from Notion, Google Docs, Slack, etc..."
            className="tool-textarea min-h-[400px]"
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Cleaned Output
            </label>
            <button onClick={handleCopy} className="tool-btn-secondary text-xs" disabled={!input}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <textarea readOnly value={output} className="tool-textarea min-h-[400px]" />
        </div>
      </div>

      {/* Fixes applied */}
      {fixes.length > 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
          <h3 className="mb-2 text-sm font-semibold text-green-800 dark:text-green-300">
            {fixes.length} fix{fixes.length !== 1 ? "es" : ""} applied
          </h3>
          <ul className="space-y-1">
            {fixes.map((fix, i) => (
              <li key={i} className="text-sm text-green-700 dark:text-green-400">
                ✓ {fix}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
