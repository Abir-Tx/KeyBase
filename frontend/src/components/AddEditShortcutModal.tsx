"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";

type Props = {
  shortcut: Shortcut | null;
  onClose: () => void;
  onSave: (shortcut: Shortcut) => void;
};

export default function AddEditShortcutModal({
  shortcut,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = React.useState(shortcut?.name || "");
  const [keys, setKeys] = React.useState<string[]>(shortcut?.keys || []);
  const [app, setApp] = React.useState(shortcut?.app || "");
  const [os, setOs] = React.useState(shortcut?.os || "");
  const [description, setDescription] = React.useState(
    shortcut?.description || ""
  );
  const [tags, setTags] = React.useState<string[]>(shortcut?.tags || []);

  const handleSubmit = () => {
    // ensure keys and tags are always arrays
    onSave({
      id: shortcut?.id,
      name,
      keys: keys.length ? keys : [name], // fallback to name if empty
      app,
      os,
      description,
      tags: tags || [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">
          {shortcut ? "Edit Shortcut" : "Add New Shortcut"}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Keys (comma separated)"
            value={keys.join(",")}
            onChange={(e) =>
              setKeys(e.target.value.split(",").map((k) => k.trim()))
            }
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="App"
            value={app}
            onChange={(e) => setApp(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="OS"
            value={os}
            onChange={(e) => setOs(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags.join(",")}
            onChange={(e) =>
              setTags(e.target.value.split(",").map((t) => t.trim()))
            }
            className="p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-gray-100 hover:bg-gray-400 dark:hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
