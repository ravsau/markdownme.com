"use client";

import { useState } from "react";
import { Copy, Download, Check } from "lucide-react";
import { copyToClipboard, downloadFile } from "@/lib/utils";

const inputClasses =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none";
const labelClasses =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";

const licenseOptions = [
  "MIT",
  "Apache 2.0",
  "GPL 3.0",
  "BSD 3-Clause",
  "ISC",
  "None",
];

export default function ReadmeGenerator() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [installation, setInstallation] = useState("");
  const [usage, setUsage] = useState("");
  const [features, setFeatures] = useState("");
  const [contributing, setContributing] = useState("");
  const [license, setLicense] = useState("MIT");
  const [author, setAuthor] = useState("");
  const [badges, setBadges] = useState({
    license: false,
    version: false,
    build: false,
  });
  const [output, setOutput] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!projectName.trim()) return;

    const lines: string[] = [];

    // Title
    lines.push(`# ${projectName.trim()}`);
    lines.push("");

    // Badges
    const badgeLines: string[] = [];
    if (badges.license && license !== "None") {
      badgeLines.push(
        `![License](https://img.shields.io/badge/license-${encodeURIComponent(license)}-blue.svg)`
      );
    }
    if (badges.version) {
      badgeLines.push(
        `![Version](https://img.shields.io/badge/version-1.0.0-green.svg)`
      );
    }
    if (badges.build) {
      badgeLines.push(
        `![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)`
      );
    }
    if (badgeLines.length > 0) {
      lines.push(badgeLines.join(" "));
      lines.push("");
    }

    // Description
    if (description.trim()) {
      lines.push(description.trim());
      lines.push("");
    }

    // Installation
    if (installation.trim()) {
      lines.push("## Installation");
      lines.push("");
      lines.push("```bash");
      lines.push(installation.trim());
      lines.push("```");
      lines.push("");
    }

    // Usage
    if (usage.trim()) {
      lines.push("## Usage");
      lines.push("");
      lines.push(usage.trim());
      lines.push("");
    }

    // Features
    if (features.trim()) {
      lines.push("## Features");
      lines.push("");
      const featureList = features
        .split("\n")
        .filter((f) => f.trim())
        .map((f) => `- ${f.trim()}`);
      lines.push(...featureList);
      lines.push("");
    }

    // Contributing
    if (contributing.trim()) {
      lines.push("## Contributing");
      lines.push("");
      lines.push(contributing.trim());
      lines.push("");
    }

    // License
    if (license !== "None") {
      lines.push("## License");
      lines.push("");
      if (author.trim()) {
        lines.push(
          `This project is licensed under the ${license} License - see the [LICENSE](LICENSE) file for details.`
        );
      } else {
        lines.push(`This project is licensed under the ${license} License.`);
      }
      lines.push("");
    }

    // Author
    if (author.trim()) {
      lines.push("## Author");
      lines.push("");
      lines.push(author.trim());
      lines.push("");
    }

    setOutput(lines.join("\n"));
  };

  const handleCopy = async (text: string, field: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const handleDownload = () => {
    downloadFile(output, "README.md", "text/markdown");
  };

  return (
    <div className="space-y-6">
      {/* Form */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Project Name */}
        <div>
          <label className={labelClasses}>
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className={inputClasses}
            placeholder="My Awesome Project"
            required
          />
        </div>

        {/* Author */}
        <div>
          <label className={labelClasses}>Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={inputClasses}
            placeholder="Your Name"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={inputClasses}
            rows={3}
            placeholder="A brief description of your project..."
          />
        </div>

        {/* Installation */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Installation</label>
          <textarea
            value={installation}
            onChange={(e) => setInstallation(e.target.value)}
            className={inputClasses}
            rows={3}
            placeholder="npm install my-project"
          />
        </div>

        {/* Usage */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Usage</label>
          <textarea
            value={usage}
            onChange={(e) => setUsage(e.target.value)}
            className={inputClasses}
            rows={3}
            placeholder="Describe how to use the project..."
          />
        </div>

        {/* Features */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Features</label>
          <textarea
            value={features}
            onChange={(e) => setFeatures(e.target.value)}
            className={inputClasses}
            rows={3}
            placeholder="One feature per line"
          />
        </div>

        {/* Contributing */}
        <div className="md:col-span-2">
          <label className={labelClasses}>Contributing</label>
          <textarea
            value={contributing}
            onChange={(e) => setContributing(e.target.value)}
            className={inputClasses}
            rows={2}
            placeholder="Contribution guidelines..."
          />
        </div>

        {/* License */}
        <div>
          <label className={labelClasses}>License</label>
          <select
            value={license}
            onChange={(e) => setLicense(e.target.value)}
            className={inputClasses}
          >
            {licenseOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Badges */}
        <div>
          <label className={labelClasses}>Badges</label>
          <div className="flex flex-wrap gap-4 mt-1">
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={badges.license}
                onChange={(e) =>
                  setBadges((b) => ({ ...b, license: e.target.checked }))
                }
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              License
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={badges.version}
                onChange={(e) =>
                  setBadges((b) => ({ ...b, version: e.target.checked }))
                }
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Version
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={badges.build}
                onChange={(e) =>
                  setBadges((b) => ({ ...b, build: e.target.checked }))
                }
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Build Status
            </label>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={!projectName.trim()}
          className="tool-btn"
        >
          Generate README
        </button>
      </div>

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Generated README.md
            </label>
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
              <button onClick={handleDownload} className="tool-btn-secondary">
                <Download className="h-4 w-4" />
                Download .md
              </button>
            </div>
          </div>
          <textarea
            value={output}
            readOnly
            className="tool-textarea min-h-[400px]"
            placeholder="Generated README will appear here..."
          />
        </div>
      )}
    </div>
  );
}
