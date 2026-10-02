"use client";

import { useMemo, useState } from "react";
import TapCardModal from "@/components/TapCardModal";
import { useInventory } from "@/components/InventoryProvider";
import {
  ASSET_STATUS_META,
  CATEGORY_ICON,
  type AssetStatus,
} from "@/lib/mockData";

type StatusFilter = "semua" | AssetStatus;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "semua", label: "Semua" },
  { value: "tersedia", label: "Tersedia" },
  { value: "dipinjam", label: "Dipinjam" },
  { value: "perawatan", label: "Perawatan" },
];

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export default function InventoryPage() {
  const { assets, getOpenLog } = useInventory();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("semua");
  const [activeAssetId, setActiveAssetId] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return assets.filter((asset) => {
      const matchesStatus =
        statusFilter === "semua" || asset.status === statusFilter;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        asset.name.toLowerCase().includes(normalizedQuery) ||
        asset.code.toLowerCase().includes(normalizedQuery) ||
        asset.category.toLowerCase().includes(normalizedQuery);
      return matchesStatus && matchesQuery;
    });
  }, [assets, query, statusFilter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Inventaris Barang</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Daftar barang kampus beserta status ketersediaannya.
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
            placeholder="Cari nama, kode, atau kategori..."
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

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAssets.map((asset) => {
          const meta = ASSET_STATUS_META[asset.status];
          const openLog = asset.status === "dipinjam" ? getOpenLog(asset.id) : undefined;

          return (
            <div
              key={asset.id}
              className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-2xl" aria-hidden="true">
                  {CATEGORY_ICON[asset.category]}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              </div>

              <h2 className="mt-3 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {asset.name}
              </h2>
              <p className="mt-0.5 text-xs text-zinc-400">{asset.code}</p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                {asset.category} &middot; {asset.location}
              </p>

              {openLog && (
                <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                  Dipinjam oleh {openLog.borrowerName}
                </p>
              )}

              <div className="mt-4">
                {asset.status === "tersedia" && (
                  <button
                    type="button"
                    onClick={() => setActiveAssetId(asset.id)}
                    className="w-full rounded-full bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-500"
                  >
                    Pinjamkan
                  </button>
                )}
                {asset.status === "dipinjam" && (
                  <button
                    type="button"
                    onClick={() => setActiveAssetId(asset.id)}
                    className="w-full rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-sky-500"
                  >
                    Kembalikan
                  </button>
                )}
                {asset.status === "perawatan" && (
                  <span className="block w-full rounded-full bg-zinc-100 px-4 py-2 text-center text-xs font-semibold text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500">
                    Dalam perawatan
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredAssets.length === 0 && (
          <div className="col-span-full flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-zinc-300 text-sm text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
            Tidak ada barang yang cocok dengan pencarian.
          </div>
        )}
      </div>

      {activeAssetId && (
        <TapCardModal
          key={activeAssetId}
          presetAssetId={activeAssetId}
          onClose={() => setActiveAssetId(null)}
        />
      )}
    </div>
  );
}
