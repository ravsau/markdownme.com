"use client";

import { useState, useMemo } from "react";
import { Copy, Download, Check } from "lucide-react";
import { copyToClipboard, downloadFile, stripMarkdown } from "@/lib/utils";

export default function MarkdownToText() {
  const [markdownInput, setMarkdownInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleStrip = () => {
    if (!markdownInput.trim()) return;
    const plainText = stripMarkdown(markdownInput);
    setTextOutput(plainText);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(textOutput);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(textOutput, "plain-text.txt", "text/plain");
  };

  const stats = useMemo(() => {
    if (!textOutput) return { characters: 0, words: 0 };
    const characters = textOutput.length;
    const words = textOutput
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    return { characters, words };
  }, [textOutput]);

  return (
    <div className="space-y-4">
      {/* Markdown Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Markdown Input
        </label>
        <textarea
          value={markdownInput}
          onChange={(e) => setMarkdownInput(e.target.value)}
          className="tool-textarea min-h-[300px]"
          placeholder="Paste your markdown here..."
        />
      </div>

      {/* Strip Button */}
      <div className="flex justify-center">
        <button
          onClick={handleStrip}
          disabled={!markdownInput.trim()}
          className="tool-btn"
        >
          Strip Formatting
        </button>
      </div>

      {/* Plain Text Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Plain Text Output
          </label>
          <div className="flex items-center gap-4">
            {textOutput && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {stats.characters.toLocaleString()} characters &middot;{" "}
                {stats.words.toLocaleString()} words
              </span>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!textOutput}
                className="tool-btn-secondary"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                onClick={handleDownload}
                disabled={!textOutput}
                className="tool-btn-secondary"
              >
                <Download className="h-4 w-4" />
                Download .txt
              </button>
            </div>
          </div>
        </div>
        <textarea
          value={textOutput}
          readOnly
          className="tool-textarea min-h-[300px]"
          placeholder="Plain text output will appear here..."
        />
      </div>
    </div>
  );
}
