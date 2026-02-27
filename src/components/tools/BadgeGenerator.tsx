"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

const COLORS = [
  "brightgreen",
  "green",
  "yellow",
  "orange",
  "red",
  "blue",
  "lightgrey",
];

const STYLES = ["flat", "flat-square", "plastic", "for-the-badge", "social"];

export default function BadgeGenerator() {
  const [label, setLabel] = useState("build");
  const [message, setMessage] = useState("passing");
  const [color, setColor] = useState("brightgreen");
  const [style, setStyle] = useState("flat");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const encodedLabel = encodeURIComponent(label.replace(/-/g, "--"));
  const encodedMessage = encodeURIComponent(message.replace(/-/g, "--"));
  const badgeUrl = `https://img.shields.io/badge/${encodedLabel}-${encodedMessage}-${color}?style=${style}`;
  const markdown = `![badge](${badgeUrl})`;
  const html = `<img src="${badgeUrl}" alt="badge">`;

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <button
      onClick={() => handleCopy(text, field)}
      disabled={!text}
      className="tool-btn-secondary"
    >
      {copiedField === field ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      {copiedField === field ? "Copied!" : "Copy"}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Label
          </label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="tool-textarea"
            placeholder="build"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Message
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="tool-textarea"
            placeholder="passing"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Color
          </label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="tool-textarea"
          >
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="tool-textarea"
          >
            {STYLES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Live Preview */}
      {label && message && (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <span className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview
            </span>
            <img src={badgeUrl} alt="badge" />
          </div>

          {/* Markdown Output */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Markdown
              </span>
              <CopyButton text={markdown} field="markdown" />
            </div>
            <input
              type="text"
              readOnly
              value={markdown}
              className="tool-textarea"
            />
          </div>

          {/* HTML Output */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                HTML
              </span>
              <CopyButton text={html} field="html" />
            </div>
            <input
              type="text"
              readOnly
              value={html}
              className="tool-textarea"
            />
          </div>
        </div>
      )}
    </div>
  );
}
