"use client";

import { useState } from "react";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Search,
} from "lucide-react";

type Severity = "error" | "warning" | "info";

interface LinkFinding {
  linkText: string;
  url: string;
  issue: string;
  severity: Severity;
}

function checkLinks(markdown: string): LinkFinding[] {
  const findings: LinkFinding[] = [];
  const urlCounts = new Map<string, number>();

  // Collect reference definitions: [ref]: url
  const refDefs = new Map<string, string>();
  const refDefRegex = /^\[([^\]]+)\]:\s*(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = refDefRegex.exec(markdown)) !== null) {
    refDefs.set(m[1].toLowerCase(), m[2].trim());
  }

  // 1. Inline links: [text](url) — also matches [text]( ) and []()
  const inlineRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
  while ((m = inlineRegex.exec(markdown)) !== null) {
    const text = m[1];
    const url = m[2].trim();

    // Empty URL
    if (!url) {
      findings.push({
        linkText: text || "(empty)",
        url: "(empty)",
        issue: "Empty URL — link points nowhere",
        severity: "error",
      });
      continue;
    }

    // Empty link text
    if (!text.trim()) {
      findings.push({
        linkText: "(empty)",
        url,
        issue: "Empty link text — bad for accessibility",
        severity: "warning",
      });
    }

    // Missing protocol
    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://") &&
      !url.startsWith("mailto:") &&
      !url.startsWith("#") &&
      !url.startsWith("/") &&
      !url.startsWith("tel:") &&
      !url.startsWith("ftp://")
    ) {
      // Check if it looks like a domain
      if (/^[a-zA-Z0-9][\w.-]*\.[a-zA-Z]{2,}/.test(url)) {
        findings.push({
          linkText: text || "(empty)",
          url,
          issue: "Missing protocol — should start with https:// or http://",
          severity: "warning",
        });
      }
    }

    // Spaces in URL (not counting anchors or query params oddities)
    if (/\s/.test(url) && !url.startsWith("#")) {
      findings.push({
        linkText: text || "(empty)",
        url,
        issue: "URL contains spaces — may be malformed",
        severity: "error",
      });
    }

    // Missing TLD for non-relative URLs
    if (
      url.startsWith("http://") ||
      url.startsWith("https://")
    ) {
      const hostMatch = url.match(/^https?:\/\/([^/:?#]+)/);
      if (hostMatch) {
        const host = hostMatch[1];
        if (host !== "localhost" && !host.includes(".")) {
          findings.push({
            linkText: text || "(empty)",
            url,
            issue: "Missing TLD — hostname has no dot (e.g., .com, .org)",
            severity: "error",
          });
        }
      }
    }

    // Track duplicates
    urlCounts.set(url, (urlCounts.get(url) || 0) + 1);
  }

  // 2. Reference links: [text][ref]
  const refLinkRegex = /\[([^\]]+)\]\[([^\]]*)\]/g;
  while ((m = refLinkRegex.exec(markdown)) !== null) {
    const text = m[1];
    const ref = (m[2] || m[1]).toLowerCase();

    if (!refDefs.has(ref)) {
      findings.push({
        linkText: text,
        url: `[${m[2] || m[1]}]`,
        issue: `Reference "${m[2] || m[1]}" has no matching definition`,
        severity: "error",
      });
    }
  }

  // 3. Bare URLs — check for obviously malformed ones
  const bareRegex = /(?<!\(|]\()https?:\/\/[^\s)>\]]+/g;
  while ((m = bareRegex.exec(markdown)) !== null) {
    const url = m[0];
    urlCounts.set(url, (urlCounts.get(url) || 0) + 1);

    const hostMatch = url.match(/^https?:\/\/([^/:?#]+)/);
    if (hostMatch) {
      const host = hostMatch[1];
      if (host !== "localhost" && !host.includes(".")) {
        findings.push({
          linkText: "(bare URL)",
          url,
          issue: "Missing TLD — hostname has no dot",
          severity: "error",
        });
      }
    }
  }

  // Flag duplicate URLs
  urlCounts.forEach((count, url) => {
    if (count > 1) {
      findings.push({
        linkText: "(multiple)",
        url,
        issue: `Duplicate URL — appears ${count} times in the document`,
        severity: "info",
      });
    }
  });

  return findings;
}

const severityIcon: Record<Severity, React.ReactNode> = {
  error: <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />,
  info: <Info className="h-4 w-4 text-blue-500 flex-shrink-0" />,
};

const severityBg: Record<Severity, string> = {
  error: "bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-800",
  warning:
    "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800",
  info: "bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800",
};

const severityText: Record<Severity, string> = {
  error: "text-red-700 dark:text-red-300",
  warning: "text-amber-700 dark:text-amber-300",
  info: "text-blue-700 dark:text-blue-300",
};

export default function BrokenLinkChecker() {
  const [input, setInput] = useState("");
  const [findings, setFindings] = useState<LinkFinding[] | null>(null);

  const handleCheck = () => {
    if (!input.trim()) return;
    setFindings(checkLinks(input));
  };

  const errorCount = findings?.filter((f) => f.severity === "error").length ?? 0;
  const warningCount =
    findings?.filter((f) => f.severity === "warning").length ?? 0;
  const infoCount = findings?.filter((f) => f.severity === "info").length ?? 0;

  return (
    <div className="space-y-4">
      <textarea
        className="tool-textarea min-h-[350px]"
        placeholder="Paste your markdown here to check for broken or malformed links..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="flex justify-center">
        <button
          onClick={handleCheck}
          disabled={!input.trim()}
          className="tool-btn"
        >
          <Search className="h-4 w-4" />
          Check Links
        </button>
      </div>

      {findings !== null && (
        <div className="space-y-3">
          {/* Summary */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
            {errorCount > 0 && (
              <span className="flex items-center gap-1 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                {errorCount} error{errorCount !== 1 ? "s" : ""}
              </span>
            )}
            {warningCount > 0 && (
              <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
                {warningCount} warning{warningCount !== 1 ? "s" : ""}
              </span>
            )}
            {infoCount > 0 && (
              <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                <Info className="h-4 w-4" />
                {infoCount} info
              </span>
            )}
            {findings.length === 0 && (
              <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
                All links look good!
              </span>
            )}
          </div>

          {/* No issues */}
          {findings.length === 0 && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-300">
              <CheckCircle className="mx-auto mb-2 h-8 w-8" />
              <p className="font-medium">No issues found!</p>
              <p className="text-sm">
                All links in your markdown appear to be well-formed.
              </p>
            </div>
          )}

          {/* Findings list */}
          {findings.length > 0 && (
            <div className="space-y-2">
              {findings.map((finding, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 rounded-lg border p-3 ${severityBg[finding.severity]}`}
                >
                  {severityIcon[finding.severity]}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-medium ${severityText[finding.severity]}`}
                      >
                        {finding.issue}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                      <span className="font-medium">Text:</span>{" "}
                      <span className="font-mono">{finding.linkText}</span>
                      {" | "}
                      <span className="font-medium">URL:</span>{" "}
                      <span className="font-mono break-all">{finding.url}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
