"use client";

import { useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Download } from "lucide-react";
import { copyToClipboard, downloadFile, cn } from "@/lib/utils";

const SAMPLE_MARKDOWN = `# Markdown Editor

Welcome to the **live markdown editor**! Start typing on the left to see a preview on the right.

## Features

- **Bold** and *italic* text
- ~~Strikethrough~~
- [Links](https://example.com)
- Inline \`code\` blocks

### Code Block

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

### Table

| Feature | Supported |
|---------|-----------|
| GFM     | Yes       |
| Tables  | Yes       |
| Lists   | Yes       |

### Task List

- [x] Write markdown
- [x] See live preview
- [ ] Export result

> This is a blockquote. It supports **formatting** too.
`;

interface ToolbarButton {
  label: string;
  icon: string;
  before: string;
  after: string;
}

const TOOLBAR_BUTTONS: ToolbarButton[] = [
  { label: "Bold", icon: "B", before: "**", after: "**" },
  { label: "Italic", icon: "I", before: "*", after: "*" },
  { label: "Heading", icon: "H", before: "## ", after: "" },
  { label: "Link", icon: "🔗", before: "[", after: "](url)" },
  { label: "Code", icon: "</>", before: "`", after: "`" },
  { label: "List", icon: "•", before: "- ", after: "" },
];

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertSyntax = useCallback(
    (before: string, after: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = markdown.substring(start, end);
      const newText =
        markdown.substring(0, start) +
        before +
        (selectedText || "text") +
        after +
        markdown.substring(end);

      setMarkdown(newText);

      // Restore cursor position after React re-renders
      requestAnimationFrame(() => {
        textarea.focus();
        const cursorPos = start + before.length + (selectedText || "text").length;
        textarea.setSelectionRange(cursorPos, cursorPos);
      });
    },
    [markdown]
  );

  const handleCopy = async () => {
    const success = await copyToClipboard(markdown);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(markdown, "document.md", "text/markdown");
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            onClick={() => insertSyntax(btn.before, btn.after)}
            title={btn.label}
            className={cn(
              "rounded px-3 py-1.5 text-sm font-medium transition-colors",
              "hover:bg-gray-200 dark:hover:bg-gray-700",
              "text-gray-700 dark:text-gray-300",
              btn.label === "Bold" && "font-bold",
              btn.label === "Italic" && "italic"
            )}
          >
            {btn.icon}
          </button>
        ))}
      </div>

      {/* Editor Panes */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Left: Textarea */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Markdown Input
          </label>
          <textarea
            ref={textareaRef}
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="tool-textarea min-h-[500px]"
            placeholder="Type your markdown here..."
          />
        </div>

        {/* Right: Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </label>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="tool-btn-secondary">
                <Copy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={handleDownload} className="tool-btn-secondary">
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
          <div className="min-h-[500px] overflow-auto rounded-lg border border-gray-300 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
