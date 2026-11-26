"use client";

import * as React from "react";
import { formatKeysText } from "./shortcuts";

/**
 * Reusable clipboard copy hook for shortcut key combinations.
 */
export function useCopyKeys(resetDelayMs = 1600) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const copyKeys = React.useCallback(
    async (keys: string[]) => {
      if (!keys || keys.length === 0) return;
      try {
        await navigator.clipboard.writeText(formatKeysText(keys));
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), resetDelayMs);
      } catch {
        // Clipboard unavailable in insecure context; ignore silently
      }
    },
    [resetDelayMs]
  );

  return { copied, copyKeys };
}

/**
 * Normalize a KeyboardEvent.key value for consistent display and storage.
 * Returns null for dead or unidentified keys that should be ignored.
 */
export function normalizeKey(rawKey: string): string | null {
  if (!rawKey || rawKey === "Dead" || rawKey === "Unidentified") {
    return null;
  }
  return rawKey === " " ? "Space" : rawKey;
}

type UseKeyRecorderOptions = {
  autoStopMs?: number;
  onKeysChange?: (keys: string[]) => void;
};

/**
 * Shared hook to capture unique key combinations from window keydown events.
 */
export function useKeyRecorder(
  initialKeys: string[] = [],
  options: UseKeyRecorderOptions = {}
) {
  const { autoStopMs, onKeysChange } = options;
  const [keys, setKeys] = React.useState<string[]>(initialKeys);
  const [recording, setRecording] = React.useState(false);

  const keysRef = React.useRef<string[]>(initialKeys);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const onKeysChangeRef = React.useRef(onKeysChange);

  React.useEffect(() => {
    onKeysChangeRef.current = onKeysChange;
  }, [onKeysChange]);

  const updateKeys = React.useCallback((next: string[]) => {
    keysRef.current = next;
    setKeys(next);
    onKeysChangeRef.current?.(next);
  }, []);

  React.useEffect(() => {
    if (!recording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const key = normalizeKey(e.key);
      if (!key) return;

      if (!keysRef.current.includes(key)) {
        updateKeys([...keysRef.current, key]);
      }

      if (autoStopMs) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setRecording(false);
        }, autoStopMs);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [recording, autoStopMs, updateKeys]);

  const startRecording = React.useCallback(() => {
    updateKeys([]);
    setRecording(true);
  }, [updateKeys]);

  const stopRecording = React.useCallback(() => {
    setRecording(false);
  }, []);

  const clearKeys = React.useCallback(() => {
    setRecording(false);
    updateKeys([]);
  }, [updateKeys]);

  return {
    keys,
    setKeys: updateKeys,
    recording,
    startRecording,
    stopRecording,
    clearKeys,
  };
}
