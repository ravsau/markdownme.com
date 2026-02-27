"use client";

import { useState } from "react";
import { Copy, Download, Check, ExternalLink } from "lucide-react";
import { copyToClipboard, downloadFile } from "@/lib/utils";

interface ExtractedLink {
  text: string;
  url: string;
  type: "Inline" | "Reference" | "Bare URL";
}

export default function LinkExtractor() {
  const [markdownInput, setMarkdownInput] = useState("");
  const [links, setLinks] = useState<ExtractedLink[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleExtract = () => {
    if (!markdownInput.trim()) return;

    const extracted: ExtractedLink[] = [];
    const seenUrls = new Set<string>();

    // 1. Inline links: [text](url)
    const inlineRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;
    while ((match = inlineRegex.exec(markdownInput)) !== null) {
      const url = match[2].trim();
      extracted.push({ text: match[1], url, type: "Inline" });
      seenUrls.add(url);
    }

    // 2. Reference links: [text][ref]
    const refRegex = /\[([^\]]+)\]\[([^\]]*)\]/g;
    while ((match = refRegex.exec(markdownInput)) !== null) {
      extracted.push({
        text: match[1],
        url: match[2] || match[1],
        type: "Reference",
      });
    }

    // 3. Bare URLs
    const bareRegex = /https?:\/\/[^\s)>\]]+/g;
    while ((match = bareRegex.exec(markdownInput)) !== null) {
      if (!seenUrls.has(match[0])) {
        extracted.push({ text: "", url: match[0], type: "Bare URL" });
      }
    }

    setLinks(extracted);
  };

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleCopyAllUrls = () => {
    const urls = links.map((l) => l.url).join("\n");
    handleCopy(urls, "all-urls");
  };

  const handleDownloadCsv = () => {
    const header = "Link Text,URL,Type";
    const rows = links.map(
      (l) =>
        `"${l.text.replace(/"/g, '""')}","${l.url.replace(/"/g, '""')}","${l.type}"`
    );
    const csv = [header, ...rows].join("\n");
    downloadFile(csv, "extracted-links.csv", "text/csv");
  };

  const typeBadgeClasses: Record<string, string> = {
    Inline:
      "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
    Reference:
      "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    "Bare URL":
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Markdown Input
        </label>
        <textarea
          value={markdownInput}
          onChange={(e) => setMarkdownInput(e.target.value)}
          className="tool-textarea min-h-[350px]"
          placeholder="Paste your markdown here..."
        />
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleExtract}
          disabled={!markdownInput.trim()}
          className="tool-btn"
        >
          Extract Links
        </button>
      </div>

      {links.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Found{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {links.length}
              </span>{" "}
              link{links.length !== 1 ? "s" : ""}
            </p>
            <div className="flex gap-2">
              <button onClick={handleCopyAllUrls} className="tool-btn-secondary">
                {copiedField === "all-urls" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copiedField === "all-urls" ? "Copied!" : "Copy All URLs"}
              </button>
              <button onClick={handleDownloadCsv} className="tool-btn-secondary">
                <Download className="h-4 w-4" />
                Download as CSV
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    Link Text
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    URL
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {links.map((link, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      {link.text || (
                        <span className="text-gray-400 italic">--</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                        <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all">
                          {link.url}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${typeBadgeClasses[link.type]}`}
                      >
                        {link.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
