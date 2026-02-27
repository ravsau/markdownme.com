"use client";

import { useState } from "react";
import { copyToClipboard, downloadFile } from "@/lib/utils";
import { Copy, Check, Download } from "lucide-react";

export default function ContributingGenerator() {
  const [projectName, setProjectName] = useState("");
  const [howTo, setHowTo] = useState("");
  const [devSetup, setDevSetup] = useState("");
  const [codeStyle, setCodeStyle] = useState("");
  const [prProcess, setPrProcess] = useState("");
  const [issueReporting, setIssueReporting] = useState("");
  const [cocLink, setCocLink] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const name = projectName || "This Project";
    let md = `# Contributing to ${name}\n\nThank you for your interest in contributing to ${name}! This document provides guidelines and steps for contributing.\n`;

    if (howTo) md += `\n## How to Contribute\n\n${howTo}\n`;
    if (devSetup) md += `\n## Development Setup\n\n${devSetup}\n`;
    if (codeStyle) md += `\n## Code Style\n\n${codeStyle}\n`;

    if (prProcess) {
      md += `\n## Pull Request Process\n\n${prProcess}\n`;
    } else {
      md += `\n## Pull Request Process\n\n1. Fork the repository and create your branch from \`main\`.\n2. Make your changes and ensure tests pass.\n3. Update documentation if needed.\n4. Submit a pull request with a clear description of your changes.\n`;
    }

    if (issueReporting) {
      md += `\n## Reporting Issues\n\n${issueReporting}\n`;
    } else {
      md += `\n## Reporting Issues\n\nIf you find a bug or have a feature request, please open an issue with:\n- A clear title and description\n- Steps to reproduce (for bugs)\n- Expected vs actual behavior\n`;
    }

    if (cocLink) md += `\n## Code of Conduct\n\nPlease review our [Code of Conduct](${cocLink}) before contributing.\n`;

    setOutput(md);
  };

  const handleCopy = async () => {
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none";
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Project Name</label>
          <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="My Project" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Code of Conduct Link (optional)</label>
          <input value={cocLink} onChange={(e) => setCocLink(e.target.value)} placeholder="./CODE_OF_CONDUCT.md" className={inputClass} />
        </div>
      </div>

      <div>
        <label className={labelClass}>How to Contribute</label>
        <textarea value={howTo} onChange={(e) => setHowTo(e.target.value)} rows={3} placeholder="Describe how people can contribute..." className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Development Setup</label>
        <textarea value={devSetup} onChange={(e) => setDevSetup(e.target.value)} rows={3} placeholder="git clone ...\nnpm install\nnpm run dev" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Code Style Guidelines</label>
        <textarea value={codeStyle} onChange={(e) => setCodeStyle(e.target.value)} rows={3} placeholder="We use ESLint and Prettier..." className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Pull Request Process</label>
        <textarea value={prProcess} onChange={(e) => setPrProcess(e.target.value)} rows={3} placeholder="Leave blank for default template" className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>Issue Reporting</label>
        <textarea value={issueReporting} onChange={(e) => setIssueReporting(e.target.value)} rows={3} placeholder="Leave blank for default template" className={inputClass} />
      </div>

      <button onClick={generate} className="tool-btn">Generate CONTRIBUTING.md</button>

      {output && (
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Output</label>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="tool-btn-secondary text-xs">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button onClick={() => downloadFile(output, "CONTRIBUTING.md")} className="tool-btn-secondary text-xs">
                <Download className="h-3.5 w-3.5" /> Download
              </button>
            </div>
          </div>
          <textarea readOnly value={output} className="tool-textarea min-h-[400px] font-mono text-sm" />
        </div>
      )}
    </div>
  );
}
