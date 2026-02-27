"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

function convertToBbcode(md: string): string {
  let result = md;

  // Code blocks: ```lang\ncode\n``` → [code]code[/code]
  result = result.replace(/```(?:\w*)\n([\s\S]*?)```/g, "[code]$1[/code]");

  // Inline code: `code` → [code]code[/code]
  // Protect from other transformations
  const inlineCode: string[] = [];
  result = result.replace(/`([^`]+)`/g, (_, code) => {
    const replacement = `[code]${code}[/code]`;
    inlineCode.push(replacement);
    return `__INLINECODE_${inlineCode.length - 1}__`;
  });

  // Images: ![alt](url) → [img]url[/img]
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "[img]$2[/img]");

  // Links: [text](url) → [url=url]text[/url]
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "[url=$2]$1[/url]");

  // Headings: # H1 → [size=7], ## H2 → [size=6], etc.
  result = result.replace(/^######\s+(.+)$/gm, "[size=2]$1[/size]");
  result = result.replace(/^#####\s+(.+)$/gm, "[size=3]$1[/size]");
  result = result.replace(/^####\s+(.+)$/gm, "[size=4]$1[/size]");
  result = result.replace(/^###\s+(.+)$/gm, "[size=5]$1[/size]");
  result = result.replace(/^##\s+(.+)$/gm, "[size=6]$1[/size]");
  result = result.replace(/^#\s+(.+)$/gm, "[size=7]$1[/size]");

  // Bold: **text** or __text__ → [b]text[/b]
  result = result.replace(/(\*\*|__)(.*?)\1/g, "[b]$2[/b]");

  // Italic: *text* or _text_ → [i]text[/i]
  result = result.replace(/(\*|_)(.*?)\1/g, "[i]$2[/i]");

  // Strikethrough: ~~text~~ → [s]text[/s]
  result = result.replace(/~~(.*?)~~/g, "[s]$1[/s]");

  // Blockquotes: > text → [quote]text[/quote]
  // Handle multi-line blockquotes
  const lines = result.split("\n");
  const processedLines: string[] = [];
  let inQuote = false;
  let quoteContent: string[] = [];

  for (const line of lines) {
    const quoteMatch = line.match(/^>\s?(.*)$/);
    if (quoteMatch) {
      if (!inQuote) {
        inQuote = true;
        quoteContent = [];
      }
      quoteContent.push(quoteMatch[1]);
    } else {
      if (inQuote) {
        processedLines.push(`[quote]${quoteContent.join("\n")}[/quote]`);
        inQuote = false;
        quoteContent = [];
      }
      processedLines.push(line);
    }
  }
  if (inQuote) {
    processedLines.push(`[quote]${quoteContent.join("\n")}[/quote]`);
  }
  result = processedLines.join("\n");

  // Ordered lists: lines starting with digits
  const lines2 = result.split("\n");
  const finalLines: string[] = [];
  let inUnorderedList = false;
  let inOrderedList = false;
  let listItems: string[] = [];

  for (const line of lines2) {
    const unorderedMatch = line.match(/^\s*[-*+]\s+(.+)$/);
    const orderedMatch = line.match(/^\s*\d+\.\s+(.+)$/);

    if (unorderedMatch) {
      if (inOrderedList) {
        finalLines.push(`[list=1]\n${listItems.map((item) => `[*]${item}`).join("\n")}\n[/list]`);
        inOrderedList = false;
        listItems = [];
      }
      if (!inUnorderedList) {
        inUnorderedList = true;
        listItems = [];
      }
      listItems.push(unorderedMatch[1]);
    } else if (orderedMatch) {
      if (inUnorderedList) {
        finalLines.push(`[list]\n${listItems.map((item) => `[*]${item}`).join("\n")}\n[/list]`);
        inUnorderedList = false;
        listItems = [];
      }
      if (!inOrderedList) {
        inOrderedList = true;
        listItems = [];
      }
      listItems.push(orderedMatch[1]);
    } else {
      if (inUnorderedList) {
        finalLines.push(`[list]\n${listItems.map((item) => `[*]${item}`).join("\n")}\n[/list]`);
        inUnorderedList = false;
        listItems = [];
      }
      if (inOrderedList) {
        finalLines.push(`[list=1]\n${listItems.map((item) => `[*]${item}`).join("\n")}\n[/list]`);
        inOrderedList = false;
        listItems = [];
      }
      finalLines.push(line);
    }
  }
  if (inUnorderedList) {
    finalLines.push(`[list]\n${listItems.map((item) => `[*]${item}`).join("\n")}\n[/list]`);
  }
  if (inOrderedList) {
    finalLines.push(`[list=1]\n${listItems.map((item) => `[*]${item}`).join("\n")}\n[/list]`);
  }
  result = finalLines.join("\n");

  // Restore inline code
  result = result.replace(/__INLINECODE_(\d+)__/g, (_, i) => inlineCode[parseInt(i)]);

  return result;
}

export default function MarkdownToBbcode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    setOutput(convertToBbcode(input));
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
              BBCode Output
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
            placeholder="BBCode output will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
