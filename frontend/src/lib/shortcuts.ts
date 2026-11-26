import { Shortcut } from "./api";

/**
 * Split a comma-separated OS string into normalized non-"any" OS names.
 */
export function parseOsList(osValue?: string): string[] {
  if (!osValue) return [];
  return osValue
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.toLowerCase() !== "any");
}

/**
 * Format a shortcut's key array as a human-readable combination string.
 */
export function formatKeysText(keys: string[] = []): string {
  return keys.join(" + ");
}

/**
 * Canonical conflict key for detecting duplicate key bindings within the same app.
 */
export function getConflictKey(shortcut: Shortcut): string {
  const app = (shortcut.app || "General").trim().toLowerCase();
  const keys = (shortcut.keys || [])
    .map((k) => k.trim().toLowerCase())
    .join("+");
  return `${app}::${keys}`;
}

/**
 * Build a map of conflict keys to occurrence counts across all shortcuts.
 */
export function buildConflictMap(shortcuts: Shortcut[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const sc of shortcuts) {
    if (!sc.keys || sc.keys.length === 0) continue;
    const key = getConflictKey(sc);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function triggerFileDownload(
  filename: string,
  content: string,
  mimeType: string
) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function getDateStamp(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Export shortcuts as portable JSON backup.
 */
export function exportShortcutsAsJson(shortcuts: Shortcut[]) {
  const clean = shortcuts.map((sc) => ({
    name: sc.name,
    keys: sc.keys,
    app: sc.app,
    os: sc.os,
    description: sc.description || "",
    tags: sc.tags || [],
  }));
  triggerFileDownload(
    `keybase-shortcuts-${getDateStamp()}.json`,
    JSON.stringify(clean, null, 2),
    "application/json"
  );
}

function escapeMdCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
}

/**
 * Export shortcuts grouped by app as a Markdown cheat sheet.
 */
export function exportShortcutsAsMarkdown(shortcuts: Shortcut[]) {
  const grouped = shortcuts.reduce<Record<string, Shortcut[]>>((acc, sc) => {
    const app = sc.app || "General";
    if (!acc[app]) acc[app] = [];
    acc[app].push(sc);
    return acc;
  }, {});

  const lines: string[] = [
    "# KeyBase Shortcut Cheat Sheet",
    "",
    `Exported on ${getDateStamp()} (${shortcuts.length} shortcuts)`,
    "",
  ];

  for (const app of Object.keys(grouped).sort((a, b) => a.localeCompare(b))) {
    lines.push(`## ${app}`, "");
    lines.push("| Shortcut | Keys | OS | Tags | Description |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const sc of grouped[app]) {
      const keys = sc.keys.map((k) => `\`${escapeMdCell(k)}\``).join(" + ");
      const os = escapeMdCell(sc.os || "any");
      const tags = (sc.tags || []).map((t) => `#${escapeMdCell(t)}`).join(" ");
      const desc = escapeMdCell(sc.description || "");
      lines.push(
        `| ${escapeMdCell(sc.name)} | ${keys} | ${os} | ${tags} | ${desc} |`
      );
    }
    lines.push("");
  }

  triggerFileDownload(
    `keybase-cheatsheet-${getDateStamp()}.md`,
    lines.join("\n"),
    "text/markdown"
  );
}

/**
 * Parse and validate an imported JSON array of shortcuts.
 */
export function parseImportedShortcutsJson(rawText: string): Shortcut[] {
  const parsed: unknown = JSON.parse(rawText);
  if (!Array.isArray(parsed)) {
    throw new Error("Imported JSON must be an array of shortcuts.");
  }

  const valid: Shortcut[] = [];
  for (const item of parsed) {
    if (!item || typeof item !== "object") continue;
    const record = item as Record<string, unknown>;
    const name = typeof record.name === "string" ? record.name.trim() : "";
    const keys = Array.isArray(record.keys)
      ? record.keys.filter((k): k is string => typeof k === "string" && k.trim().length > 0)
      : [];
    if (!name || keys.length === 0) continue;

    const app =
      typeof record.app === "string" && record.app.trim()
        ? record.app.trim()
        : "KeyBase";
    const os =
      typeof record.os === "string" && record.os.trim()
        ? record.os.trim()
        : "any";
    const description =
      typeof record.description === "string" ? record.description.trim() : "";
    const tags = Array.isArray(record.tags)
      ? record.tags.filter((t): t is string => typeof t === "string" && t.trim().length > 0)
      : [];

    valid.push({ name, keys, app, os, description, tags });
  }

  if (valid.length === 0) {
    throw new Error("No valid shortcuts found in the JSON file.");
  }
  return valid;
}
