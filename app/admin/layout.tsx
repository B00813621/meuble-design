"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "📊" },
  { href: "/admin/articles", label: "Articles", icon: "📝" },
  { href: "/admin/articles/nouveau", label: "Nouvel article", icon: "✏️" },
  { href: "/admin/images", label: "Bibliothèque images", icon: "🖼️" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-stone-50 font-sans">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-stone-200 bg-white">
        <div className="flex h-14 items-center border-b border-stone-200 px-5">
          <span className="font-serif text-lg font-bold text-stone-900">Admin</span>
          <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
            local
          </span>
        </div>
        <nav className="flex flex-col gap-0.5 p-3">
          {NAV.map(({ href, label, icon }) => {
            const active =
              href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-stone-900 text-white"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                }`}
              >
                <span>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-stone-100 p-4 text-xs text-stone-400">
          Panneau accessible uniquement en développement local.
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
