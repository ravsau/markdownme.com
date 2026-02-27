"use client";

import { useState } from "react";
import {
  Image,
  Copy,
  Download,
  Check,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { copyToClipboard, downloadFile } from "@/lib/utils";

interface ExtractedImage {
  alt: string;
  url: string;
  title: string;
}

function extractImages(markdown: string): ExtractedImage[] {
  const images: ExtractedImage[] = [];
  // Matches ![alt](url "title") and ![alt](url)
  const regex = /!\[([^\]]*)\]\(\s*([^\s")]+)(?:\s+"([^"]*)")?\s*\)/g;
  let m: RegExpExecArray | null;

  while ((m = regex.exec(markdown)) !== null) {
    images.push({
      alt: m[1],
      url: m[2],
      title: m[3] || "",
    });
  }

  return images;
}

export default function ImageExtractor() {
  const [input, setInput] = useState("");
  const [images, setImages] = useState<ExtractedImage[] | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleExtract = () => {
    if (!input.trim()) return;
    setImages(extractImages(input));
  };

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleCopyAllUrls = () => {
    if (!images) return;
    const urls = images.map((img) => img.url).join("\n");
    handleCopy(urls, "all-urls");
  };

  const handleDownloadCsv = () => {
    if (!images) return;
    const header = "#,Alt Text,URL,Title,Status";
    const rows = images.map(
      (img, i) =>
        `${i + 1},"${img.alt.replace(/"/g, '""')}","${img.url.replace(/"/g, '""')}","${img.title.replace(/"/g, '""')}","${img.alt.trim() ? "OK" : "Missing alt text"}"`
    );
    const csv = [header, ...rows].join("\n");
    downloadFile(csv, "extracted-images.csv", "text/csv");
  };

  const missingAltCount =
    images?.filter((img) => !img.alt.trim()).length ?? 0;

  return (
    <div className="space-y-4">
      <textarea
        className="tool-textarea min-h-[350px]"
        placeholder="Paste your markdown here to extract image references..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex justify-center">
        <button
          onClick={handleExtract}
          disabled={!input.trim()}
          className="tool-btn"
        >
          <Image className="h-4 w-4" />
          Extract Images
        </button>
      </div>

      {images !== null && images.length === 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 text-center text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          <Info className="mx-auto mb-2 h-8 w-8" />
          <p className="font-medium">No images found</p>
          <p className="text-sm">
            No image references were detected in your markdown.
          </p>
        </div>
      )}

      {images !== null && images.length > 0 && (
        <div className="space-y-3">
          {/* Summary */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Found{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {images.length}
              </span>{" "}
              image{images.length !== 1 ? "s" : ""}
              {missingAltCount > 0 && (
                <span className="ml-2 text-red-600 dark:text-red-400">
                  ({missingAltCount} missing alt text)
                </span>
              )}
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

          {/* Table */}
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    #
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    Alt Text
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    URL
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    Title
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {images.map((img, i) => (
                  <tr
                    key={i}
                    className="border-b border-gray-100 dark:border-gray-800 last:border-0"
                  >
                    <td className="px-4 py-2 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      {img.alt || (
                        <span className="text-gray-400 italic">--</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 break-all">
                        {img.url}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      {img.title || (
                        <span className="text-gray-400 italic">--</span>
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {img.alt.trim() ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-300">
                          <CheckCircle className="h-3 w-3" />
                          OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-300">
                          <AlertCircle className="h-3 w-3" />
                          Missing alt text
                        </span>
                      )}
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
