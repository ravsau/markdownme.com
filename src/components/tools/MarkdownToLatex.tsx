"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

function escapeLatex(text: string): string {
  // Escape special LaTeX characters: & % $ # _ { }
  return text
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}");
}

function convertToLatex(md: string): string {
  const lines = md.split("\n");
  const outputLines: string[] = [];

  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let inBlockquote = false;
  let blockquoteContent: string[] = [];
  let inUnorderedList = false;
  let unorderedItems: string[] = [];
  let inOrderedList = false;
  let orderedItems: string[] = [];

  function flushBlockquote() {
    if (inBlockquote) {
      outputLines.push("\\begin{quote}");
      outputLines.push(blockquoteContent.join("\n"));
      outputLines.push("\\end{quote}");
      inBlockquote = false;
      blockquoteContent = [];
    }
  }

  function flushUnorderedList() {
    if (inUnorderedList) {
      outputLines.push("\\begin{itemize}");
      for (const item of unorderedItems) {
        outputLines.push(`  \\item ${item}`);
      }
      outputLines.push("\\end{itemize}");
      inUnorderedList = false;
      unorderedItems = [];
    }
  }

  function flushOrderedList() {
    if (inOrderedList) {
      outputLines.push("\\begin{enumerate}");
      for (const item of orderedItems) {
        outputLines.push(`  \\item ${item}`);
      }
      outputLines.push("\\end{enumerate}");
      inOrderedList = false;
      orderedItems = [];
    }
  }

  function flushAll() {
    flushBlockquote();
    flushUnorderedList();
    flushOrderedList();
  }

  function convertInline(text: string): string {
    let result = text;

    // Protect inline code first
    const inlineCode: string[] = [];
    result = result.replace(/`([^`]+)`/g, (_, code) => {
      inlineCode.push(code);
      return `__ICODE_${inlineCode.length - 1}__`;
    });

    // Escape special chars in remaining text
    // We need to be careful: process segments that are not placeholders
    result = result.replace(/(?:__ICODE_\d+__)|([^_]+)/g, (match, text) => {
      if (match.startsWith("__ICODE_")) return match;
      return escapeLatex(text || "");
    });

    // Images: ![alt](url) → \includegraphics{url}
    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "\\includegraphics{$2}");

    // Links: [text](url) → \href{url}{text}
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "\\href{$2}{$1}");

    // Bold: **text** or __text__ → \textbf{text}
    result = result.replace(/(\*\*|__)(.*?)\1/g, "\\textbf{$2}");

    // Italic: *text* or _text_ → \textit{text}
    result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "\\textit{$1}");
    result = result.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "\\textit{$1}");

    // Restore inline code
    result = result.replace(/__ICODE_(\d+)__/g, (_, i) => `\\texttt{${inlineCode[parseInt(i)]}}`);

    return result;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block start/end
    if (line.match(/^```/)) {
      if (!inCodeBlock) {
        flushAll();
        inCodeBlock = true;
        codeBlockContent = [];
        continue;
      } else {
        outputLines.push("\\begin{verbatim}");
        outputLines.push(codeBlockContent.join("\n"));
        outputLines.push("\\end{verbatim}");
        inCodeBlock = false;
        continue;
      }
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Horizontal rule
    if (line.match(/^---+$/)) {
      flushAll();
      outputLines.push("\\hrule");
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushAll();
      const level = headingMatch[1].length;
      const text = convertInline(headingMatch[2]);
      const commands: Record<number, string> = {
        1: "section",
        2: "subsection",
        3: "subsubsection",
        4: "paragraph",
        5: "subparagraph",
        6: "subparagraph",
      };
      outputLines.push(`\\${commands[level]}{${text}}`);
      continue;
    }

    // Blockquote
    const quoteMatch = line.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      flushUnorderedList();
      flushOrderedList();
      if (!inBlockquote) {
        inBlockquote = true;
        blockquoteContent = [];
      }
      blockquoteContent.push(convertInline(quoteMatch[1]));
      continue;
    } else if (inBlockquote) {
      flushBlockquote();
    }

    // Unordered list
    const ulMatch = line.match(/^\s*[-*+]\s+(.+)$/);
    if (ulMatch) {
      flushBlockquote();
      flushOrderedList();
      if (!inUnorderedList) {
        inUnorderedList = true;
        unorderedItems = [];
      }
      unorderedItems.push(convertInline(ulMatch[1]));
      continue;
    } else if (inUnorderedList) {
      flushUnorderedList();
    }

    // Ordered list
    const olMatch = line.match(/^\s*\d+\.\s+(.+)$/);
    if (olMatch) {
      flushBlockquote();
      flushUnorderedList();
      if (!inOrderedList) {
        inOrderedList = true;
        orderedItems = [];
      }
      orderedItems.push(convertInline(olMatch[1]));
      continue;
    } else if (inOrderedList) {
      flushOrderedList();
    }

    // Regular line
    outputLines.push(convertInline(line));
  }

  // Flush any remaining blocks
  if (inCodeBlock) {
    outputLines.push("\\begin{verbatim}");
    outputLines.push(codeBlockContent.join("\n"));
    outputLines.push("\\end{verbatim}");
  }
  flushAll();

  const body = outputLines.join("\n");

  return `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{hyperref}
\\usepackage{graphicx}

\\begin{document}

${body}

\\end{document}`;
}

export default function MarkdownToLatex() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    setOutput(convertToLatex(input));
  }, [input]);

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Markdown Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="tool-textarea min-h-[400px]"
            placeholder="Paste your markdown here..."
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              LaTeX Output
            </label>
            <button
              onClick={handleCopy}
              disabled={!output}
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
            value={output}
            readOnly
            className="tool-textarea min-h-[400px]"
            placeholder="LaTeX output will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
