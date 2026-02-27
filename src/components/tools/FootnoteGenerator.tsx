"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";
import { Copy, Check, Plus, Trash2 } from "lucide-react";

export default function FootnoteGenerator() {
  const [footnotes, setFootnotes] = useState([{ id: 1, text: "" }]);
  const [copied, setCopied] = useState(false);
  const [copiedRefs, setCopiedRefs] = useState(false);

  const addFootnote = () => {
    const nextId = footnotes.length > 0 ? Math.max(...footnotes.map((f) => f.id)) + 1 : 1;
    setFootnotes([...footnotes, { id: nextId, text: "" }]);
  };

  const removeFootnote = (id: number) => {
    if (footnotes.length > 1) {
      setFootnotes(footnotes.filter((f) => f.id !== id));
    }
  };

  const updateFootnote = (id: number, text: string) => {
    setFootnotes(footnotes.map((f) => (f.id === id ? { ...f, text } : f)));
  };

  const references = footnotes.map((_, i) => `[^${i + 1}]`).join(" ");
  const definitions = footnotes
    .map((f, i) => `[^${i + 1}]: ${f.text || "Footnote text here"}`)
    .join("\n");

  const handleCopyDefs = async () => {
    await copyToClipboard(definitions);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyRefs = async () => {
    await copyToClipboard(references);
    setCopiedRefs(true);
    setTimeout(() => setCopiedRefs(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {footnotes.map((f, i) => (
          <div key={f.id} className="flex items-start gap-3">
            <span className="mt-2.5 shrink-0 rounded bg-indigo-100 px-2 py-0.5 text-xs font-mono font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
              [^{i + 1}]
            </span>
            <input
              type="text"
              value={f.text}
              onChange={(e) => updateFootnote(f.id, e.target.value)}
              placeholder={`Footnote ${i + 1} text...`}
              className="tool-textarea flex-1"
            />
            <button
              onClick={() => removeFootnote(f.id)}
              disabled={footnotes.length <= 1}
              className="mt-1.5 rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 dark:hover:bg-red-950"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button onClick={addFootnote} className="tool-btn-secondary text-sm">
          <Plus className="h-4 w-4" /> Add Footnote
        </button>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Reference markers (insert in your text)
          </label>
          <button onClick={handleCopyRefs} className="tool-btn-secondary text-xs">
            {copiedRefs ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copiedRefs ? "Copied!" : "Copy"}
          </button>
        </div>
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 font-mono text-sm dark:border-gray-700 dark:bg-gray-900">
          {references}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Footnote definitions (paste at bottom of document)
          </label>
          <button onClick={handleCopyDefs} className="tool-btn-secondary text-xs">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <textarea
          readOnly
          value={definitions}
          rows={Math.max(3, footnotes.length)}
          className="tool-textarea font-mono"
        />
      </div>
    </div>
  );
}
