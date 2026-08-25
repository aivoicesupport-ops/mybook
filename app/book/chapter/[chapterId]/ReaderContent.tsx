"use client";

import { useState } from "react";

type Props = {
  content: string;
};

export default function ReaderContent({ content }: Props) {
  const [fontSize, setFontSize] = useState(18);
  const [lightMode, setLightMode] = useState(false);

  const increaseFont = () => {
    setFontSize((size) => Math.min(size + 2, 26));
  };

  const decreaseFont = () => {
    setFontSize((size) => Math.max(size - 2, 16));
  };

  const lines = content.split("\n");

  return (
    <div>
      {/* Reading Controls */}
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={decreaseFont}
          className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold"
        >
          A−
        </button>

        <button
          onClick={increaseFont}
          className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold"
        >
          A+
        </button>

        <button
          onClick={() => setLightMode((mode) => !mode)}
          className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold"
        >
          {lightMode ? "🌙 Dark" : "☀️ Light"}
        </button>

        <span
          className={`flex items-center px-2 text-sm ${
            lightMode ? "text-zinc-500" : "text-zinc-500"
          }`}
        >
          {fontSize}px
        </span>
      </div>

      {/* Book Content */}
      <div
        className={`rounded-2xl border p-6 sm:p-8 transition-colors ${
          lightMode
            ? "border-zinc-300 bg-white"
            : "border-zinc-800 bg-zinc-900"
        }`}
      >
        <div
          style={{ fontSize: `${fontSize}px` }}
          className={`space-y-5 leading-8 ${
            lightMode ? "text-zinc-800" : "text-zinc-300"
          }`}
        >
          {lines.map((line, index) => {
            const text = line.trim();

            if (!text) {
              return <div key={index} className="h-1" />;
            }

            if (text.startsWith("# ")) {
              return (
                <h3
                  key={index}
                  className={`pt-3 text-2xl font-bold ${
                    lightMode ? "text-black" : "text-white"
                  }`}
                  style={{ fontSize: `${fontSize + 8}px` }}
                >
                  {text.replace(/^# /, "")}
                </h3>
              );
            }

            if (text.startsWith("## ")) {
              return (
                <h4
                  key={index}
                  className={`pt-2 text-xl font-semibold ${
                    lightMode ? "text-black" : "text-white"
                  }`}
                  style={{ fontSize: `${fontSize + 4}px` }}
                >
                  {text.replace(/^## /, "")}
                </h4>
              );
            }

            if (text.startsWith("### ")) {
              return (
                <h5
                  key={index}
                  className={`pt-2 font-semibold ${
                    lightMode ? "text-black" : "text-white"
                  }`}
                  style={{ fontSize: `${fontSize + 2}px` }}
                >
                  {text.replace(/^### /, "")}
                </h5>
              );
            }

            return (
              <p key={index}>
                {text}
              </p>
            );
          })}
        </div>
      </div>
    </div>
  );
}