"use client";

import { useMemo, useState } from "react";
import { useInventory } from "@/components/InventoryProvider";
import { formatDateTime } from "@/lib/format";
import { LOAN_STATUS_META, type LoanStatus } from "@/lib/mockData";

type StatusFilter = "semua" | LoanStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "dipinjam", label: "Dipinjam" },
  { value: "dikembalikan", label: "Sudah Dikembalikan" },
];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function LogsPage() {
  const { logs } = useInventory();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("semua");

  const filteredLogs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return logs
      .filter((log) => {
        const matchesStatus =
          statusFilter === "semua" || log.status === statusFilter;
        const matchesQuery =
          normalizedQuery.length === 0 ||
          log.assetName.toLowerCase().includes(normalizedQuery) ||
          log.borrowerName.toLowerCase().includes(normalizedQuery);
        return matchesStatus && matchesQuery;
      })
      .sort(
        (a, b) =>
          new Date(b.checkoutAt).getTime() - new Date(a.checkoutAt).getTime()
      );
  }, [logs, query, statusFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Log Peminjaman</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Riwayat transaksi pengambilan (OUT) dan pengembalian (IN) barang.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari nama petugas atau barang..."
            className="w-full rounded-full border border-zinc-200 bg-white py-2 pl-9 pr-4 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === filter.value
                  ? "bg-indigo-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabel — tampil di layar md ke atas */}
      <div className="mt-6 hidden overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm md:block dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400">
            <tr>
              <th className="px-4 py-3 font-medium sm:px-6">Barang</th>
              <th className="px-4 py-3 font-medium sm:px-6">Petugas</th>
              <th className="px-4 py-3 font-medium sm:px-6">Waktu Pinjam</th>
              <th className="px-4 py-3 font-medium sm:px-6">Waktu Kembali</th>
              <th className="px-4 py-3 font-medium sm:px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filteredLogs.map((log) => {
              const meta = LOAN_STATUS_META[log.status];
              return (
                <tr key={log.id}>
                  <td className="px-4 py-3 sm:px-6">
                    <p className="font-medium text-zinc-800 dark:text-zinc-100">
                      {log.assetName}
                    </p>
                    <p className="text-xs text-zinc-400">{log.assetCode}</p>
                  </td>
                  <td className="px-4 py-3 text-zinc-600 sm:px-6 dark:text-zinc-300">
                    {log.borrowerName}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 sm:px-6 dark:text-zinc-400">
                    {formatDateTime(log.checkoutAt)}
                  </td>
                  <td className="px-4 py-3 text-zinc-500 sm:px-6 dark:text-zinc-400">
                    {log.checkinAt ? formatDateTime(log.checkinAt) : "-"}
                  </td>
                  <td className="px-4 py-3 sm:px-6">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
                    >
                      {meta.label}
                      {log.status === "dipinjam" && log.overdue && " (Lewat Jadwal)"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="flex min-h-40 items-center justify-center text-sm text-zinc-400 dark:text-zinc-500">
            Tidak ada log yang cocok dengan pencarian.
          </div>
        )}
      </div>

      {/* Daftar kartu — tampil di bawah md (Mobile) */}
      <div className="mt-6 space-y-3 md:hidden">
        {filteredLogs.map((log) => {
          const meta = LOAN_STATUS_META[log.status];
          return (
            <div
              key={log.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {log.assetName}
                  </p>
                  <p className="text-xs text-zinc-400">{log.assetCode}</p>
                </div>
                <span
                  className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
                >
                  {meta.label}
                  {log.status === "dipinjam" && log.overdue && " (Lewat)"}
                </span>
              </div>
              <dl className="mt-3 space-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <div className="flex justify-between gap-2">
                  <dt>Petugas</dt>
                  <dd className="font-medium text-zinc-700 dark:text-zinc-200">
                    {log.borrowerName}
                  </dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Waktu Pinjam</dt>
                  <dd>{formatDateTime(log.checkoutAt)}</dd>
                </div>
                <div className="flex justify-between gap-2">
                  <dt>Waktu Kembali</dt>
                  <dd>{log.checkinAt ? formatDateTime(log.checkinAt) : "-"}</dd>
                </div>
              </dl>
            </div>
          );
        })}

        {filteredLogs.length === 0 && (
          <div className="flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-zinc-300 text-sm text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
            Tidak ada log yang cocok dengan pencarian.
          </div>
        )}
      </div>
    </div>
  );
}
