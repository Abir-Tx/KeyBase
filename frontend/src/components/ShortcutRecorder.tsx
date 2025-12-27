"use client";

import * as React from "react";

type ShortcutRecorderProps = {
  initialKeys?: string[];
  onSave: (keys: string[]) => void;
  delay?: number; // optional delay between key presses in ms
};

export default function ShortcutRecorder({
  initialKeys = [],
  onSave,
  delay = 200, // default 200ms between keys
}: ShortcutRecorderProps) {
  const [keys, setKeys] = React.useState<string[]>(initialKeys);
  const [recording, setRecording] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (!recording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const key = e.key === " " ? "Space" : e.key;

      // Avoid duplicates
      setKeys((prev) => {
        if (prev.includes(key)) return prev;
        return [...prev, key];
      });

      // Reset after delay
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setRecording(false);
      }, delay);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [recording, delay]);

  const handleStart = () => {
    setKeys([]);
    setRecording(true);
  };

  const handleClear = () => setKeys([]);

  const handleSave = () => onSave(keys);

  return (
    <div className="flex flex-col gap-3">
      {/* Key display */}
      <div className="flex flex-wrap gap-2 min-h-[2rem]">
        {keys.length > 0 ? (
          keys.map((k, idx) => (
            <kbd
              key={idx}
              className="px-3 py-1 font-mono text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg shadow-sm"
            >
              {k}
            </kbd>
          ))
        ) : (
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Press keys...
          </span>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleStart}
          className={`px-4 py-2 rounded-md text-white transition ${
            recording
              ? "bg-green-500 hover:bg-green-600"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {recording ? "Recording..." : "Start Recording"}
        </button>
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
        >
          Clear
        </button>
        <button
          onClick={handleSave}
          disabled={keys.length === 0}
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
}
