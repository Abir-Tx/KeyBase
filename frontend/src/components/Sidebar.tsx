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
        } transition-transform duration-300 shadow-xl z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
        aria-hidden={!open}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            KeyBase
          </h1>
          <button
            onClick={toggle}
            className="p-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            aria-label="Toggle sidebar"
          >
            {open ? "❌" : "☰"}
          </button>
        </div>

        <nav className="mt-6">
          <ul className="flex flex-col gap-1 px-2">
            {["OS Arch", "Apps", "Favorites"].map((item) => (
              <li
                key={item}
                className="p-3 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer transition"
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {!open && (
        <button
          onClick={toggle}
          aria-label="Open sidebar"
          className="fixed left-0 top-4 z-50 p-2 rounded-r-md bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          ☰
        </button>
      )}
    </>
  );
}
