import { useState, useEffect } from "react";

type ShortcutRecorderProps = {
  initialKeys?: string[];
  onSave: (keys: string[]) => void;
};

export default function ShortcutRecorder({
  initialKeys = [],
  onSave,
}: ShortcutRecorderProps) {
  const [keys, setKeys] = useState<string[]>(initialKeys);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    if (!recording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      const pressedKeys: string[] = [];

      if (e.ctrlKey) pressedKeys.push("Ctrl");
      if (e.altKey) pressedKeys.push("Alt");
      if (e.shiftKey) pressedKeys.push("Shift");
      if (e.metaKey) pressedKeys.push("Meta"); // Cmd on Mac

      // Only push the main key if it's not a modifier
      const mainKey = e.key;
      if (!["Control", "Alt", "Shift", "Meta"].includes(mainKey)) {
        pressedKeys.push(mainKey.toUpperCase());
      }

      setKeys(pressedKeys);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Save when a main key is released
      if (!["Control", "Alt", "Shift", "Meta"].includes(e.key)) {
        onSave(keys);
        setRecording(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [recording, keys, onSave]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setRecording(true)}
        className={`px-3 py-1 rounded ${
          recording ? "bg-red-500 text-white" : "bg-blue-500 text-white"
        }`}
      >
        {recording ? "Recording..." : "Record Shortcut"}
      </button>
      <span className="px-2 py-1 border rounded bg-gray-100 dark:bg-gray-700">
        {keys.join(" + ")}
      </span>
    </div>
  );
}
