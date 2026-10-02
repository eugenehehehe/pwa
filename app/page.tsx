"use client";

import { useMemo, useState } from "react";
import TapCardModal from "@/components/TapCardModal";
import { useInventory } from "@/components/InventoryProvider";
import { formatDateTime } from "@/lib/format";
import type { LoanLog } from "@/lib/mockData";

type ActivityEvent = {
  id: string;
  type: "OUT" | "IN";
  assetName: string;
  staffName: string;
  at: string;
};

function buildActivityFeed(logs: LoanLog[]): ActivityEvent[] {
  const events: ActivityEvent[] = [];

  for (const log of logs) {
    events.push({
      id: `${log.id}-out`,
      type: "OUT",
      assetName: log.assetName,
      staffName: log.borrowerName,
      at: log.checkoutAt,
    });

    if (log.checkinAt) {
      events.push({
        id: `${log.id}-in`,
        type: "IN",
        assetName: log.assetName,
        staffName: log.returnedByName ?? log.borrowerName,
        at: log.checkinAt,
      });
    }
  }

  return events.sort(
    (a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()
  );
}

function ScanIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" />
      <path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
      <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <path d="M3 12h18" />
    </svg>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold tracking-tight ${accent}`}>
        {value}
      </p>
    </div>
  );
}

export default function Home() {
  const { assets, logs } = useInventory();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const stats = useMemo(() => {
    const total = assets.length;
    const dipinjam = assets.filter((a) => a.status === "dipinjam").length;
    const overdue = logs.filter(
      (l) => l.status === "dipinjam" && l.overdue
    ).length;
    const activeStaff = new Set(
      logs.filter((l) => l.status === "dipinjam").map((l) => l.borrowerId)
    ).size;

    return { total, dipinjam, overdue, activeStaff };
  }, [assets, logs]);

  const activityFeed = useMemo(() => buildActivityFeed(logs).slice(0, 6), [
    logs,
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Dashboard Inventaris
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Ringkasan barang &amp; peminjaman kampus.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500"
        >
          <ScanIcon />
          Tap Kartu / Scan
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Barang" value={stats.total} accent="text-zinc-900 dark:text-zinc-50" />
        <StatCard label="Sedang Dipinjam" value={stats.dipinjam} accent="text-amber-600 dark:text-amber-400" />
        <StatCard label="Belum Dikembalikan (Lewat Jadwal)" value={stats.overdue} accent="text-rose-600 dark:text-rose-400" />
        <StatCard label="Petugas Aktif Meminjam" value={stats.activeStaff} accent="text-indigo-600 dark:text-indigo-400" />
      </div>

      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
        <h2 className="text-lg font-semibold">Aktivitas Terbaru</h2>
        <ul className="mt-4 divide-y divide-zinc-100 dark:divide-zinc-800">
          {activityFeed.map((event) => (
            <li key={event.id} className="flex items-center gap-3 py-3">
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                  event.type === "OUT"
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                }`}
              >
                {event.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  {event.assetName}
                </p>
                <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                  {event.type === "OUT" ? "Diambil" : "Dikembalikan"} oleh{" "}
                  {event.staffName}
                </p>
              </div>
              <span className="shrink-0 text-xs text-zinc-400">
                {formatDateTime(event.at)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
        Aplikasi ini dapat diinstal ke perangkat Anda dan tetap dapat diakses
        walau koneksi internet terputus berkat Service Worker.
      </div>

      {isModalOpen && (
        <TapCardModal key="generic" onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}
