"use client";

import { useState } from "react";
import { Copy, Download, Check, AlertCircle } from "lucide-react";
import { copyToClipboard, downloadFile } from "@/lib/utils";

function jsonToMarkdownTable(data: Record<string, unknown>[]): string {
  if (data.length === 0) return "";

  const headers = Array.from(
    new Set(data.flatMap((obj) => Object.keys(obj)))
  );

  const lines: string[] = [];
  lines.push("| " + headers.join(" | ") + " |");
  lines.push("| " + headers.map(() => "---").join(" | ") + " |");

  for (const row of data) {
    const cells = headers.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) return "";
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    });
    lines.push("| " + cells.join(" | ") + " |");
  }

  return lines.join("\n");
}

export default function JsonToMarkdown() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    setError("");
    setOutput("");

    if (!input.trim()) {
      setError("Please enter some JSON data.");
      return;
    }

    try {
      const parsed = JSON.parse(input);

      if (!Array.isArray(parsed)) {
        setError("JSON must be an array of objects. Example: [{\"name\": \"Alice\"}, {\"name\": \"Bob\"}]");
        return;
      }

      if (parsed.length === 0) {
        setError("The JSON array is empty.");
        return;
      }

      const allObjects = parsed.every(
        (item: unknown) =>
          typeof item === "object" && item !== null && !Array.isArray(item)
      );

      if (!allObjects) {
        setError("Every item in the array must be an object.");
        return;
      }

      const result = jsonToMarkdownTable(parsed as Record<string, unknown>[]);
      setOutput(result);
    } catch {
      setError("Invalid JSON. Please check your syntax and try again.");
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(output, "table.md", "text/markdown");
  };

  return (
    <div className="space-y-4">
      <textarea
        className="tool-textarea min-h-[300px]"
        placeholder={'Paste a JSON array of objects here...\n\nExample:\n[\n  { "name": "Alice", "age": 30 },\n  { "name": "Bob", "age": 25 }\n]'}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button className="tool-btn" onClick={handleConvert}>
        Convert
      </button>

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <textarea
        className="tool-textarea min-h-[300px] font-mono"
        readOnly
        value={output}
        placeholder="Markdown table will appear here..."
      />

      {output && (
        <div className="flex gap-2">
          <button className="tool-btn-secondary" onClick={handleCopy}>
            {copied ? (
              <Check className="mr-1.5 h-4 w-4" />
            ) : (
              <Copy className="mr-1.5 h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button className="tool-btn-secondary" onClick={handleDownload}>
            <Download className="mr-1.5 h-4 w-4" />
            Download
          </button>
        </div>
      )}
    </div>
  );
}
