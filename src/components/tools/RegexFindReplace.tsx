"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Replace } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export default function RegexFindReplace() {
  const [input, setInput] = useState("");
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [regexMode, setRegexMode] = useState(false);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [globalReplace, setGlobalReplace] = useState(true);

  // Real-time match count
  const matchCount = useMemo(() => {
    if (!findValue || !input) return 0;

    try {
      let flags = "";
      if (globalReplace) flags += "g";
      if (caseInsensitive) flags += "i";

      const pattern = regexMode ? findValue : escapeRegex(findValue);
      const regex = new RegExp(pattern, flags);
      const matches = input.match(regex);
      return matches ? matches.length : 0;
    } catch {
      return 0;
    }
  }, [input, findValue, regexMode, caseInsensitive, globalReplace]);

  const handleReplace = () => {
    if (!findValue) return;

    try {
      let flags = "";
      if (globalReplace) flags += "g";
      if (caseInsensitive) flags += "i";

      const pattern = regexMode ? findValue : escapeRegex(findValue);
      const regex = new RegExp(pattern, flags);
      setOutput(input.replace(regex, replaceValue));
    } catch (e) {
      setOutput(`Error: ${e instanceof Error ? e.message : "Invalid regex pattern"}`);
    }
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
      {/* Main input */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Markdown Input
        </label>
        <textarea
          className="tool-textarea min-h-[350px]"
          placeholder="Paste your Markdown here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* Find / Replace inputs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Find
          </label>
          <input
            type="text"
            className="tool-textarea"
            placeholder={regexMode ? "Regular expression..." : "Search text..."}
            value={findValue}
            onChange={(e) => setFindValue(e.target.value)}
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Replace with
          </label>
          <input
            type="text"
            className="tool-textarea"
            placeholder="Replacement text..."
            value={replaceValue}
            onChange={(e) => setReplaceValue(e.target.value)}
          />
        </div>
      </div>

      {/* Options and match count */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={regexMode}
              onChange={(e) => setRegexMode(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Regex mode
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={caseInsensitive}
              onChange={(e) => setCaseInsensitive(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Case insensitive
          </label>

          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={globalReplace}
              onChange={(e) => setGlobalReplace(e.target.checked)}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Global
          </label>
        </div>

        {findValue && (
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            <span className="font-bold text-indigo-600 dark:text-indigo-400">
              {matchCount}
            </span>{" "}
            match{matchCount !== 1 ? "es" : ""} found
          </span>
        )}
      </div>

      <button
        className="tool-btn"
        onClick={handleReplace}
        disabled={!input.trim() || !findValue}
      >
        <Replace className="h-4 w-4" />
        Replace All
      </button>

      {/* Output */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Result
        </label>
        <textarea
          className="tool-textarea min-h-[350px]"
          readOnly
          value={output}
          placeholder="Result will appear here..."
        />
      </div>

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
