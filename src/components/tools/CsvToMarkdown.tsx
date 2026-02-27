"use client";

import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";
import { copyToClipboard, downloadFile } from "@/lib/utils";

function parseCsvLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        cells.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
  }

  cells.push(current.trim());
  return cells;
}

function csvToMarkdownTable(
  input: string,
  delimiter: string,
  firstRowIsHeader: boolean
): string {
  const lines = input.split(/\r?\n/).filter((line) => line.trim() !== "");
  if (lines.length === 0) return "";

  const rows = lines.map((line) => parseCsvLine(line, delimiter));

  const maxCols = Math.max(...rows.map((row) => row.length));
  const normalizedRows = rows.map((row) => {
    while (row.length < maxCols) {
      row.push("");
    }
    return row;
  });

  const result: string[] = [];

  if (firstRowIsHeader) {
    const header = normalizedRows[0];
    result.push("| " + header.join(" | ") + " |");
    result.push("| " + header.map(() => "---").join(" | ") + " |");
    for (let i = 1; i < normalizedRows.length; i++) {
      result.push("| " + normalizedRows[i].join(" | ") + " |");
    }
  } else {
    const header = Array.from({ length: maxCols }, (_, i) => `Column ${i + 1}`);
    result.push("| " + header.join(" | ") + " |");
    result.push("| " + header.map(() => "---").join(" | ") + " |");
    for (const row of normalizedRows) {
      result.push("| " + row.join(" | ") + " |");
    }
  }

  return result.join("\n");
}

const DELIMITERS: { label: string; value: string }[] = [
  { label: "Comma (,)", value: "," },
  { label: "Tab", value: "\t" },
  { label: "Semicolon (;)", value: ";" },
  { label: "Pipe (|)", value: "|" },
];

export default function CsvToMarkdown() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [firstRowIsHeader, setFirstRowIsHeader] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleConvert = () => {
    const result = csvToMarkdownTable(input, delimiter, firstRowIsHeader);
    setOutput(result);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(output, "table.md", "text/markdown");
  };

  return (
    <div className="space-y-4">
      <textarea
        className="tool-textarea min-h-[300px]"
        placeholder="Paste your CSV or TSV data here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="delimiter-select" className="text-sm font-medium text-gray-700">
            Delimiter:
          </label>
          <select
            id="delimiter-select"
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
          >
            {DELIMITERS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={firstRowIsHeader}
            onChange={(e) => setFirstRowIsHeader(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          First row is header
        </label>

        <button className="tool-btn" onClick={handleConvert}>
          Convert
        </button>
      </div>

      <textarea
        className="tool-textarea min-h-[300px] font-mono"
        readOnly
        value={output}
        placeholder="Markdown table will appear here..."
      />

      {output && (
        <div className="flex gap-2">
          <button className="tool-btn-secondary" onClick={handleCopy}>
            {copied ? (
              <Check className="mr-1.5 h-4 w-4" />
            ) : (
              <Copy className="mr-1.5 h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
          <button className="tool-btn-secondary" onClick={handleDownload}>
            <Download className="mr-1.5 h-4 w-4" />
            Download
          </button>
        </div>
      )}
    </div>
  );
}
