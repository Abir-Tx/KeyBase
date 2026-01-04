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
  const [recording, setRecording] = React.useState(false);

  // 🔴 Record keys logic
  React.useEffect(() => {
    if (!recording) return;

    const pressed = new Set<string>();

    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      pressed.add(e.key);
      setKeys(Array.from(pressed));
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [recording]);

  const handleSubmit = () => {
    if (!name.trim() || keys.length === 0) return;

    onSave({
      id: shortcut?.id,
      name: name.trim(),
      keys,
      app,
      os,
      description,
      tags,
    });
  };
  const isValid = name.trim().length > 0 && keys.length > 0;

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
            className="p-2 rounded border dark:bg-gray-700"
          />
          {/* The Validation check warning */}
          {!name.trim() && (
            <p className="text-sm text-red-500">Name is required</p>
          )}

          {/* Keys input */}
          <input
            type="text"
            placeholder="Keys (comma separated)"
            value={keys.join(", ")}
            onChange={(e) =>
              setKeys(
                e.target.value
                  .split(",")
                  .map((k) => k.trim())
                  .filter(Boolean) // 👈 THIS FIXES EVERYTHING
              )
            }
            className="p-2 rounded border dark:bg-gray-700"
          />
          {/* The Validation for keys input */}
          {!name.trim() && (
            <p className="text-sm text-red-500">Shortcut Keys are required</p>
          )}

          {/* Record keys */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setRecording((r) => !r)}
              className={`px-3 py-2 rounded text-sm transition ${
                recording
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {recording ? "Stop Recording" : "Record Keys"}
            </button>

            {recording && (
              <span className="text-sm text-gray-500">
                Press your shortcut…
              </span>
            )}
          </div>

          <input
            type="text"
            placeholder="App"
            value={app}
            onChange={(e) => setApp(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700"
          />

          <input
            type="text"
            placeholder="OS"
            value={os}
            onChange={(e) => setOs(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded border dark:bg-gray-700"
          />

          <input
            type="text"
            placeholder="Tags (comma separated)"
            value={tags.join(", ")}
            onChange={(e) =>
              setTags(e.target.value.split(",").map((t) => t.trim()))
            }
            className="p-2 rounded border dark:bg-gray-700"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-4 py-2 rounded transition ${
              isValid
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
