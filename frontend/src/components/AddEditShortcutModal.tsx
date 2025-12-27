"use client";

import * as React from "react";

type Shortcut = {
  id?: number;
  app: string;
  key: string;
  description: string;
};

type ModalProps = {
  shortcut: Shortcut | null;
  onClose: () => void;
  onSave: (sc: Shortcut) => void;
};

export default function AddEditShortcutModal({
  shortcut,
  onClose,
  onSave,
}: ModalProps) {
  const [app, setApp] = React.useState(shortcut?.app || "");
  const [keyCombo, setKeyCombo] = React.useState(shortcut?.key || "");
  const [description, setDescription] = React.useState(
    shortcut?.description || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: shortcut?.id,
      app,
      key: keyCombo,
      description,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {shortcut ? "Edit Shortcut" : "Add New Shortcut"}
        </h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="App name"
            value={app}
            onChange={(e) => setApp(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
          <input
            type="text"
            placeholder="Shortcut key"
            value={keyCombo}
            onChange={(e) => setKeyCombo(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
