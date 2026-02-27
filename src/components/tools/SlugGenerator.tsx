"use client";

import { useState } from "react";
import { Copy, Check, Hash } from "lucide-react";
import { copyToClipboard, slugify } from "@/lib/utils";

export default function SlugGenerator() {
  const [input, setInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const slug = slugify(input);
  const simpleLowercase = input.toLowerCase().trim().replace(/\s+/g, "-");

  const bulkSlugs = bulkInput
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => ({ original: line.trim(), slug: slugify(line) }));

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
      {/* Single Slug */}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            <Hash className="inline h-4 w-4 mr-1" />
            Enter Text
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="tool-textarea"
            placeholder="Enter text to slugify..."
          />
        </div>

        {input.trim() && (
          <div className="space-y-3">
            {/* GitHub / GitLab Style */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub / GitLab Style
                </span>
                <CopyButton text={slug} field="github" />
              </div>
              <code className="block text-sm text-indigo-600 dark:text-indigo-400 font-mono">
                {slug}
              </code>
            </div>

            {/* Anchor Link */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Anchor Link
                </span>
                <CopyButton text={`#${slug}`} field="anchor" />
              </div>
              <code className="block text-sm text-indigo-600 dark:text-indigo-400 font-mono">
                #{slug}
              </code>
            </div>

            {/* Markdown Link */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Markdown Link
                </span>
                <CopyButton
                  text={`[${input.trim()}](#${slug})`}
                  field="mdlink"
                />
              </div>
              <code className="block text-sm text-indigo-600 dark:text-indigo-400 font-mono">
                [{input.trim()}](#{slug})
              </code>
            </div>

            {/* Simple Lowercase */}
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Simple Lowercase
                </span>
                <CopyButton text={simpleLowercase} field="simple" />
              </div>
              <code className="block text-sm text-indigo-600 dark:text-indigo-400 font-mono">
                {simpleLowercase}
              </code>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Mode */}
      <div className="border-t border-gray-200 pt-6 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Bulk Mode
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Enter text (one per line)
            </label>
            <textarea
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
              className="tool-textarea min-h-[200px]"
              placeholder={"Getting Started\nAPI Reference\nFrequently Asked Questions"}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Generated Slugs
              </label>
              <CopyButton
                text={bulkSlugs.map((s) => s.slug).join("\n")}
                field="bulk"
              />
            </div>
            <div className="tool-textarea min-h-[200px] overflow-auto">
              {bulkSlugs.length > 0 ? (
                <ul className="space-y-1">
                  {bulkSlugs.map((item, i) => (
                    <li key={i} className="text-sm">
                      <span className="text-gray-500 dark:text-gray-400">
                        {item.original}
                      </span>
                      <span className="mx-2 text-gray-400 dark:text-gray-500">
                        &rarr;
                      </span>
                      <code className="text-indigo-600 dark:text-indigo-400 font-mono">
                        {item.slug}
                      </code>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Slugs will appear here...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
