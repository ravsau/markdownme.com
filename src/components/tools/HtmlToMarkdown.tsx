"use client";

import { useState } from "react";
import TurndownService from "turndown";
import { Copy, Download, Check } from "lucide-react";
import { copyToClipboard, downloadFile } from "@/lib/utils";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
});

export default function HtmlToMarkdown() {
  const [htmlInput, setHtmlInput] = useState("");
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    if (!htmlInput.trim()) return;
    try {
      const markdown = turndownService.turndown(htmlInput);
      setMarkdownOutput(markdown);
    } catch {
      setMarkdownOutput("Error converting HTML to Markdown.");
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(markdownOutput);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(markdownOutput, "converted.md", "text/markdown");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left: HTML Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            HTML Input
          </label>
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            className="tool-textarea min-h-[400px]"
            placeholder="Paste your HTML here..."
          />
        </div>

        {/* Right: Markdown Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Markdown Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!markdownOutput}
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
                disabled={!markdownOutput}
                className="tool-btn-secondary"
              >
                <Download className="h-4 w-4" />
                Download .md
              </button>
            </div>
          </div>
          <textarea
            value={markdownOutput}
            readOnly
            className="tool-textarea min-h-[400px]"
            placeholder="Markdown output will appear here..."
          />
        </div>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center">
        <button
          onClick={handleConvert}
          disabled={!htmlInput.trim()}
          className="tool-btn"
        >
          Convert
        </button>
      </div>
    </div>
  );
}
