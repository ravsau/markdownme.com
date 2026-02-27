"use client";

import { useState } from "react";
import { Copy, Check, Plus, Trash2 } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";

type FieldType = "text" | "date" | "boolean" | "list";
type FrontmatterFormat = "yaml" | "toml";

interface FrontmatterField {
  id: string;
  key: string;
  value: string;
  type: FieldType;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

function formatYaml(fields: FrontmatterField[]): string {
  const lines: string[] = ["---"];

  for (const field of fields) {
    if (!field.key.trim()) continue;

    switch (field.type) {
      case "text":
        lines.push(`${field.key}: "${field.value}"`);
        break;
      case "date":
        lines.push(`${field.key}: ${field.value || getTodayDate()}`);
        break;
      case "boolean":
        lines.push(`${field.key}: ${field.value === "true" ? "true" : "false"}`);
        break;
      case "list": {
        const items = field.value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (items.length === 0) {
          lines.push(`${field.key}: []`);
        } else {
          lines.push(`${field.key}:`);
          for (const item of items) {
            lines.push(`  - ${item}`);
          }
        }
        break;
      }
    }
  }

  lines.push("---");
  return lines.join("\n");
}

function formatToml(fields: FrontmatterField[]): string {
  const lines: string[] = ["+++"];

  for (const field of fields) {
    if (!field.key.trim()) continue;

    switch (field.type) {
      case "text":
        lines.push(`${field.key} = "${field.value}"`);
        break;
      case "date":
        lines.push(`${field.key} = ${field.value || getTodayDate()}`);
        break;
      case "boolean":
        lines.push(`${field.key} = ${field.value === "true" ? "true" : "false"}`);
        break;
      case "list": {
        const items = field.value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const formatted = items.map((i) => `"${i}"`).join(", ");
        lines.push(`${field.key} = [${formatted}]`);
        break;
      }
    }
  }

  lines.push("+++");
  return lines.join("\n");
}

const defaultFields: FrontmatterField[] = [
  { id: generateId(), key: "title", value: "", type: "text" },
  { id: generateId(), key: "date", value: getTodayDate(), type: "date" },
  { id: generateId(), key: "description", value: "", type: "text" },
  { id: generateId(), key: "tags", value: "", type: "list" },
  { id: generateId(), key: "draft", value: "false", type: "boolean" },
];

export default function FrontmatterEditor() {
  const [fields, setFields] = useState<FrontmatterField[]>(defaultFields);
  const [format, setFormat] = useState<FrontmatterFormat>("yaml");
  const [copied, setCopied] = useState(false);

  const output = format === "yaml" ? formatYaml(fields) : formatToml(fields);

  const handleAddField = () => {
    setFields([
      ...fields,
      { id: generateId(), key: "", value: "", type: "text" },
    ]);
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const handleFieldChange = (
    id: string,
    prop: "key" | "value" | "type",
    val: string
  ) => {
    setFields(
      fields.map((f) => {
        if (f.id !== id) return f;
        const updated = { ...f, [prop]: val };
        // Reset value when type changes
        if (prop === "type") {
          if (val === "boolean") updated.value = "false";
          else if (val === "date") updated.value = getTodayDate();
          else updated.value = "";
        }
        return updated;
      })
    );
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
      {/* Format selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Format:
        </span>
        <div className="flex gap-3">
          <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              name="format"
              checked={format === "yaml"}
              onChange={() => setFormat("yaml")}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            YAML
          </label>
          <label className="flex items-center gap-1.5 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              name="format"
              checked={format === "toml"}
              onChange={() => setFormat("toml")}
              className="text-indigo-600 focus:ring-indigo-500"
            />
            TOML
          </label>
        </div>
      </div>

      {/* Field list */}
      <div className="space-y-3">
        {fields.map((field) => (
          <div
            key={field.id}
            className="flex flex-wrap items-start gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800"
          >
            {/* Key */}
            <div className="flex-1 min-w-[120px]">
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Key
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                placeholder="key"
                value={field.key}
                onChange={(e) =>
                  handleFieldChange(field.id, "key", e.target.value)
                }
              />
            </div>

            {/* Type */}
            <div className="min-w-[100px]">
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Type
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                value={field.type}
                onChange={(e) =>
                  handleFieldChange(field.id, "type", e.target.value)
                }
              >
                <option value="text">Text</option>
                <option value="date">Date</option>
                <option value="boolean">Boolean</option>
                <option value="list">List</option>
              </select>
            </div>

            {/* Value */}
            <div className="flex-[2] min-w-[160px]">
              <label className="mb-1 block text-xs font-medium text-gray-500 dark:text-gray-400">
                Value
              </label>
              {field.type === "boolean" ? (
                <label className="flex items-center gap-2 py-1.5 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={field.value === "true"}
                    onChange={(e) =>
                      handleFieldChange(
                        field.id,
                        "value",
                        e.target.checked ? "true" : "false"
                      )
                    }
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  {field.value === "true" ? "true" : "false"}
                </label>
              ) : field.type === "date" ? (
                <input
                  type="date"
                  className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  value={field.value}
                  onChange={(e) =>
                    handleFieldChange(field.id, "value", e.target.value)
                  }
                />
              ) : (
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
                  placeholder={
                    field.type === "list"
                      ? "tag1, tag2, tag3 (comma-separated)"
                      : "value"
                  }
                  value={field.value}
                  onChange={(e) =>
                    handleFieldChange(field.id, "value", e.target.value)
                  }
                />
              )}
            </div>

            {/* Remove button */}
            <div className="pt-5">
              <button
                onClick={() => handleRemoveField(field.id)}
                className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950 dark:hover:text-red-400"
                title="Remove field"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="tool-btn-secondary" onClick={handleAddField}>
        <Plus className="h-4 w-4" />
        Add Field
      </button>

      {/* Live output */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Output
        </label>
        <textarea
          className="tool-textarea min-h-[200px]"
          readOnly
          value={output}
        />
      </div>

      <div className="flex gap-2">
        <button className="tool-btn-secondary" onClick={handleCopy}>
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}
