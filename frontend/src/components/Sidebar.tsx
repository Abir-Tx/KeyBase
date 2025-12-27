"use client";

type SidebarProps = {
  open: boolean;
  toggle: () => void;
};

export default function Sidebar({ open, toggle }: SidebarProps) {
  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 w-64 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 shadow-lg z-50 bg-white dark:bg-gray-600 border-r border-gray-200 dark:border-gray-700`}
        aria-hidden={!open ? "true" : "false"}
      >
        <div className="p-2 flex justify-end">
          <button
            onClick={toggle}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            aria-label={open ? "Close sidebar" : "Open sidebar"}
          >
            {open ? "Close" : "Open"}
          </button>
        </div>

        <nav className="mt-6">
          <ul>
            <li className="p-2">OS Arch</li>
            <li className="p-2">Apps</li>
            <li className="p-2">Favorites</li>
          </ul>
        </nav>
      </aside>

      {/* When sidebar is closed, show a small persistent open button on the edge */}
      {!open && (
        <button
          onClick={toggle}
          aria-label="Open sidebar"
          className="fixed left-0 top-4 z-50 p-2 rounded-r-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          Open
        </button>
      )}
    </>
  );
}
