"use client";

import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { copyToClipboard, downloadFile } from "@/lib/utils";

const SECTIONS = [
  "Added",
  "Changed",
  "Deprecated",
  "Removed",
  "Fixed",
  "Security",
] as const;

type SectionKey = (typeof SECTIONS)[number];

function getToday() {
  return new Date().toISOString().split("T")[0];
}

export default function ChangelogGenerator() {
  const [version, setVersion] = useState("1.0.0");
  const [date, setDate] = useState(getToday);
  const [sections, setSections] = useState<Record<SectionKey, string>>(
    () =>
      Object.fromEntries(SECTIONS.map((s) => [s, ""])) as Record<
        SectionKey,
        string
      >
  );
  const [output, setOutput] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleSectionChange = (key: SectionKey, value: string) => {
    setSections((prev) => ({ ...prev, [key]: value }));
  };

  const generate = () => {
    const lines: string[] = [];
    lines.push(`## [${version}] - ${date}`);
    lines.push("");

    for (const section of SECTIONS) {
      const content = sections[section].trim();
      if (!content) continue;

      lines.push(`### ${section}`);
      lines.push("");
      const items = content.split("\n").filter((line) => line.trim());
      for (const item of items) {
        lines.push(`- ${item.trim()}`);
      }
      lines.push("");
    }

    setOutput(lines.join("\n").trimEnd());
  };

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Version and Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Version
          </label>
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            className="tool-textarea"
            placeholder="1.0.0"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="tool-textarea"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <div key={section} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {section}
            </label>
            <textarea
              rows={3}
              value={sections[section]}
              onChange={(e) => handleSectionChange(section, e.target.value)}
              className="tool-textarea"
              placeholder={`One item per line...`}
            />
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <button onClick={generate} className="tool-btn">
        Generate
      </button>

      {/* Output */}
      {output && (
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Output
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(output, "output")}
                  className="tool-btn-secondary"
                >
                  {copiedField === "output" ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  {copiedField === "output" ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={() =>
                    downloadFile(output, "CHANGELOG.md", "text/markdown")
                  }
                  className="tool-btn-secondary"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono text-gray-900 dark:text-gray-100">
              {output}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
