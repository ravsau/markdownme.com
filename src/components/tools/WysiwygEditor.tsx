"use client";

import { useState, useRef, useCallback } from "react";
import { Copy, Check, Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered, Link, Code, Quote, Minus } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import TurndownService from "turndown";

const turndownService = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});

export default function WysiwygEditor() {
  const [markdownOutput, setMarkdownOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const updateMarkdown = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (!html || html === "<br>") {
        setMarkdownOutput("");
        return;
      }
      const md = turndownService.turndown(html);
      setMarkdownOutput(md);
    }
  }, []);

  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
      updateMarkdown();
    },
    [updateMarkdown]
  );

  const handleBold = () => execCommand("bold");
  const handleItalic = () => execCommand("italic");
  const handleH1 = () => execCommand("formatBlock", "h1");
  const handleH2 = () => execCommand("formatBlock", "h2");
  const handleH3 = () => execCommand("formatBlock", "h3");
  const handleUL = () => execCommand("insertUnorderedList");
  const handleOL = () => execCommand("insertOrderedList");

  const handleLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      execCommand("createLink", url);
    }
  };

  const handleCode = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      if (selectedText) {
        const code = document.createElement("code");
        code.textContent = selectedText;
        range.deleteContents();
        range.insertNode(code);
        updateMarkdown();
      }
    }
    editorRef.current?.focus();
  };

  const handleQuote = () => execCommand("formatBlock", "blockquote");
  const handleHR = () => execCommand("insertHorizontalRule");

  const handleCopy = async () => {
    const success = await copyToClipboard(markdownOutput);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: handleBold },
    { icon: Italic, label: "Italic", action: handleItalic },
    { icon: Heading1, label: "Heading 1", action: handleH1 },
    { icon: Heading2, label: "Heading 2", action: handleH2 },
    { icon: Heading3, label: "Heading 3", action: handleH3 },
    { icon: List, label: "Unordered List", action: handleUL },
    { icon: ListOrdered, label: "Ordered List", action: handleOL },
    { icon: Link, label: "Link", action: handleLink },
    { icon: Code, label: "Code", action: handleCode },
    { icon: Quote, label: "Quote", action: handleQuote },
    { icon: Minus, label: "Horizontal Rule", action: handleHR },
  ];

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
        {toolbarButtons.map((btn) => (
          <button
            key={btn.label}
            onClick={btn.action}
            title={btn.label}
            className="rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
          >
            <btn.icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      {/* Content editable editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={updateMarkdown}
        className="min-h-[400px] rounded-lg border border-gray-300 bg-white p-4 prose prose-sm dark:prose-invert max-w-none focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-gray-900"
        role="textbox"
        aria-label="Rich text editor"
      />

      {/* Markdown output */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Markdown Output
        </label>
        <textarea
          className="tool-textarea min-h-[200px]"
          readOnly
          value={markdownOutput}
          placeholder="Markdown output will appear here as you type..."
        />
      </div>

      {markdownOutput && (
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
