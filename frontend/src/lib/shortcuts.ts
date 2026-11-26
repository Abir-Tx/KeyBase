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

function groupAndSortShortcuts(
  shortcuts: Shortcut[]
): Array<[string, Shortcut[]]> {
  const grouped = shortcuts.reduce<Record<string, Shortcut[]>>((acc, sc) => {
    const app = sc.app || "General";
    if (!acc[app]) acc[app] = [];
    acc[app].push(sc);
    return acc;
  }, {});

  return Object.keys(grouped)
    .sort((a, b) => a.localeCompare(b))
    .map((app) => [app, grouped[app]]);
}

/**
 * Export shortcuts grouped by app as a Markdown cheat sheet.
 */
export function exportShortcutsAsMarkdown(shortcuts: Shortcut[]) {
  const entries = groupAndSortShortcuts(shortcuts);

  const lines: string[] = [
    "# KeyBase Shortcut Cheat Sheet",
    "",
    `Exported on ${getDateStamp()} (${shortcuts.length} shortcuts)`,
    "",
  ];

  for (const [app, items] of entries) {
    lines.push(`## ${app}`, "");
    lines.push("| Shortcut | Keys | OS | Tags | Description |");
    lines.push("| --- | --- | --- | --- | --- |");
    for (const sc of items) {
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
 * Export shortcuts grouped by app as a clean, mobile-friendly PDF cheat sheet.
 */
export async function exportShortcutsAsPdf(shortcuts: Shortcut[]) {
  if (shortcuts.length === 0) return;

  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 36;
  const entries = groupAndSortShortcuts(shortcuts);

  // Header
  doc.setFillColor(37, 99, 235);
  doc.rect(marginX, 34, 4, 30, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42);
  doc.text("KeyBase Cheat Sheet", marginX + 12, 50);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Exported ${getDateStamp()}  •  ${shortcuts.length} shortcut${
      shortcuts.length === 1 ? "" : "s"
    } across ${entries.length} app${entries.length === 1 ? "" : "s"}`,
    marginX + 12,
    64
  );

  let cursorY = 86;

  for (const [app, items] of entries) {
    if (cursorY > pageHeight - 110) {
      doc.addPage();
      cursorY = 42;
    }

    // App section heading
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(marginX, cursorY - 10, 3, 13, 1.5, 1.5, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(30, 41, 59);
    doc.text(`${app} (${items.length})`, marginX + 9, cursorY);

    const rows = items.map((sc) => {
      const nameAndDesc = sc.description?.trim()
        ? `${sc.name}\n${sc.description.trim()}`
        : sc.name;
      const keys = formatKeysText(sc.keys);
      const osList = parseOsList(sc.os);
      const tags = (sc.tags || [])
        .map((t) => t.trim())
        .filter(Boolean)
        .map((t) => `#${t}`);
      const metaParts: string[] = [];
      if (osList.length > 0) metaParts.push(osList.join(", "));
      if (tags.length > 0) metaParts.push(tags.join(" "));
      return [nameAndDesc, keys, metaParts.join("\n") || "—"];
    });

    autoTable(doc, {
      startY: cursorY + 8,
      margin: { left: marginX, right: marginX, bottom: 42 },
      head: [["Shortcut", "Keys", "OS & Tags"]],
      body: rows,
      theme: "grid",
      rowPageBreak: "avoid",
      headStyles: {
        fillColor: [241, 245, 249],
        textColor: [51, 65, 85],
        fontStyle: "bold",
        fontSize: 8.5,
        lineColor: [226, 232, 240],
        lineWidth: 0.5,
      },
      styles: {
        font: "helvetica",
        fontSize: 9,
        textColor: [30, 41, 59],
        cellPadding: { top: 6, right: 7, bottom: 6, left: 7 },
        lineColor: [226, 232, 240],
        lineWidth: 0.5,
        overflow: "linebreak",
      },
      columnStyles: {
        0: { cellWidth: 230 },
        1: { cellWidth: 155, font: "courier", fontStyle: "bold", fontSize: 8.5 },
        2: { cellWidth: "auto", textColor: [71, 85, 105], fontSize: 8 },
      },
    });

    const docWithTable = doc as unknown as {
      lastAutoTable?: { finalY?: number };
    };
    cursorY = (docWithTable.lastAutoTable?.finalY ?? cursorY + 40) + 20;
  }

  // Page numbers footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("KeyBase", marginX, pageHeight - 20);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth - marginX,
      pageHeight - 20,
      { align: "right" }
    );
  }

  doc.save(`keybase-cheatsheet-${getDateStamp()}.pdf`);
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
