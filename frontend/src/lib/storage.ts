"use client";

import * as React from "react";

const STORAGE_CHANGE_EVENT = "keybase-storage-change";

function emitStorageChange(key: string) {
  window.dispatchEvent(new CustomEvent(STORAGE_CHANGE_EVENT, { detail: key }));
}

function subscribeStorageKey(key: string, callback: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === key) callback();
  };
  const onCustom = (e: Event) => {
    if ((e as CustomEvent<string>).detail === key) callback();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(STORAGE_CHANGE_EVENT, onCustom);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(STORAGE_CHANGE_EVENT, onCustom);
  };
}

export type ViewMode = "cards" | "compact";
const VIEW_MODE_KEY = "keybase-view-mode";

export function readViewMode(): ViewMode {
  if (typeof window === "undefined") return "cards";
  return window.localStorage.getItem(VIEW_MODE_KEY) === "compact"
    ? "compact"
    : "cards";
}

export function writeViewMode(mode: ViewMode) {
  window.localStorage.setItem(VIEW_MODE_KEY, mode);
  emitStorageChange(VIEW_MODE_KEY);
}

export function useViewMode(): ViewMode {
  return React.useSyncExternalStore(
    (cb) => subscribeStorageKey(VIEW_MODE_KEY, cb),
    readViewMode,
    () => "cards"
  );
}

const PINNED_IDS_KEY = "keybase-pinned-ids";
const EMPTY_IDS: string[] = [];
let cachedRawPinned: string | null = null;
let cachedParsedPinned: string[] = EMPTY_IDS;

export function readPinnedIds(): string[] {
  if (typeof window === "undefined") return EMPTY_IDS;
  const raw = window.localStorage.getItem(PINNED_IDS_KEY);
  if (raw === cachedRawPinned) return cachedParsedPinned;
  cachedRawPinned = raw;
  if (!raw) {
    cachedParsedPinned = EMPTY_IDS;
    return EMPTY_IDS;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    cachedParsedPinned = Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string")
      : EMPTY_IDS;
  } catch {
    cachedParsedPinned = EMPTY_IDS;
  }
  return cachedParsedPinned;
}

export function writePinnedIds(ids: string[]) {
  const serialized = JSON.stringify(ids);
  cachedRawPinned = serialized;
  cachedParsedPinned = ids;
  window.localStorage.setItem(PINNED_IDS_KEY, serialized);
  emitStorageChange(PINNED_IDS_KEY);
}

export function togglePinnedId(id: string) {
  const current = readPinnedIds();
  const next = current.includes(id)
    ? current.filter((item) => item !== id)
    : [...current, id];
  writePinnedIds(next);
}

export function usePinnedIds(): string[] {
  return React.useSyncExternalStore(
    (cb) => subscribeStorageKey(PINNED_IDS_KEY, cb),
    readPinnedIds,
    () => EMPTY_IDS
  );
}
