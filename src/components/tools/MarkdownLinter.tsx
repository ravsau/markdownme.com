"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Search,
} from "lucide-react";

type Severity = "error" | "warning";

interface LintIssue {
  line: number;
  ruleId: string;
  description: string;
  severity: Severity;
}

function lintMarkdown(markdown: string): LintIssue[] {
  const issues: LintIssue[] = [];
  const lines = markdown.split("\n");

  // --- MD041: First line should be a top-level heading ---
  const firstNonEmpty = lines.findIndex((l) => l.trim().length > 0);
  if (firstNonEmpty >= 0 && !lines[firstNonEmpty].match(/^# /)) {
    issues.push({
      line: firstNonEmpty + 1,
      ruleId: "MD041",
      description: "First line should be a top-level heading (# Heading)",
      severity: "warning",
    });
  }

  // Track state for multi-line rules
  let lastHeadingLevel = 0;
  const headingStyles: Set<string> = new Set();
  const listMarkers: Set<string> = new Set();
  let consecutiveBlankLines = 0;
  let inFencedCodeBlock = false;
  let prevLineBlank = false;
  let prevLineBlockquote = false;

  // Track ordered list sequences
  let orderedListStart = -1;
  let expectedOrderedNum = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    const trimmed = line.trimEnd();

    // Track fenced code blocks to skip rules inside them
    if (/^`{3,}/.test(trimmed) || /^~{3,}/.test(trimmed)) {
      // --- MD031: Fenced code blocks should be surrounded by blank lines ---
      if (!inFencedCodeBlock) {
        // Opening fence
        if (i > 0 && lines[i - 1].trim().length > 0) {
          issues.push({
            line: lineNum,
            ruleId: "MD031",
            description:
              "Fenced code block should be preceded by a blank line",
            severity: "warning",
          });
        }
      } else {
        // Closing fence
        if (i < lines.length - 1 && lines[i + 1]?.trim().length > 0) {
          issues.push({
            line: lineNum,
            ruleId: "MD031",
            description:
              "Fenced code block should be followed by a blank line",
            severity: "warning",
          });
        }
      }
      inFencedCodeBlock = !inFencedCodeBlock;
      prevLineBlank = false;
      prevLineBlockquote = false;
      consecutiveBlankLines = 0;
      continue;
    }

    if (inFencedCodeBlock) {
      prevLineBlank = false;
      prevLineBlockquote = false;
      consecutiveBlankLines = 0;
      continue;
    }

    const isBlank = trimmed.length === 0;

    // --- MD012: Multiple consecutive blank lines ---
    if (isBlank) {
      consecutiveBlankLines++;
      if (consecutiveBlankLines > 1) {
        issues.push({
          line: lineNum,
          ruleId: "MD012",
          description:
            "Multiple consecutive blank lines (only one blank line allowed between content)",
          severity: "warning",
        });
      }
    } else {
      consecutiveBlankLines = 0;
    }

    // --- MD009: Trailing spaces ---
    if (!isBlank && line !== trimmed) {
      const trailingSpaces = line.length - trimmed.length;
      // Allow exactly 2 trailing spaces (line break) but flag others
      if (trailingSpaces !== 2) {
        issues.push({
          line: lineNum,
          ruleId: "MD009",
          description: `Trailing spaces found (${trailingSpaces} space${trailingSpaces !== 1 ? "s" : ""})`,
          severity: "warning",
        });
      }
    }

    // --- MD010: Hard tabs ---
    if (line.includes("\t")) {
      issues.push({
        line: lineNum,
        ruleId: "MD010",
        description: "Hard tab character found (use spaces instead)",
        severity: "warning",
      });
    }

    // --- ATX headings ---
    const atxMatch = trimmed.match(/^(#{1,6})\s*(.*)/);
    if (atxMatch) {
      headingStyles.add("atx");
      const level = atxMatch[1].length;

      // --- MD018: No space after hash ---
      if (/^#{1,6}[^\s#]/.test(trimmed)) {
        issues.push({
          line: lineNum,
          ruleId: "MD018",
          description:
            "No space after hash in ATX heading (use # Heading, not #Heading)",
          severity: "error",
        });
      }

      // --- MD019: Multiple spaces after hash ---
      if (/^#{1,6}\s{2,}/.test(trimmed)) {
        issues.push({
          line: lineNum,
          ruleId: "MD019",
          description:
            "Multiple spaces after hash in ATX heading (use single space)",
          severity: "warning",
        });
      }

      // --- MD001: Heading levels should increment by one ---
      if (lastHeadingLevel > 0 && level > lastHeadingLevel + 1) {
        issues.push({
          line: lineNum,
          ruleId: "MD001",
          description: `Heading level jumped from h${lastHeadingLevel} to h${level} (should increment by one)`,
          severity: "error",
        });
      }
      lastHeadingLevel = level;
    }

    // --- Setext headings ---
    if (i > 0 && /^={3,}\s*$/.test(trimmed) && lines[i - 1].trim().length > 0) {
      headingStyles.add("setext");
      lastHeadingLevel = 1;
    }
    if (i > 0 && /^-{3,}\s*$/.test(trimmed) && lines[i - 1].trim().length > 0 && !prevLineBlank) {
      headingStyles.add("setext");
      lastHeadingLevel = 2;
    }

    // --- MD003: Inconsistent heading style ---
    if (headingStyles.size > 1) {
      // Only report once — check at the line that introduces the inconsistency
      if (headingStyles.size === 2 && (atxMatch || /^[=-]{3,}\s*$/.test(trimmed))) {
        issues.push({
          line: lineNum,
          ruleId: "MD003",
          description:
            "Inconsistent heading style (mixing ATX # and setext === styles)",
          severity: "warning",
        });
      }
    }

    // --- List markers ---
    const unorderedMatch = trimmed.match(/^(\s*)([-*+])\s/);
    if (unorderedMatch) {
      listMarkers.add(unorderedMatch[2]);

      // --- MD004: Inconsistent list marker ---
      if (listMarkers.size > 1) {
        issues.push({
          line: lineNum,
          ruleId: "MD004",
          description: `Inconsistent list marker "${unorderedMatch[2]}" (mixing -, *, + in the same document)`,
          severity: "warning",
        });
      }

      // --- MD032: Lists should be surrounded by blank lines ---
      if (i > 0 && !prevLineBlank && !lines[i - 1].match(/^\s*[-*+]\s/) && !lines[i - 1].match(/^\s*\d+\.\s/) && lines[i - 1].trim().length > 0) {
        issues.push({
          line: lineNum,
          ruleId: "MD032",
          description:
            "List should be preceded by a blank line",
          severity: "warning",
        });
      }
    }

    // --- Ordered lists ---
    const orderedMatch = trimmed.match(/^(\s*)(\d+)\.\s/);
    if (orderedMatch) {
      const num = parseInt(orderedMatch[2], 10);

      if (orderedListStart === -1) {
        orderedListStart = i;
        expectedOrderedNum = num + 1;
      } else {
        // --- MD029: Ordered list item prefix not sequential ---
        if (num !== expectedOrderedNum && num !== 1) {
          // Allow 1,1,1 pattern or sequential
          issues.push({
            line: lineNum,
            ruleId: "MD029",
            description: `Ordered list prefix ${num} is not sequential (expected ${expectedOrderedNum})`,
            severity: "warning",
          });
        }
        expectedOrderedNum = num + 1;
      }

      // --- MD032: Lists should be surrounded by blank lines ---
      if (orderedListStart === i && i > 0 && !prevLineBlank && lines[i - 1].trim().length > 0 && !lines[i - 1].match(/^\s*\d+\.\s/)) {
        issues.push({
          line: lineNum,
          ruleId: "MD032",
          description: "List should be preceded by a blank line",
          severity: "warning",
        });
      }
    } else if (!isBlank) {
      orderedListStart = -1;
      expectedOrderedNum = 1;
    }

    // --- MD027: Multiple spaces after blockquote symbol ---
    if (/^>\s{2,}\S/.test(trimmed)) {
      issues.push({
        line: lineNum,
        ruleId: "MD027",
        description:
          "Multiple spaces after blockquote symbol (use single space after >)",
        severity: "warning",
      });
    }

    // --- MD028: Blank line inside blockquote ---
    const isBlockquote = /^>/.test(trimmed);
    if (prevLineBlockquote && prevLineBlank && isBlockquote) {
      issues.push({
        line: lineNum,
        ruleId: "MD028",
        description: "Blank line inside blockquote (content gap detected)",
        severity: "warning",
      });
    }

    // --- MD033: Inline HTML ---
    if (/<\/?[a-zA-Z][a-zA-Z0-9]*[\s>]/.test(trimmed)) {
      issues.push({
        line: lineNum,
        ruleId: "MD033",
        description: "Inline HTML used (consider using Markdown syntax instead)",
        severity: "warning",
      });
    }

    // --- MD034: Bare URL without angle brackets or link syntax ---
    // Only match URLs not already inside []() or <>
    const bareUrlMatches = trimmed.match(
      /(?<![(<\[])\bhttps?:\/\/[^\s)>\]]+/g
    );
    if (bareUrlMatches) {
      for (const url of bareUrlMatches) {
        // Make sure this isn't inside a markdown link
        const inLink = /\[[^\]]*\]\([^)]*\)/.test(trimmed);
        const inAngleBrackets = new RegExp(`<${url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}>`).test(trimmed);
        if (!inLink && !inAngleBrackets) {
          issues.push({
            line: lineNum,
            ruleId: "MD034",
            description:
              "Bare URL used without link syntax (wrap in <> or use [text](url))",
            severity: "warning",
          });
          break; // One per line is enough
        }
      }
    }

    // Update state
    if (isBlockquote) {
      prevLineBlockquote = true;
    } else if (!isBlank) {
      prevLineBlockquote = false;
    }
    prevLineBlank = isBlank;
  }

  // --- MD047: File should end with a single newline ---
  if (markdown.length > 0 && !markdown.endsWith("\n")) {
    issues.push({
      line: lines.length,
      ruleId: "MD047",
      description: "File should end with a single newline character",
      severity: "warning",
    });
  }

  // Sort by line number
  issues.sort((a, b) => a.line - b.line);

  return issues;
}

const severityConfig: Record<
  Severity,
  { icon: React.ReactNode; bg: string; text: string; badge: string }
> = {
  error: {
    icon: <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />,
    bg: "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800",
    text: "text-red-700 dark:text-red-300",
    badge:
      "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
  warning: {
    icon: (
      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
    ),
    bg: "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
    badge:
      "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
};

export default function MarkdownLinter() {
  const [input, setInput] = useState("");
  const [issues, setIssues] = useState<LintIssue[] | null>(null);

  const handleLint = () => {
    if (!input.trim()) return;
    setIssues(lintMarkdown(input));
  };

  const errorCount =
    issues?.filter((i) => i.severity === "error").length ?? 0;
  const warningCount =
    issues?.filter((i) => i.severity === "warning").length ?? 0;

  return (
    <div className="space-y-4">
      <textarea
        className="tool-textarea min-h-[400px]"
        placeholder="Paste your markdown here to lint for common issues..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex justify-center">
        <button
          onClick={handleLint}
          disabled={!input.trim()}
          className="tool-btn"
        >
          <Search className="h-4 w-4" />
          Lint
        </button>
      </div>

      {issues !== null && (
        <div className="space-y-3">
          {/* Summary */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            {errorCount > 0 && (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                {errorCount} error{errorCount !== 1 ? "s" : ""}
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                {warningCount} warning{warningCount !== 1 ? "s" : ""}
              </span>
            )}
            {issues.length === 0 && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                No issues found!
              </span>
            )}
          </div>

          {/* No issues */}
          {issues.length === 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300">
              <CheckCircle className="mx-auto mb-2 h-8 w-8" />
              <p className="font-medium">No issues found!</p>
              <p className="text-sm">
                Your markdown looks clean and well-formatted.
              </p>
            </div>
          )}

          {/* Issues list */}
          {issues.length > 0 && (
            <div className="space-y-2">
              {issues.map((issue, idx) => {
                const config = severityConfig[issue.severity];
                return (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 rounded-lg border p-3 ${config.bg}`}
                  >
                    {config.icon}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-block rounded bg-gray-200 px-1.5 py-0.5 font-mono text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                          Line {issue.line}
                        </span>
                        <span
                          className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${config.badge}`}
                        >
                          {issue.ruleId}
                        </span>
                      </div>
                      <p
                        className={`mt-1 text-sm ${config.text}`}
                      >
                        {issue.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
