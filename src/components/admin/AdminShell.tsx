"use client";

// Guard + frame for every /admin page. Only signed-in users with role "admin"
// see the dashboard; the server checks the role again on every API call.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { useAuth } from "@/context/AppContextProvider";
import Splash from "@/components/shared/Splash";
import { BrandLogo } from "@/components/shared/BrandLogo";

const NAV = [
  { href: "/admin", label: "Overview", icon: "📊" },
  { href: "/admin/users", label: "Users", icon: "👥" },
  { href: "/admin/properties", label: "Listings", icon: "🏠" },
  { href: "/admin/moderation", label: "Moderation", icon: "🛡️" },
  { href: "/admin/notifications", label: "Alerts", icon: "🔔" },
  { href: "/admin/system", label: "System & audit", icon: "⚙️" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const { authUser } = useAuth();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (!authUser) return <Splash showFooter />;

  if (authUser.role !== "admin") {
    return (
      <main className="h-screen-safe overflow-y-auto flex flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-4xl">🔒</p>
        <h1 className="text-lg font-bold text-[#143d4d]">Admins only</h1>
        <p className="text-sm text-gray-600 max-w-sm">Your account does not have access to the admin dashboard.</p>
        <Link href="/" className="text-sm font-semibold text-[#1e5f74] underline">Back to Proptriz</Link>
      </main>
    );
  }

  const isActive = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname?.startsWith(href));

  const nav = (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          onClick={() => setOpen(false)}
          aria-current={isActive(n.href) ? "page" : undefined}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
            isActive(n.href) ? "bg-[#164e66] text-white" : "text-[#111827] hover:bg-[#e0f0f5]"
          }`}
        >
          <span aria-hidden>{n.icon}</span>{n.label}
        </Link>
      ))}
    </nav>
  );

  // globals.css locks html/body to overflow:hidden, so the document never scrolls.
  // The shell is exactly one viewport tall; <main> (and the sidebar) scroll inside it.
  return (
    <div className="h-screen-safe flex flex-col md:flex-row overflow-hidden" style={{ background: "#f5f7f9" }}>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-gray-200 bg-white p-4 gap-6 overflow-y-auto">
        <div className="flex items-center gap-2">
          <BrandLogo theme="dark" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#164e66] bg-[#e0f0f5] rounded px-1.5 py-0.5">Admin</span>
        </div>
        {nav}
        <p className="mt-auto text-[11px] text-gray-400 truncate">Signed in as {authUser.display_name}</p>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden shrink-0 z-40 flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3">
        <span className="font-bold text-[#143d4d]">Proptriz Admin</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm font-semibold"
        >
          {open ? "Close" : "Menu"}
        </button>
      </header>
      {open && <div className="md:hidden shrink-0 max-h-[60%] overflow-y-auto bg-white border-b border-gray-200 p-3">{nav}</div>}

      <main className="flex-1 min-h-0 min-w-0 overflow-y-auto overflow-x-hidden overscroll-contain" style={{ WebkitOverflowScrolling: "touch" }}>
        <div className="px-4 py-5 md:px-8 md:py-8 pb-16 max-w-[1280px]">{children}</div>
      </main>
    </div>
  );
}
