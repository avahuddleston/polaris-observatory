"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const links = [
  { href: "/", label: "Observatory" },
  { href: "/papers", label: "Papers" },
  { href: "/projects", label: "Projects" },
  { href: "/astrophotography", label: "Astrophotography" },
  { href: "/calendar", label: "Observing Nights" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout, ready } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-night/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg tracking-tight text-text">
            Polaris Observatory
          </span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
                  active
                    ? "text-amber"
                    : "text-text-dim hover:text-text"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {ready && currentUser ? (
            <>
              <Link
                href={`/profile/${currentUser.id}`}
                className="text-sm text-text-dim hover:text-text"
              >
                {currentUser.name}
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-text-dim hover:border-amber hover:text-amber transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            ready && (
              <Link
                href="/login"
                className="rounded-full border border-amber/50 bg-amber-dim/20 px-4 py-1.5 text-xs font-medium text-amber hover:bg-amber-dim/40 transition-colors"
              >
                Log in
              </Link>
            )
          )}
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto border-t border-line/60 px-6 py-2 md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-xs text-text-dim"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
