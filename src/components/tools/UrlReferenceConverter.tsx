"use client";

import { useState } from "react";
import { Copy, Check, ArrowRightLeft } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

function toReferenceStyle(input: string): string {
  if (!input.trim()) return "";

  const references: { index: number; url: string; title?: string }[] = [];
  let counter = 0;

  // Replace all inline links [text](url) or [text](url "title") with [text][N]
  const converted = input.replace(
    /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,
    (_match, text: string, url: string, title?: string) => {
      counter++;
      references.push({ index: counter, url, title });
      return `[${text}][${counter}]`;
    }
  );

  if (references.length === 0) return input;

  // Build reference definitions
  const defs = references
    .map((ref) => {
      if (ref.title) {
        return `[${ref.index}]: ${ref.url} "${ref.title}"`;
      }
      return `[${ref.index}]: ${ref.url}`;
    })
    .join("\n");

  return converted.trimEnd() + "\n\n" + defs + "\n";
}

function toInlineStyle(input: string): string {
  if (!input.trim()) return "";

  // Build a map of reference definitions
  const refMap = new Map<string, { url: string; title?: string }>();
  const refDefRegex = /^\[([^\]]+)\]:\s+(\S+)(?:\s+"([^"]*)")?\s*$/gm;
  let match: RegExpExecArray | null;

  while ((match = refDefRegex.exec(input)) !== null) {
    const key = match[1].toLowerCase();
    refMap.set(key, { url: match[2], title: match[3] });
  }

  if (refMap.size === 0) return input;

  // Remove reference definitions from the text
  let result = input.replace(
    /^\[([^\]]+)\]:\s+\S+(?:\s+"[^"]*")?\s*$/gm,
    ""
  );

  // Replace [text][ref] with [text](url) or [text](url "title")
  result = result.replace(
    /\[([^\]]+)\]\[([^\]]*)\]/g,
    (_match, text: string, ref: string) => {
      const key = (ref || text).toLowerCase();
      const def = refMap.get(key);
      if (def) {
        if (def.title) {
          return `[${text}](${def.url} "${def.title}")`;
        }
        return `[${text}](${def.url})`;
      }
      return _match;
    }
  );

  // Also handle shorthand [ref] style (where text equals ref)
  result = result.replace(
    /\[([^\]]+)\](?!\[|\()/g,
    (_match, text: string) => {
      const key = text.toLowerCase();
      const def = refMap.get(key);
      if (def) {
        if (def.title) {
          return `[${text}](${def.url} "${def.title}")`;
        }
        return `[${text}](${def.url})`;
      }
      return _match;
    }
  );

  // Clean up extra blank lines left by removed definitions
  result = result.replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";

  return result;
}

export default function UrlReferenceConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleToReference = () => {
    setOutput(toReferenceStyle(input));
  };

  const handleToInline = () => {
    setOutput(toInlineStyle(input));
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
        className="tool-textarea min-h-[350px]"
        placeholder="Paste your Markdown with links here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex flex-wrap gap-3">
        <button
          className="tool-btn"
          onClick={handleToReference}
          disabled={!input.trim()}
        >
          <ArrowRightLeft className="h-4 w-4" />
          To Reference Style
        </button>
        <button
          className="tool-btn"
          onClick={handleToInline}
          disabled={!input.trim()}
        >
          <ArrowRightLeft className="h-4 w-4" />
          To Inline Style
        </button>
      </div>

      <textarea
        className="tool-textarea min-h-[350px]"
        readOnly
        value={output}
        placeholder="Converted Markdown will appear here..."
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
