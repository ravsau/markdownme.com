"use client";

import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

type HeadingStyle = "atx" | "setext";
type ListMarker = "-" | "*" | "+";

interface PrettifyOptions {
  headingStyle: HeadingStyle;
  listMarker: ListMarker;
  blankAfterHeading: boolean;
  trimTrailingWhitespace: boolean;
  ensureTrailingNewline: boolean;
  maxConsecutiveBlankLines: number;
}

function prettifyMarkdown(input: string, options: PrettifyOptions): string {
  if (!input.trim()) return "";

  let lines = input.split(/\r?\n/);

  // Trim trailing whitespace from each line
  if (options.trimTrailingWhitespace) {
    lines = lines.map((line) => line.replace(/\s+$/, ""));
  }

  // Normalize headings
  const result: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const nextLine = i + 1 < lines.length ? lines[i + 1] : "";

    // Detect setext-style headings (=== or ---)
    if (
      i + 1 < lines.length &&
      line.trim().length > 0 &&
      /^[=]+\s*$/.test(nextLine)
    ) {
      if (options.headingStyle === "atx") {
        result.push("# " + line.trim());
      } else {
        result.push(line.trim());
        result.push("=".repeat(line.trim().length));
      }
      i += 2;
      continue;
    }

    if (
      i + 1 < lines.length &&
      line.trim().length > 0 &&
      /^[-]+\s*$/.test(nextLine) &&
      nextLine.trim().length >= 2 &&
      !line.trim().startsWith("-") &&
      !line.trim().startsWith("*") &&
      !line.trim().startsWith("+")
    ) {
      if (options.headingStyle === "atx") {
        result.push("## " + line.trim());
      } else {
        result.push(line.trim());
        result.push("-".repeat(line.trim().length));
      }
      i += 2;
      continue;
    }

    // Detect ATX-style headings
    const atxMatch = line.match(/^(#{1,6})\s+(.*?)(?:\s+#+\s*)?$/);
    if (atxMatch) {
      const level = atxMatch[1].length;
      const text = atxMatch[2].trim();

      if (options.headingStyle === "setext" && level <= 2) {
        result.push(text);
        result.push((level === 1 ? "=" : "-").repeat(text.length));
      } else {
        result.push("#".repeat(level) + " " + text);
      }
      i++;
      continue;
    }

    // Normalize list markers for unordered lists
    const ulMatch = line.match(/^(\s*)([-*+])\s+(.*)/);
    if (ulMatch) {
      const indent = ulMatch[1];
      const content = ulMatch[3];
      result.push(indent + options.listMarker + " " + content);
      i++;
      continue;
    }

    result.push(line);
    i++;
  }

  // Add blank line after headings
  if (options.blankAfterHeading) {
    const processed: string[] = [];
    for (let j = 0; j < result.length; j++) {
      const ln = result[j];
      processed.push(ln);

      const isAtxHeading = /^#{1,6}\s+/.test(ln);
      const isSetextUnderline =
        /^[=]+\s*$/.test(ln) || (/^[-]+\s*$/.test(ln) && ln.trim().length >= 2);
      const isHeadingEnd = isAtxHeading || isSetextUnderline;

      if (isHeadingEnd) {
        const nextLn = j + 1 < result.length ? result[j + 1] : undefined;
        if (nextLn !== undefined && nextLn.trim() !== "") {
          processed.push("");
        }
      }
    }
    // Reassign
    lines.length = 0;
    lines.push(...processed);
  } else {
    lines = [...result];
  }

  // Collapse consecutive blank lines
  const final: string[] = [];
  let consecutiveBlanks = 0;
  for (const ln of (options.blankAfterHeading ? lines : result)) {
    if (ln.trim() === "") {
      consecutiveBlanks++;
      if (consecutiveBlanks <= options.maxConsecutiveBlankLines) {
        final.push("");
      }
    } else {
      consecutiveBlanks = 0;
      final.push(ln);
    }
  }

  let output = final.join("\n");

  // Ensure single trailing newline
  if (options.ensureTrailingNewline) {
    output = output.replace(/\n*$/, "\n");
  }

  return output;
}

export default function MarkdownPrettifier() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<PrettifyOptions>({
    headingStyle: "atx",
    listMarker: "-",
    blankAfterHeading: true,
    trimTrailingWhitespace: true,
    ensureTrailingNewline: true,
    maxConsecutiveBlankLines: 1,
  });

  const handlePrettify = () => {
    setOutput(prettifyMarkdown(input, options));
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        className="tool-textarea min-h-[400px]"
        placeholder="Paste your Markdown here to prettify..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Options */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Options
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Heading style */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Heading style
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              value={options.headingStyle}
              onChange={(e) =>
                setOptions({ ...options, headingStyle: e.target.value as HeadingStyle })
              }
            >
              <option value="atx">ATX (#)</option>
              <option value="setext">Setext (===)</option>
            </select>
          </div>

          {/* List marker */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              List marker
            </label>
            <select
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              value={options.listMarker}
              onChange={(e) =>
                setOptions({ ...options, listMarker: e.target.value as ListMarker })
              }
            >
              <option value="-">Dash (-)</option>
              <option value="*">Asterisk (*)</option>
              <option value="+">Plus (+)</option>
            </select>
          </div>

          {/* Max consecutive blank lines */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Max consecutive blank lines
            </label>
            <input
              type="number"
              min={0}
              max={10}
              className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
              value={options.maxConsecutiveBlankLines}
              onChange={(e) =>
                setOptions({
                  ...options,
                  maxConsecutiveBlankLines: Math.max(0, parseInt(e.target.value) || 0),
                })
              }
            />
          </div>

          {/* Checkboxes */}
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={options.blankAfterHeading}
              onChange={(e) =>
                setOptions({ ...options, blankAfterHeading: e.target.checked })
              }
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Add blank line after headings
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={options.trimTrailingWhitespace}
              onChange={(e) =>
                setOptions({ ...options, trimTrailingWhitespace: e.target.checked })
              }
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Trim trailing whitespace
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={options.ensureTrailingNewline}
              onChange={(e) =>
                setOptions({ ...options, ensureTrailingNewline: e.target.checked })
              }
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Ensure single trailing newline
          </label>
        </div>
      </div>

      <button className="tool-btn" onClick={handlePrettify} disabled={!input.trim()}>
        <Sparkles className="h-4 w-4" />
        Prettify
      </button>

      <textarea
        className="tool-textarea min-h-[400px]"
        readOnly
        value={output}
        placeholder="Prettified Markdown will appear here..."
      />

      {output && (
        <div className="flex gap-2">
          <button className="tool-btn-secondary" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
