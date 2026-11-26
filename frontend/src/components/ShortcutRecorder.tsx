"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useKeyRecorder } from "@/lib/keys";
import { RotateCcw, CircleDot } from "lucide-react";

type ShortcutRecorderProps = {
  initialKeys?: string[];
  onChange: (keys: string[]) => void;
  onRecordingChange?: (recording: boolean) => void;
  delay?: number;
};

/**
 * Interactive key combination recorder that emits live key updates to its parent.
 */
export default function ShortcutRecorder({
  initialKeys = [],
  onChange,
  onRecordingChange,
  delay = 350,
}: ShortcutRecorderProps) {
  const {
    keys,
    recording,
    startRecording,
    stopRecording,
    clearKeys,
  } = useKeyRecorder(initialKeys, {
    autoStopMs: delay,
    onKeysChange: onChange,
  });

  React.useEffect(() => {
    onRecordingChange?.(recording);
  }, [recording, onRecordingChange]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Key display */}
      <div className="flex flex-wrap justify-center items-center gap-2 min-h-[2.5rem]">
        <AnimatePresence>
          {keys.length > 0 ? (
            keys.map((k, idx) => (
              <motion.kbd
                key={`${k}-${idx}`}
                initial={{ scale: 0.75, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.75, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
                className="px-3 py-1.5 font-mono text-sm font-medium bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-lg border border-slate-200 dark:border-slate-600 border-b-2 shadow-sm"
              >
                {k}
              </motion.kbd>
            ))
          ) : (
            <span className="text-slate-500 dark:text-slate-400 text-sm">
              {recording
                ? "Listening... press your key combination"
                : "Click Start Recording and press keys"}
            </span>
          )}
        </AnimatePresence>
      </div>

      {/* Recorder controls */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-white transition ${
            recording
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          <CircleDot size={15} />
          {recording ? "Stop Recording" : "Start Recording"}
        </button>
        <button
          type="button"
          onClick={clearKeys}
          disabled={keys.length === 0 && !recording}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition disabled:opacity-50"
        >
          <RotateCcw size={14} />
          Clear
        </button>
      </div>
    </div>
  );
}
