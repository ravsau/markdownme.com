"use client";

import { useState } from "react";
import { copyToClipboard } from "@/lib/utils";
import { Copy, Check, Plus, Trash2 } from "lucide-react";

interface Section {
  id: number;
  summary: string;
  content: string;
}

export default function CollapsibleGenerator() {
  const [sections, setSections] = useState<Section[]>([
    { id: 1, summary: "Click to expand", content: "Hidden content goes here." },
  ]);
  const [copied, setCopied] = useState(false);

  const addSection = () => {
    const nextId = sections.length > 0 ? Math.max(...sections.map((s) => s.id)) + 1 : 1;
    setSections([...sections, { id: nextId, summary: "", content: "" }]);
  };

  const removeSection = (id: number) => {
    if (sections.length > 1) {
      setSections(sections.filter((s) => s.id !== id));
    }
  };

  const updateSection = (id: number, field: "summary" | "content", value: string) => {
    setSections(sections.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const output = sections
    .map(
      (s) =>
        `<details>\n<summary>${s.summary || "Summary"}</summary>\n\n${s.content || "Content"}\n\n</details>`
    )
    .join("\n\n");

  const handleCopy = async () => {
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {sections.map((s, i) => (
          <div
            key={s.id}
            className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Section {i + 1}
              </span>
              <button
                onClick={() => removeSection(s.id)}
                disabled={sections.length <= 1}
                className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 dark:hover:bg-red-950"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                  Summary (visible when collapsed)
                </label>
                <input
                  type="text"
                  value={s.summary}
                  onChange={(e) => updateSection(s.id, "summary", e.target.value)}
                  placeholder="Click to expand"
                  className="tool-textarea"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                  Content (visible when expanded)
                </label>
                <textarea
                  value={s.content}
                  onChange={(e) => updateSection(s.id, "content", e.target.value)}
                  placeholder="Hidden content goes here..."
                  rows={4}
                  className="tool-textarea"
                />
              </div>
            </div>
          </div>
        ))}
        <button onClick={addSection} className="tool-btn-secondary text-sm">
          <Plus className="h-4 w-4" /> Add Section
        </button>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Output
          </label>
          <button onClick={handleCopy} className="tool-btn-secondary text-xs">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <textarea
          readOnly
          value={output}
          rows={Math.max(6, sections.length * 6)}
          className="tool-textarea font-mono text-sm"
        />
      </div>
    </div>
  );
}
