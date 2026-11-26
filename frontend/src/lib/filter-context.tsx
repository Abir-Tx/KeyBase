"use client";

import * as React from "react";
import { Shortcut } from "./api";
import { parseOsList } from "./shortcuts";

export type FacetItem = {
  label: string;
  count: number;
};

type ShortcutFilterContextValue = {
  shortcuts: Shortcut[];
  setShortcutsForFilters: (shortcuts: Shortcut[]) => void;
  selectedApps: string[];
  selectedOses: string[];
  selectedTags: string[];
  tagLogic: "OR" | "AND";
  toggleApp: (app: string) => void;
  toggleOs: (os: string) => void;
  toggleTag: (tag: string) => void;
  setTagLogic: (logic: "OR" | "AND") => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  appFacets: FacetItem[];
  osFacets: FacetItem[];
  tagFacets: FacetItem[];
};

const ShortcutFilterContext =
  React.createContext<ShortcutFilterContextValue | null>(null);

function toggleValue(list: string[], value: string): string[] {
  const exists = list.some((item) => item.toLowerCase() === value.toLowerCase());
  if (exists) {
    return list.filter((item) => item.toLowerCase() !== value.toLowerCase());
  }
  return [...list, value];
}

function buildFacets(counts: Map<string, { label: string; count: number }>): FacetItem[] {
  return Array.from(counts.values()).sort(
    (a, b) => b.count - a.count || a.label.localeCompare(b.label)
  );
}

export function ShortcutFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shortcuts, setShortcutsForFilters] = React.useState<Shortcut[]>([]);
  const [selectedApps, setSelectedApps] = React.useState<string[]>([]);
  const [selectedOses, setSelectedOses] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [tagLogic, setTagLogic] = React.useState<"OR" | "AND">("OR");

  const toggleApp = React.useCallback((app: string) => {
    setSelectedApps((prev) => toggleValue(prev, app));
  }, []);

  const toggleOs = React.useCallback((os: string) => {
    setSelectedOses((prev) => toggleValue(prev, os));
  }, []);

  const toggleTag = React.useCallback((tag: string) => {
    setSelectedTags((prev) => toggleValue(prev, tag));
  }, []);

  const clearAllFilters = React.useCallback(() => {
    setSelectedApps([]);
    setSelectedOses([]);
    setSelectedTags([]);
  }, []);

  const { appFacets, osFacets, tagFacets } = React.useMemo(() => {
    const appCounts = new Map<string, FacetItem>();
    const osCounts = new Map<string, FacetItem>();
    const tagCounts = new Map<string, FacetItem>();

    for (const sc of shortcuts) {
      const appName = (sc.app || "General").trim();
      const appKey = appName.toLowerCase();
      const existingApp = appCounts.get(appKey);
      appCounts.set(appKey, {
        label: existingApp?.label || appName,
        count: (existingApp?.count || 0) + 1,
      });

      const seenOs = new Set<string>();
      for (const osName of parseOsList(sc.os)) {
        const osKey = osName.toLowerCase();
        if (seenOs.has(osKey)) continue;
        seenOs.add(osKey);
        const existingOs = osCounts.get(osKey);
        osCounts.set(osKey, {
          label: existingOs?.label || osName,
          count: (existingOs?.count || 0) + 1,
        });
      }

      const seenTag = new Set<string>();
      for (const rawTag of sc.tags || []) {
        const tagName = rawTag.trim();
        if (!tagName) continue;
        const tagKey = tagName.toLowerCase();
        if (seenTag.has(tagKey)) continue;
        seenTag.add(tagKey);
        const existingTag = tagCounts.get(tagKey);
        tagCounts.set(tagKey, {
          label: existingTag?.label || tagName,
          count: (existingTag?.count || 0) + 1,
        });
      }
    }

    return {
      appFacets: buildFacets(appCounts),
      osFacets: buildFacets(osCounts),
      tagFacets: buildFacets(tagCounts),
    };
  }, [shortcuts]);

  const hasActiveFilters =
    selectedApps.length > 0 ||
    selectedOses.length > 0 ||
    selectedTags.length > 0;

  const value = React.useMemo(
    () => ({
      shortcuts,
      setShortcutsForFilters,
      selectedApps,
      selectedOses,
      selectedTags,
      tagLogic,
      toggleApp,
      toggleOs,
      toggleTag,
      setTagLogic,
      clearAllFilters,
      hasActiveFilters,
      appFacets,
      osFacets,
      tagFacets,
    }),
    [
      shortcuts,
      selectedApps,
      selectedOses,
      selectedTags,
      tagLogic,
      toggleApp,
      toggleOs,
      toggleTag,
      clearAllFilters,
      hasActiveFilters,
      appFacets,
      osFacets,
      tagFacets,
    ]
  );

  return (
    <ShortcutFilterContext.Provider value={value}>
      {children}
    </ShortcutFilterContext.Provider>
  );
}

export function useShortcutFilters() {
  const ctx = React.useContext(ShortcutFilterContext);
  if (!ctx) {
    throw new Error(
      "useShortcutFilters must be used inside ShortcutFilterProvider"
    );
  }
  return ctx;
}
