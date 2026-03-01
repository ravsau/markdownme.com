"use client";

import { useState, useMemo } from "react";
import { copyToClipboard, stripMarkdown } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

const MAX_TWEET = 280;

function splitIntoThread(md: string): string[] {
  const plain = stripMarkdown(md);
  if (!plain.trim()) return [];

  // Split into sentences
  const sentences = plain.split(/(?<=[.!?])\s+/).filter((s) => s.trim());

  const tweets: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const trimmed = sentence.trim();
    if (!trimmed) continue;

    // If adding this sentence would exceed limit
    if (current && (current + " " + trimmed).length > MAX_TWEET - 8) {
      // -8 for " (X/Y)" numbering
      tweets.push(current.trim());
      current = trimmed;
    } else if (!current && trimmed.length > MAX_TWEET - 8) {
      // Single sentence too long, split by words
      const words = trimmed.split(/\s+/);
      let chunk = "";
      for (const word of words) {
        if (chunk && (chunk + " " + word).length > MAX_TWEET - 8) {
          tweets.push(chunk.trim());
          chunk = word;
        } else {
          chunk = chunk ? chunk + " " + word : word;
        }
      }
      if (chunk) current = chunk;
    } else {
      current = current ? current + " " + trimmed : trimmed;
    }
  }
  if (current.trim()) tweets.push(current.trim());

  // Number the tweets
  if (tweets.length > 1) {
    return tweets.map((t, i) => `${t} (${i + 1}/${tweets.length})`);
  }
  return tweets;
}

export default function MarkdownToTwitter() {
  const [input, setInput] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const tweets = useMemo(() => splitIntoThread(input), [input]);

  const handleCopyTweet = async (text: string, index: number) => {
    await copyToClipboard(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    await copyToClipboard(tweets.join("\n\n---\n\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Markdown Input
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your long-form Markdown content here..."
          className="tool-textarea min-h-[250px]"
        />
      </div>

      {tweets.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Thread ({tweets.length} tweet{tweets.length !== 1 ? "s" : ""})
            </h3>
            <button onClick={handleCopyAll} className="tool-btn-secondary text-xs">
              {copiedAll ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedAll ? "Copied All!" : "Copy All"}
            </button>
          </div>
          <div className="space-y-3">
            {tweets.map((tweet, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">
                    Tweet {i + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-mono ${
                        tweet.length > MAX_TWEET
                          ? "text-red-600 font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {tweet.length}/{MAX_TWEET}
                    </span>
                    <button
                      onClick={() => handleCopyTweet(tweet, i)}
                      className="tool-btn-secondary text-xs"
                    >
                      {copiedIndex === i ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200">
                  {tweet}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {input.trim() && tweets.length === 0 && (
        <p className="text-sm text-gray-500">Start typing to generate a thread.</p>
      )}
    </div>
  );
}
