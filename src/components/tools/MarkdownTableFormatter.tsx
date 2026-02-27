"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

function formatMarkdownTable(input: string): string {
  const lines = input.split(/\r?\n/).filter((line) => line.includes("|"));

  if (lines.length === 0) return "";

  const parsed = lines.map((line) => {
    let trimmed = line.trim();
    if (trimmed.startsWith("|")) trimmed = trimmed.slice(1);
    if (trimmed.endsWith("|")) trimmed = trimmed.slice(0, -1);
    return trimmed.split("|").map((cell) => cell.trim());
  });

  const maxCols = Math.max(...parsed.map((row) => row.length));
  const normalizedRows = parsed.map((row) => {
    while (row.length < maxCols) {
      row.push("");
    }
    return row;
  });

  let separatorRowIndex = -1;
  for (let i = 0; i < normalizedRows.length; i++) {
    const isSeparator = normalizedRows[i].every((cell) =>
      /^:?-{2,}:?$/.test(cell) || cell === ""
    );
    if (isSeparator) {
      separatorRowIndex = i;
      break;
    }
  }

  const alignments: ("left" | "center" | "right")[] = Array.from(
    { length: maxCols },
    () => "left"
  );

  if (separatorRowIndex !== -1) {
    const sepRow = normalizedRows[separatorRowIndex];
    for (let i = 0; i < sepRow.length; i++) {
      const cell = sepRow[i];
      if (cell.startsWith(":") && cell.endsWith(":")) {
        alignments[i] = "center";
      } else if (cell.endsWith(":")) {
        alignments[i] = "right";
      } else {
        alignments[i] = "left";
      }
    }
  }

  const colWidths = Array.from({ length: maxCols }, () => 3);
  for (let i = 0; i < normalizedRows.length; i++) {
    if (i === separatorRowIndex) continue;
    for (let j = 0; j < normalizedRows[i].length; j++) {
      colWidths[j] = Math.max(colWidths[j], normalizedRows[i][j].length);
    }
  }

  const result: string[] = [];

  for (let i = 0; i < normalizedRows.length; i++) {
    if (i === separatorRowIndex) {
      const sepCells = colWidths.map((width, colIdx) => {
        const align = alignments[colIdx];
        const dashes = "-".repeat(width);
        if (align === "center") return ":" + "-".repeat(width - 2) + ":";
        if (align === "right") return "-".repeat(width - 1) + ":";
        return dashes;
      });
      result.push("| " + sepCells.join(" | ") + " |");
    } else {
      const paddedCells = normalizedRows[i].map((cell, colIdx) =>
        cell.padEnd(colWidths[colIdx])
      );
      result.push("| " + paddedCells.join(" | ") + " |");
    }
  }

  return result.join("\n");
}

export default function MarkdownTableFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    const result = formatMarkdownTable(input);
    setOutput(result);
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(output);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        className="tool-textarea min-h-[250px]"
        placeholder={"Paste your messy markdown table here...\n\nExample:\n| Name|Age |  City|\n|---|---|---|\n|Alice |30|  New York |\n| Bob|25 |London|"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button className="tool-btn" onClick={handleFormat}>
        Format Table
      </button>

      <textarea
        className="tool-textarea min-h-[250px] font-mono"
        readOnly
        value={output}
        placeholder="Formatted markdown table will appear here..."
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
        </div>
      )}
    </div>
  );
}
