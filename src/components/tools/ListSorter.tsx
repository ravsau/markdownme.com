"use client";

import { useState } from "react";
import { Copy, Check, ArrowDownAZ } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

type SortDirection = "asc" | "desc";
type SortType = "alphabetical" | "length";

interface ListItem {
  indent: string;
  marker: string;
  content: string;
  original: string;
}

function parseListItem(line: string): ListItem | null {
  // Unordered list
  const ulMatch = line.match(/^(\s*)([-*+])\s+(.*)/);
  if (ulMatch) {
    return {
      indent: ulMatch[1],
      marker: ulMatch[2],
      content: ulMatch[3],
      original: line,
    };
  }

  // Ordered list
  const olMatch = line.match(/^(\s*)(\d+)(\.)\s+(.*)/);
  if (olMatch) {
    return {
      indent: olMatch[1],
      marker: olMatch[2] + olMatch[3],
      content: olMatch[4],
      original: line,
    };
  }

  return null;
}

function isOrderedMarker(marker: string): boolean {
  return /^\d+\.$/.test(marker);
}

function sortList(
  input: string,
  direction: SortDirection,
  sortType: SortType,
  renumberOrdered: boolean
): string {
  const lines = input.split(/\r?\n/);
  const result: string[] = [];

  let currentList: ListItem[] = [];
  let inList = false;

  const flushList = () => {
    if (currentList.length === 0) return;

    // Sort items
    currentList.sort((a, b) => {
      let comparison: number;
      if (sortType === "length") {
        comparison = a.content.length - b.content.length;
      } else {
        comparison = a.content.localeCompare(b.content, undefined, {
          sensitivity: "base",
        });
      }
      return direction === "desc" ? -comparison : comparison;
    });

    // Rebuild lines
    const isOrdered = isOrderedMarker(currentList[0].marker);
    currentList.forEach((item, idx) => {
      if (isOrdered && renumberOrdered) {
        result.push(`${item.indent}${idx + 1}. ${item.content}`);
      } else if (isOrdered) {
        result.push(`${item.indent}${item.marker} ${item.content}`);
      } else {
        result.push(`${item.indent}${item.marker} ${item.content}`);
      }
    });

    currentList = [];
  };

  for (const line of lines) {
    const parsed = parseListItem(line);

    if (parsed) {
      // Only group top-level items (no indent) into the sortable list
      if (parsed.indent === "") {
        inList = true;
        currentList.push(parsed);
      } else {
        // Sub-items: just pass through as-is after flushing
        if (inList) {
          // Attach to current list but don't sort separately
          result.push(line);
        } else {
          result.push(line);
        }
      }
    } else {
      if (inList) {
        flushList();
        inList = false;
      }
      result.push(line);
    }
  }

  // Flush any remaining list
  if (inList) {
    flushList();
  }

  return result.join("\n");
}

export default function ListSorter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [direction, setDirection] = useState<SortDirection>("asc");
  const [sortType, setSortType] = useState<SortType>("alphabetical");
  const [renumberOrdered, setRenumberOrdered] = useState(true);

  const handleSort = () => {
    setOutput(sortList(input, direction, sortType, renumberOrdered));
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
        className="tool-textarea min-h-[300px]"
        placeholder="Paste your Markdown list here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      {/* Options */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-wrap items-center gap-6">
          {/* Sort direction */}
          <div>
            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort direction
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="direction"
                  checked={direction === "asc"}
                  onChange={() => setDirection("asc")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                A &rarr; Z
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="direction"
                  checked={direction === "desc"}
                  onChange={() => setDirection("desc")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                Z &rarr; A
              </label>
            </div>
          </div>

          {/* Sort type */}
          <div>
            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Sort type
            </span>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="sortType"
                  checked={sortType === "alphabetical"}
                  onChange={() => setSortType("alphabetical")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                Alphabetical
              </label>
              <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="radio"
                  name="sortType"
                  checked={sortType === "length"}
                  onChange={() => setSortType("length")}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                By length
              </label>
            </div>
          </div>

          {/* Renumber */}
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={renumberOrdered}
              onChange={(e) => setRenumberOrdered(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Renumber ordered lists
          </label>
        </div>
      </div>

      <button className="tool-btn" onClick={handleSort} disabled={!input.trim()}>
        <ArrowDownAZ className="h-4 w-4" />
        Sort
      </button>

      <textarea
        className="tool-textarea min-h-[300px]"
        readOnly
        value={output}
        placeholder="Sorted list will appear here..."
      />

      {output && (
        <div className="flex gap-2">
          <button className="tool-btn-secondary" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
