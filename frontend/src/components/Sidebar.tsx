"use client";

import * as React from "react";
import { Menu, X, ExternalLink, Keyboard } from "lucide-react";

type SidebarProps = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

/**
 * Collapsible slide-out navigation drawer with backdrop and Escape-key close.
 */
export default function Sidebar({ open, onOpen, onClose }: SidebarProps) {
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
        className={`fixed inset-y-0 left-0 w-64 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 shadow-xl z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between`}
        aria-hidden={!open}
      >
        <div>
          <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <Keyboard size={20} className="text-blue-600 dark:text-blue-400" />
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                KeyBase
              </h1>
              <a
                href="https://github.com/Abir-Tx/KeyBase"
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                v0.9.1
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

          <nav className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-2">
              Workspace
            </p>
            <ul className="flex flex-col gap-1">
              <li className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-medium text-sm">
                All Shortcuts
              </li>
            </ul>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
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
          className="fixed left-4 top-6 z-40 p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Menu size={18} />
        </button>
      )}
    </>
  );
}
