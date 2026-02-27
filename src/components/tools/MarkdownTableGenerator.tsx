"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Minus,
  Copy,
  Check,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import { copyToClipboard, cn } from "@/lib/utils";

type Alignment = "left" | "center" | "right";

function generateMarkdown(
  data: string[][],
  alignments: Alignment[]
): string {
  if (data.length === 0) return "";

  const cols = data[0].length;
  const lines: string[] = [];

  const headerRow = data[0];
  lines.push("| " + headerRow.map((cell) => cell || " ").join(" | ") + " |");

  const separatorCells = Array.from({ length: cols }, (_, i) => {
    const align = alignments[i] || "left";
    if (align === "center") return ":---:";
    if (align === "right") return "---:";
    return "---";
  });
  lines.push("| " + separatorCells.join(" | ") + " |");

  for (let r = 1; r < data.length; r++) {
    lines.push("| " + data[r].map((cell) => cell || " ").join(" | ") + " |");
  }

  return lines.join("\n");
}

export default function MarkdownTableGenerator() {
  const [data, setData] = useState<string[][]>(() =>
    Array.from({ length: 4 }, () => Array.from({ length: 3 }, () => ""))
  );
  const [alignments, setAlignments] = useState<Alignment[]>(() =>
    Array.from({ length: 3 }, () => "left" as Alignment)
  );
  const [copied, setCopied] = useState(false);

  const rows = data.length;
  const cols = data[0]?.length ?? 0;

  const markdown = useMemo(() => generateMarkdown(data, alignments), [data, alignments]);

  const updateCell = (row: number, col: number, value: string) => {
    setData((prev) => {
      const next = prev.map((r) => [...r]);
      next[row][col] = value;
      return next;
    });
  };

  const addRow = () => {
    setData((prev) => [...prev, Array.from({ length: cols }, () => "")]);
  };

  const removeRow = () => {
    if (rows <= 2) return;
    setData((prev) => prev.slice(0, -1));
  };

  const addColumn = () => {
    setData((prev) => prev.map((row) => [...row, ""]));
    setAlignments((prev) => [...prev, "left"]);
  };

  const removeColumn = () => {
    if (cols <= 1) return;
    setData((prev) => prev.map((row) => row.slice(0, -1)));
    setAlignments((prev) => prev.slice(0, -1));
  };

  const cycleAlignment = (colIndex: number) => {
    setAlignments((prev) => {
      const next = [...prev];
      const current = next[colIndex];
      if (current === "left") next[colIndex] = "center";
      else if (current === "center") next[colIndex] = "right";
      else next[colIndex] = "left";
      return next;
    });
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(markdown);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const AlignIcon = ({ alignment }: { alignment: Alignment }) => {
    if (alignment === "center") return <AlignCenter className="h-3.5 w-3.5" />;
    if (alignment === "right") return <AlignRight className="h-3.5 w-3.5" />;
    return <AlignLeft className="h-3.5 w-3.5" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button className="tool-btn-secondary" onClick={addRow}>
          <Plus className="mr-1 h-4 w-4" />
          Add Row
        </button>
        <button className="tool-btn-secondary" onClick={removeRow} disabled={rows <= 2}>
          <Minus className="mr-1 h-4 w-4" />
          Remove Row
        </button>
        <button className="tool-btn-secondary" onClick={addColumn}>
          <Plus className="mr-1 h-4 w-4" />
          Add Column
        </button>
        <button className="tool-btn-secondary" onClick={removeColumn} disabled={cols <= 1}>
          <Minus className="mr-1 h-4 w-4" />
          Remove Column
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse">
          <thead>
            <tr>
              {Array.from({ length: cols }, (_, colIdx) => (
                <th key={colIdx} className="p-1">
                  <button
                    onClick={() => cycleAlignment(colIdx)}
                    className={cn(
                      "flex w-full items-center justify-center gap-1 rounded border px-2 py-1 text-xs text-gray-600 hover:bg-gray-100",
                      "transition-colors"
                    )}
                    title={`Align: ${alignments[colIdx]}`}
                  >
                    <AlignIcon alignment={alignments[colIdx]} />
                    <span className="capitalize">{alignments[colIdx]}</span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, colIdx) => (
                  <td key={colIdx} className="p-1">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                      className={cn(
                        "w-full min-w-[100px] rounded border px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                        rowIdx === 0 && "font-semibold"
                      )}
                      placeholder={rowIdx === 0 ? `Header ${colIdx + 1}` : ""}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Markdown Output</h3>
          <button className="tool-btn-secondary" onClick={handleCopy}>
            {copied ? (
              <Check className="mr-1.5 h-4 w-4" />
            ) : (
              <Copy className="mr-1.5 h-4 w-4" />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-lg border bg-gray-50 p-4 text-sm font-mono text-gray-800">
          {markdown || "Start typing in the grid above..."}
        </pre>
      </div>
    </div>
  );
}
