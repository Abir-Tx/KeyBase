"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddEditShortcutModal from "@/components/AddEditShortcutModal";
import RecordKeysModal from "@/components/RecordKeysModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import ShortcutsHelpModal from "@/components/ShortcutsHelpModal";
import ImportExportModal from "@/components/ImportExportModal";
import {
  fetchShortcuts,
  addShortcut,
  updateShortcut,
  Shortcut,
  deleteShortcut,
} from "@/lib/api";
import { useShortcutFilters } from "@/lib/filter-context";
import {
  buildConflictMap,
  getConflictKey,
  parseOsList,
} from "@/lib/shortcuts";
import ShortcutCard from "@/components/ShortcutCard";
import ShortcutCompactRow from "@/components/ShortcutCompactRow";
import {
  Search,
  Plus,
  X,
  AlertCircle,
  RotateCw,
  HelpCircle,
  ArrowUpDown,
  LayoutGrid,
  List,
} from "lucide-react";

type ViewMode = "cards" | "compact";
const VIEW_MODE_KEY = "keybase-view-mode";
const VIEW_MODE_EVENT = "keybase-view-mode-change";

function subscribeViewMode(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(VIEW_MODE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(VIEW_MODE_EVENT, callback);
  };
}

function getViewModeSnapshot(): ViewMode {
  if (typeof window === "undefined") return "cards";
  return window.localStorage.getItem(VIEW_MODE_KEY) === "compact"
    ? "compact"
    : "cards";
}

