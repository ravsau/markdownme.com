"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard, slugify } from "@/lib/utils";

export default function TocGenerator() {
  const [markdownInput, setMarkdownInput] = useState("");
  const [tocOutput, setTocOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!markdownInput.trim()) return;

    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const lines: string[] = [];
    let match: RegExpExecArray | null;

    while ((match = headingRegex.exec(markdownInput)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const slug = slugify(text);
      const indent = "  ".repeat(level - 1);
      lines.push(`${indent}- [${text}](#${slug})`);
    }

    setTocOutput(lines.length > 0 ? lines.join("\n") : "No headings found.");
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(tocOutput);
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
          onClick={handleGenerate}
          disabled={!markdownInput.trim()}
          className="tool-btn"
        >
          Generate TOC
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Generated Table of Contents
          </label>
          <button
            onClick={handleCopy}
            disabled={!tocOutput}
            className="tool-btn-secondary"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <textarea
          value={tocOutput}
          readOnly
          className="tool-textarea min-h-[250px]"
          placeholder="Table of contents will appear here..."
        />
      </div>
    </div>
  );
}
