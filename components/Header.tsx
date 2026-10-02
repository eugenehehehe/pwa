import Link from "next/link";
import InstallPWA from "./InstallPWA";
import { ConnectionBadge } from "./OfflineNotifier";

function LogoMark() {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 17l6-6 4 4 8-8" />
        <circle cx="21" cy="7" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/80 dark:supports-[backdrop-filter]:bg-zinc-950/60">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50"
        >
          <LogoMark />
          <span className="hidden sm:inline">Inventaris Kampus</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ConnectionBadge />
          <InstallPWA />
        </div>
      </div>
    </header>
  );
}
