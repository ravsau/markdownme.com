"use client";

import { useState, useMemo } from "react";
import { copyToClipboard } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

function convertToLinkedin(md: string): string {
  let result = md;

  // Protect code blocks
  const codeBlocks: string[] = [];
  result = result.replace(/```[\s\S]*?```/g, (m) => {
    codeBlocks.push(m.replace(/```\w*\n?/g, "").replace(/```/g, "").trim());
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });

  // Headings → bold with line breaks
  result = result.replace(/^#{1,6}\s+(.+)$/gm, "\n$1\n");

  // Bold stays (LinkedIn supports *text* for bold-like emphasis, but ** is not rendered)
  // LinkedIn doesn't support markdown, so we use Unicode bold or just plain emphasis
  result = result.replace(/\*\*(.+?)\*\*/g, "$1");
  result = result.replace(/\*(.+?)\*/g, "$1");

  // Strikethrough - just remove markers
  result = result.replace(/~~(.+?)~~/g, "$1");

  // Inline code - just show the text
  result = result.replace(/`([^`]+)`/g, "$1");

  // Links → text (URL)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");

  // Images → remove
  result = result.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

  // Unordered lists → emoji bullets
  result = result.replace(/^\s*[-*+]\s+/gm, "→ ");

  // Ordered lists → number + dot
  result = result.replace(/^\s*(\d+)\.\s+/gm, "$1. ");

  // Blockquotes
  result = result.replace(/^\s*>\s+(.+)$/gm, '💬 "$1"');

  // Horizontal rules → line
  result = result.replace(/^---+$/gm, "\n━━━━━━━━━━━━━━━\n");

  // Restore code blocks as indented text
  result = result.replace(/__CODE_BLOCK_(\d+)__/g, (_, i) => {
    return "\n" + codeBlocks[parseInt(i)] + "\n";
  });

  // Clean up excessive blank lines (max 2)
  result = result.replace(/\n{3,}/g, "\n\n");

  return result.trim();
}

export default function MarkdownToLinkedin() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => convertToLinkedin(input), [input]);
  const charCount = output.length;
  const isOverLimit = charCount > 3000;

  const handleCopy = async () => {
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Markdown Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your Markdown here..."
            className="tool-textarea min-h-[450px]"
          />
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              LinkedIn Post
            </label>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-mono ${
                  isOverLimit ? "text-red-600 font-bold" : "text-gray-400"
                }`}
              >
                {charCount.toLocaleString()} / 3,000
              </span>
              <button onClick={handleCopy} className="tool-btn-secondary text-xs" disabled={!output}>
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            className="tool-textarea min-h-[450px]"
          />
        </div>
      </div>
      {isOverLimit && (
        <p className="text-sm text-red-600">
          Your post exceeds LinkedIn's 3,000-character limit by{" "}
          {(charCount - 3000).toLocaleString()} characters.
        </p>
      )}
    </div>
  );
}