function saveViewMode(mode: ViewMode) {
  window.localStorage.setItem(VIEW_MODE_KEY, mode);
  window.dispatchEvent(new Event(VIEW_MODE_EVENT));
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
}

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [shortcuts, setShortcuts] = React.useState<Shortcut[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Modals
  const [editingShortcut, setEditingShortcut] = React.useState<Shortcut | null>(
    null
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const [recordShortcut, setRecordShortcut] = React.useState<Shortcut | null>(
    null
  );
  const [recordModalOpen, setRecordModalOpen] = React.useState(false);
  const [deletingShortcut, setDeletingShortcut] =
    React.useState<Shortcut | null>(null);
  const [helpOpen, setHelpOpen] = React.useState(false);
  const [importExportOpen, setImportExportOpen] = React.useState(false);

  const searchInputRef = React.useRef<HTMLInputElement | null>(null);
  const viewMode = React.useSyncExternalStore(
    subscribeViewMode,
    getViewModeSnapshot,
    () => "cards"
  );

  const {
    setShortcutsForFilters,
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
  } = useShortcutFilters();

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchShortcuts();
      setShortcuts(data);
    } catch (err) {
      console.error("Failed to fetch shortcuts", err);
      setError("Could not load shortcuts from the backend API.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  React.useEffect(() => {
    setShortcutsForFilters(shortcuts);
  }, [shortcuts, setShortcutsForFilters]);

  const anyModalOpen =
    modalOpen ||
    recordModalOpen ||
    Boolean(deletingShortcut) ||
    helpOpen ||
    importExportOpen;

  // Global keyboard-first shortcuts
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (anyModalOpen) return;

      const isCmdK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
      if (isCmdK) {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      if (isTypingTarget(e.target) || e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      } else if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        setEditingShortcut(null);
        setModalOpen(true);
      } else if (e.key.toLowerCase() === "v") {
        e.preventDefault();
        saveViewMode(getViewModeSnapshot() === "cards" ? "compact" : "cards");
      } else if (e.key === "?") {
        e.preventDefault();
        setHelpOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [anyModalOpen]);

  // Add/Edit Save
  const handleSave = async (sc: Shortcut) => {
    const payload: Shortcut = {
      ...sc,
      keys: sc.keys && sc.keys.length ? sc.keys : [sc.name],
      tags: sc.tags || [],
      os: sc.os || "any",
    };

    if (editingShortcut && editingShortcut.id) {
      const updated = await updateShortcut(payload);
      setShortcuts((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } else {
      const newSc = await addShortcut(payload);
      setShortcuts((prev) => [...prev, newSc]);
    }
    setEditingShortcut(null);
  };

  // Record Keys Save
  const handleRecordKeysSave = async (keys: string[]) => {
    if (!recordShortcut) return;
    const updated = await updateShortcut({
      ...recordShortcut,
      keys,
    });
    setShortcuts((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
    setRecordShortcut(null);
  };

  // Delete Confirm
  const handleConfirmDelete = async (shortcut: Shortcut) => {
    if (!shortcut.id) return;
    try {
      await deleteShortcut(shortcut);
      setShortcuts((prev) => prev.filter((s) => s.id !== shortcut.id));
    } catch (err) {
      console.error("Failed to delete shortcut", err);
      setError(`Failed to delete "${shortcut.name}". Please try again.`);
      throw err;
    }
  };

  // Import multiple shortcuts
  const handleImportShortcuts = async (items: Shortcut[]): Promise<number> => {
    const created: Shortcut[] = [];
    for (const item of items) {
      const saved = await addShortcut(item);
      created.push(saved);
    }
    setShortcuts((prev) => [...prev, ...created]);
    return created.length;
  };

  const conflictMap = React.useMemo(
    () => buildConflictMap(shortcuts),
    [shortcuts]
  );

  // Filter across search query, apps, OSes, and tags
  const q = searchQuery.trim().toLowerCase();
  const filteredShortcuts = shortcuts.filter((sc) => {
    if (selectedApps.length > 0) {
      const appName = (sc.app || "General").toLowerCase();
      if (!selectedApps.some((a) => a.toLowerCase() === appName)) return false;
    }

    if (selectedOses.length > 0) {
      const scOses = parseOsList(sc.os).map((o) => o.toLowerCase());
      if (!selectedOses.some((o) => scOses.includes(o.toLowerCase()))) {
        return false;
      }
    }

    if (selectedTags.length > 0) {
      const scTags = (sc.tags || []).map((t) => t.toLowerCase());
      const matchesTags =
        tagLogic === "AND"
          ? selectedTags.every((t) => scTags.includes(t.toLowerCase()))
          : selectedTags.some((t) => scTags.includes(t.toLowerCase()));
      if (!matchesTags) return false;
    }

    if (!q) return true;
    const nameMatch = sc.name?.toLowerCase().includes(q) ?? false;
    const appMatch = sc.app?.toLowerCase().includes(q) ?? false;
    const descMatch = sc.description?.toLowerCase().includes(q) ?? false;
    const osMatch = sc.os?.toLowerCase().includes(q) ?? false;
    const keyMatch = sc.keys?.some((k) => k.toLowerCase().includes(q)) ?? false;
    const tagMatch = sc.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
    return (
      nameMatch || appMatch || descMatch || osMatch || keyMatch || tagMatch
    );
  });

  const groupedShortcuts = filteredShortcuts.reduce(
    (groups: Record<string, Shortcut[]>, sc) => {
      const appName = sc.app || "General";
      if (!groups[appName]) groups[appName] = [];
      groups[appName].push(sc);
      return groups;
    },
    {}
  );

  const appNames = Object.keys(groupedShortcuts);
  const appSuggestions = appFacets.map((f) => f.label);
  const osSuggestions = osFacets.map((f) => f.label);

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Top Bar: Search & Actions */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search shortcuts, apps, keys, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                if (searchQuery) {
                  setSearchQuery("");
                } else {
                  e.currentTarget.blur();
                }
              }
            }}
            className="w-full pl-10 pr-16 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          ) : (
            <span className="hidden sm:flex absolute inset-y-0 right-3 items-center pointer-events-none">
              <kbd className="px-1.5 py-0.5 text-[11px] font-mono rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
                /
              </kbd>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div
            role="group"
            aria-label="View mode"
            className="inline-flex rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-sm"
          >
            <button
              type="button"
              onClick={() => saveViewMode("cards")}
              aria-pressed={viewMode === "cards"}
              title="Cards view (v)"
              aria-label="Cards view"
              className={`p-2 rounded-lg transition ${
                viewMode === "cards"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              onClick={() => saveViewMode("compact")}
              aria-pressed={viewMode === "compact"}
              title="Compact cheat-sheet view (v)"
              aria-label="Compact cheat-sheet view"
              className={`p-2 rounded-lg transition ${
                viewMode === "compact"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <List size={16} />
            </button>
          </div>

          <button
            type="button"
            onClick={() => setImportExportOpen(true)}
            title="Backup, Export & Import"
            aria-label="Open backup, export, and import modal"
            className="flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium transition shadow-sm"
          >
            <ArrowUpDown size={17} />
            <span className="hidden sm:inline">Import / Export</span>
          </button>

          <button
            type="button"
            onClick={() => setHelpOpen(true)}
            title="Keyboard shortcuts (?)"
            aria-label="Open keyboard shortcuts help"
            className="flex items-center justify-center p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
          >
            <HelpCircle size={18} />
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingShortcut(null);
              setModalOpen(true);
            }}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/25 active:scale-95 duration-200"
          >
            <Plus size={20} />
            Add Shortcut
          </button>
        </div>
      </div>

      {/* Active Filter Chips & Result Count */}
      {(hasActiveFilters || q.length > 0) && !loading && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium mr-1">
            Showing {filteredShortcuts.length} of {shortcuts.length}
          </span>

          {selectedApps.map((app) => (
            <button
              key={`app-${app}`}
              type="button"
              onClick={() => toggleApp(app)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-medium hover:bg-blue-200 dark:hover:bg-blue-900/60 transition"
            >
              <span>App: {app}</span>
              <X size={12} />
            </button>
          ))}

          {selectedOses.map((os) => (
            <button
              key={`os-${os}`}
              type="button"
              onClick={() => toggleOs(os)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/60 transition"
            >
              <span>OS: {os}</span>
              <X size={12} />
            </button>
          ))}

          {selectedTags.map((tag) => (
            <button
              key={`tag-${tag}`}
              type="button"
              onClick={() => toggleTag(tag)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition"
            >
              <span>#{tag}</span>
              <X size={12} />
            </button>
          ))}

          {(hasActiveFilters || q.length > 0) && (
            <button
              type="button"
              onClick={() => {
                clearAllFilters();
                setSearchQuery("");
              }}
              className="px-2 py-1 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 underline underline-offset-2"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 font-medium transition"
            >
              <RotateCw size={14} />
              Retry
            </button>
            <button
              type="button"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="w-full">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : appNames.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-slate-500 dark:text-slate-400"
          >
            <p className="text-lg font-medium">
              {error ? "Unable to display shortcuts." : "No shortcuts found."}
            </p>
            {(q || hasActiveFilters) && (
              <p className="text-sm mt-1">
                Try clearing filters or searching for a different keyword, key,
                or tag.
              </p>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col gap-10">
            {appNames.map((app) => (
              <motion.section
                key={app}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-blue-400">
                      {app}
                    </h2>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {groupedShortcuts[app].length}
                    </span>
                  </div>
                </div>

                <div
                  className={
                    viewMode === "compact"
                      ? "bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm divide-y divide-slate-100 dark:divide-slate-700/60 overflow-hidden"
                      : "grid grid-cols-1 md:grid-cols-2 gap-6"
                  }
                >
                  {groupedShortcuts[app].map((sc) => {
                    const ItemComponent =
                      viewMode === "compact"
                        ? ShortcutCompactRow
                        : ShortcutCard;
                    return (
                      <ItemComponent
                        key={sc.id}
                        shortcut={sc}
                        hasConflict={
                          (conflictMap.get(getConflictKey(sc)) || 0) > 1
                        }
                        onEditDetails={(item) => {
                          setEditingShortcut(item);
                          setModalOpen(true);
                        }}
                        onRecordKeys={(item) => {
                          setRecordShortcut(item);
                          setRecordModalOpen(true);
                        }}
                        onDelete={(item) => setDeletingShortcut(item)}
                        onFilterOs={toggleOs}
                        onFilterTag={toggleTag}
                      />
                    );
                  })}
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && (
          <AddEditShortcutModal
            shortcut={editingShortcut}
            appSuggestions={appSuggestions}
            osSuggestions={osSuggestions}
            onClose={() => {
              setModalOpen(false);
              setEditingShortcut(null);
            }}
            onSave={handleSave}
          />
        )}

        {recordModalOpen && recordShortcut && (
          <RecordKeysModal
            shortcut={recordShortcut}
            onClose={() => {
              setRecordModalOpen(false);
              setRecordShortcut(null);
            }}
            onSave={handleRecordKeysSave}
          />
        )}

        {deletingShortcut && (
          <DeleteConfirmModal
            shortcut={deletingShortcut}
            onClose={() => setDeletingShortcut(null)}
            onConfirm={handleConfirmDelete}
          />
        )}

        {helpOpen && <ShortcutsHelpModal onClose={() => setHelpOpen(false)} />}

        {importExportOpen && (
          <ImportExportModal
            allShortcuts={shortcuts}
            filteredShortcuts={filteredShortcuts}
            hasActiveFilters={hasActiveFilters || q.length > 0}
            onImportShortcuts={handleImportShortcuts}
            onClose={() => setImportExportOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
