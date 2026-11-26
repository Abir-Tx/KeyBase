"use client";

import * as React from "react";
import { Menu, X, ExternalLink, Keyboard, RotateCcw } from "lucide-react";
import { useShortcutFilters } from "@/lib/filter-context";

type SidebarProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

function isSelected(selected: string[], value: string): boolean {
  return selected.some((item) => item.toLowerCase() === value.toLowerCase());
}

/**
 * Collapsible slide-out filter & navigation drawer.
 */
export default function Sidebar({ open, onOpen, onClose }: SidebarProps) {
  const {
    shortcuts,
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
  } = useShortcutFilters();

  React.useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px] transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 w-72 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 shadow-xl z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between`}
        aria-hidden={!open}
      >
        <div className="flex flex-col min-h-0 flex-1">
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <Keyboard
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                KeyBase
              </h1>
              <a
                href="https://github.com/Abir-Tx/KeyBase"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                v0.12.0
              </a>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Filter Facets */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={clearAllFilters}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  !hasActiveFilters
                    ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <span>All Shortcuts</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {shortcuts.length}
                </span>
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors self-start"
                >
                  <RotateCcw size={12} />
                  Reset active filters
                </button>
              )}
            </div>

            {/* Apps */}
            {appFacets.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
                  Apps ({appFacets.length})
                </p>
                <ul className="flex flex-col gap-1">
                  {appFacets.map((facet) => {
                    const active = isSelected(selectedApps, facet.label);
                    return (
                      <li key={facet.label}>
                        <button
                          type="button"
                          onClick={() => toggleApp(facet.label)}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            active
                              ? "bg-blue-600 text-white font-medium"
                              : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <span className="truncate">{facet.label}</span>
                          <span
                            className={`text-xs px-1.5 py-0.5 rounded-full ${
                              active
                                ? "bg-blue-500 text-white"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                            }`}
                          >
                            {facet.count}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Operating Systems */}
            {osFacets.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
                  Operating Systems
                </p>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {osFacets.map((facet) => {
                    const active = isSelected(selectedOses, facet.label);
                    return (
                      <button
                        key={facet.label}
                        type="button"
                        onClick={() => toggleOs(facet.label)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                          active
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400"
                        }`}
                      >
                        <span>{facet.label}</span>
                        <span className="opacity-75">{facet.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tags */}
            {tagFacets.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2 px-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Tags
                  </p>
                  {selectedTags.length > 1 && (
                    <div className="inline-flex rounded-md border border-slate-200 dark:border-slate-700 p-0.5 text-[10px]">
                      {(["OR", "AND"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setTagLogic(mode)}
                          className={`px-1.5 py-0.5 rounded font-semibold transition ${
                            tagLogic === mode
                              ? "bg-blue-600 text-white"
                              : "text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {mode}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5 px-1">
                  {tagFacets.map((facet) => {
                    const active = isSelected(selectedTags, facet.label);
                    return (
                      <button
                        key={facet.label}
                        type="button"
                        onClick={() => toggleTag(facet.label)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors ${
                          active
                            ? "bg-blue-600 text-white font-medium"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                        }`}
                      >
                        <span>#{facet.label}</span>
                        <span className="opacity-70">{facet.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between shrink-0">
          <span>By Mushfiqur Rahman Abir</span>
          <a
            href="https://github.com/Abir-Tx/KeyBase"
            target="_blank"
            rel="noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            aria-label="Open GitHub repository"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </aside>

      {!open && (
        <button
          type="button"
          onClick={onOpen}
          aria-label="Open sidebar"
          className="fixed left-4 top-6 z-40 inline-flex items-center gap-1.5 p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Menu size={18} />
          {hasActiveFilters && (
            <span
              className="w-2 h-2 rounded-full bg-blue-600"
              aria-hidden="true"
            />
          )}
        </button>
      )}
    </>
  );
}
