"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

type Target = "slack" | "discord";

function convertToSlack(md: string): string {
  let result = md;

  // Code blocks: keep as-is (protect from other transformations)
  const codeBlocks: string[] = [];
  result = result.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODEBLOCK_${codeBlocks.length - 1}__`;
  });

  // Inline code: keep as-is
  const inlineCode: string[] = [];
  result = result.replace(/`([^`]+)`/g, (match) => {
    inlineCode.push(match);
    return `__INLINECODE_${inlineCode.length - 1}__`;
  });

  // Images: ![alt](url) → <url|alt>
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "<$2|$1>");

  // Links: [text](url) → <url|text>
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<$2|$1>");

  // Bold: **text** or __text__ → *text*
  result = result.replace(/(\*\*|__)(.*?)\1/g, "*$2*");

  // Italic: *text* or _text_ → _text_
  // After bold conversion, remaining single * are italic
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "_$1_");

  // Strikethrough: ~~text~~ → ~text~
  result = result.replace(/~~(.*?)~~/g, "~$1~");

  // Headings: # text → *text*
  result = result.replace(/^#{1,6}\s+(.+)$/gm, "*$1*");

  // Blockquotes stay: > text
  // Lists stay: - text
  // Both are the same in Slack

  // Restore inline code
  result = result.replace(/__INLINECODE_(\d+)__/g, (_, i) => inlineCode[parseInt(i)]);

  // Restore code blocks
  result = result.replace(/__CODEBLOCK_(\d+)__/g, (_, i) => codeBlocks[parseInt(i)]);

  return result;
}

function convertToDiscord(md: string): string {
  let result = md;

  // Code blocks: keep as-is (protect from other transformations)
  const codeBlocks: string[] = [];
  result = result.replace(/```[\s\S]*?```/g, (match) => {
    codeBlocks.push(match);
    return `__CODEBLOCK_${codeBlocks.length - 1}__`;
  });

  // Inline code: keep as-is
  const inlineCode: string[] = [];
  result = result.replace(/`([^`]+)`/g, (match) => {
    inlineCode.push(match);
    return `__INLINECODE_${inlineCode.length - 1}__`;
  });

  // Headings: # text → **text** (Discord doesn't support headings)
  result = result.replace(/^#{1,6}\s+(.+)$/gm, "**$1**");

  // Reference links: inline them (Discord needs inline links)
  // Collect reference definitions
  const refs: Record<string, string> = {};
  result = result.replace(/^\[([^\]]+)\]:\s*(.+)$/gm, (_, label, url) => {
    refs[label.toLowerCase()] = url.trim();
    return "";
  });
  // Replace reference usages
  result = result.replace(/\[([^\]]+)\]\[([^\]]*)\]/g, (_, text, label) => {
    const key = (label || text).toLowerCase();
    const url = refs[key];
    return url ? `[${text}](${url})` : `[${text}]`;
  });

  // Bold, italic, strikethrough, links, images, code, quotes, lists all stay the same in Discord

  // Restore inline code
  result = result.replace(/__INLINECODE_(\d+)__/g, (_, i) => inlineCode[parseInt(i)]);

  // Restore code blocks
  result = result.replace(/__CODEBLOCK_(\d+)__/g, (_, i) => codeBlocks[parseInt(i)]);

  return result;
}

export default function MarkdownToSlack() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [target, setTarget] = useState<Target>("slack");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!input.trim()) {
      setOutput("");
      return;
    }
    const converted =
      target === "slack" ? convertToSlack(input) : convertToDiscord(input);
    setOutput(converted);
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
            name="target"
            value="slack"
            checked={target === "slack"}
            onChange={() => setTarget("slack")}
            className="accent-indigo-600"
          />
          Slack
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input
            type="radio"
            name="target"
            value="discord"
            checked={target === "discord"}
            onChange={() => setTarget("discord")}
            className="accent-indigo-600"
          />
          Discord
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
              {target === "slack" ? "Slack mrkdwn" : "Discord"} Output
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
            placeholder={`${target === "slack" ? "Slack mrkdwn" : "Discord"} output will appear here...`}
          />
        </div>
      </div>
    </div>
  );
}
