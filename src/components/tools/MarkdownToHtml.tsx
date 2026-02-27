"use client";

import { useState } from "react";
import { marked } from "marked";
import { Copy, Download, Check } from "lucide-react";
import { copyToClipboard, downloadFile } from "@/lib/utils";

export default function MarkdownToHtml() {
  const [markdownInput, setMarkdownInput] = useState("");
  const [htmlOutput, setHtmlOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [converting, setConverting] = useState(false);

  const handleConvert = async () => {
    if (!markdownInput.trim()) return;
    setConverting(true);
    try {
      const html = await marked.parse(markdownInput);
      setHtmlOutput(html);
    } catch {
      setHtmlOutput("Error converting markdown to HTML.");
    } finally {
      setConverting(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(htmlOutput);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Converted Markdown</title>
</head>
<body>
${htmlOutput}
</body>
</html>`;
    downloadFile(fullHtml, "converted.html", "text/html");
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left: Markdown Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Markdown Input
          </label>
          <textarea
            value={markdownInput}
            onChange={(e) => setMarkdownInput(e.target.value)}
            className="tool-textarea min-h-[400px]"
            placeholder="Paste your markdown here..."
          />
        </div>

        {/* Right: HTML Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              HTML Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!htmlOutput}
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
                disabled={!htmlOutput}
                className="tool-btn-secondary"
              >
                <Download className="h-4 w-4" />
                Download .html
              </button>
            </div>
          </div>
          <textarea
            value={htmlOutput}
            readOnly
            className="tool-textarea min-h-[400px]"
            placeholder="HTML output will appear here..."
          />
        </div>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center">
        <button
          onClick={handleConvert}
          disabled={!markdownInput.trim() || converting}
          className="tool-btn"
        >
          {converting ? "Converting..." : "Convert"}
        </button>
      </div>
    </div>
  );
}
