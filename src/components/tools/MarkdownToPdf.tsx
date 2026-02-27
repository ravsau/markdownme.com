"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileDown, Eye, EyeOff } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

export default function MarkdownToPdf() {
  const [markdown, setMarkdown] = useState("");
  const [showPreview, setShowPreview] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleGeneratePdf = () => {
    window.print();
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(markdown);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Input area - hidden during print */}
      <div className="no-print space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Markdown Input
        </label>
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="tool-textarea min-h-[400px]"
          placeholder="Type or paste your markdown here..."
        />
      </div>

      {/* Action buttons - hidden during print */}
      <div className="no-print flex flex-wrap items-center gap-2">
        <button
          onClick={handleGeneratePdf}
          disabled={!markdown.trim()}
          className="tool-btn"
        >
          <FileDown className="h-4 w-4" />
          Generate PDF
        </button>
        <button
          onClick={() => setShowPreview((prev) => !prev)}
          className="tool-btn-secondary"
        >
          {showPreview ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {showPreview ? "Hide Preview" : "Show Preview"}
        </button>
        <button
          onClick={handleCopy}
          disabled={!markdown.trim()}
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

      {/* Preview area - always visible during print when content exists */}
      {showPreview && markdown.trim() && (
        <div className="space-y-2">
          <label className="no-print block text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </label>
          <div className="rounded-lg border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="print-content prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}

      {/* Hidden print-only preview for when preview is toggled off */}
      {!showPreview && markdown.trim() && (
        <div className="hidden print:block">
          <div className="print-content prose prose-sm max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
