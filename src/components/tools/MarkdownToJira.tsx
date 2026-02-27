"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

type Target = "jira" | "confluence";

function convertToJira(md: string, target: Target): string {
  let result = md;

  // Code blocks: ```lang\ncode\n``` → {code:lang}code{code} or {code}code{code}
  result = result.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    if (lang) {
      return `{code:${lang}}\n${code}{code}`;
    }
    return `{code}\n${code}{code}`;
  });

  // Inline code: `code` → {{code}}
  const inlineCode: string[] = [];
  result = result.replace(/`([^`]+)`/g, (_, code) => {
    const replacement = `{{${code}}}`;
    inlineCode.push(replacement);
    return `__INLINECODE_${inlineCode.length - 1}__`;
  });

  // Images: ![alt](url) → !url!
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "!$2!");

  // Links: [text](url) → [text|url]
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "[$1|$2]");

  // Headings: # H1 → h1. H1
  result = result.replace(/^######\s+(.+)$/gm, "h6. $1");
  result = result.replace(/^#####\s+(.+)$/gm, "h5. $1");
  result = result.replace(/^####\s+(.+)$/gm, "h4. $1");
  result = result.replace(/^###\s+(.+)$/gm, "h3. $1");
  result = result.replace(/^##\s+(.+)$/gm, "h2. $1");
  result = result.replace(/^#\s+(.+)$/gm, "h1. $1");

  // Bold: **text** or __text__ → *text*
  result = result.replace(/(\*\*|__)(.*?)\1/g, "*$2*");

  // Italic: *text* or _text_ → _text_
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "_$1_");

  // Strikethrough: ~~text~~ → -text-
  result = result.replace(/~~(.*?)~~/g, "-$1-");

  // Blockquotes: > text → {quote}text{quote}
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
        processedLines.push(`{quote}\n${quoteContent.join("\n")}\n{quote}`);
        inQuote = false;
        quoteContent = [];
      }
      processedLines.push(line);
    }
  }
  if (inQuote) {
    processedLines.push(`{quote}\n${quoteContent.join("\n")}\n{quote}`);
  }
  result = processedLines.join("\n");

  // Unordered lists: - item → * item
  result = result.replace(/^\s*[-+]\s+(.+)$/gm, "* $1");

  // Ordered lists: 1. item → # item
  result = result.replace(/^\s*\d+\.\s+(.+)$/gm, "# $1");

  // Tables: | col1 | col2 | → || col1 || col2 || for header, | col1 | col2 | for data
  const tableLines = result.split("\n");
  const finalLines: string[] = [];
  let prevWasTableHeader = false;

  for (let i = 0; i < tableLines.length; i++) {
    const line = tableLines[i];
    const isTableRow = line.match(/^\|(.+)\|$/);

    if (isTableRow) {
      // Check if next line is separator (---|---|---)
      const nextLine = tableLines[i + 1];
      const isSeparator = nextLine && nextLine.match(/^\|[\s-:|]+\|$/);

      if (isSeparator) {
        // This is a header row
        const cells = line
          .split("|")
          .filter((c) => c.trim() !== "")
          .map((c) => c.trim());
        finalLines.push(`|| ${cells.join(" || ")} ||`);
        prevWasTableHeader = true;
        continue;
      }

      // Skip separator line
      if (line.match(/^\|[\s-:|]+\|$/)) {
        if (prevWasTableHeader) {
          prevWasTableHeader = false;
          continue;
        }
      }

      // Regular table row
      const cells = line
        .split("|")
        .filter((c) => c.trim() !== "")
        .map((c) => c.trim());
      finalLines.push(`| ${cells.join(" | ")} |`);
      prevWasTableHeader = false;
    } else {
      prevWasTableHeader = false;
      finalLines.push(line);
    }
  }
  result = finalLines.join("\n");

  // Restore inline code
  result = result.replace(/__INLINECODE_(\d+)__/g, (_, i) => inlineCode[parseInt(i)]);

  // Confluence-specific: {code} → {code:java} default if no language
  // Confluence largely uses the same syntax as Jira for these features
  // The main differences are handled by the target platform itself

  return result;
}

export default function MarkdownToJira() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [target, setTarget] = useState<Target>("jira");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    setOutput(convertToJira(input, target));
  }, [input, target]);

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Target Selector */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Target format:
        </span>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="radio"
            name="jira-target"
            value="jira"
            checked={target === "jira"}
            onChange={() => setTarget("jira")}
            className="accent-indigo-600"
          />
          Jira
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="radio"
            name="jira-target"
            value="confluence"
            checked={target === "confluence"}
            onChange={() => setTarget("confluence")}
            className="accent-indigo-600"
          />
          Confluence
        </label>
      </div>

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
              {target === "jira" ? "Jira" : "Confluence"} Wiki Markup Output
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
            placeholder={`${target === "jira" ? "Jira" : "Confluence"} wiki markup will appear here...`}
          />
        </div>
      </div>
    </div>
  );
}
