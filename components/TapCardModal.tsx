"use client";

import { useEffect, useMemo, useState } from "react";
import { useInventory } from "./InventoryProvider";
import { ASSET_STATUS_META, CATEGORY_ICON } from "@/lib/mockData";
import { formatDateTime } from "@/lib/format";

type Step = "pilih-barang" | "tap-kartu" | "scanning" | "sukses";
type Action = "checkout" | "checkin";

type ScanResult = {
  assetName: string;
  staffName: string;
  action: Action;
  completedAt: string;
};

function CardIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
      <path d="M6 15h4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export default function TapCardModal({
  onClose,
  presetAssetId,
}: {
  onClose: () => void;
  presetAssetId?: string;
}) {
  const { assets, staff, checkoutAsset, checkinAsset } = useInventory();

  const [selectedAssetId, setSelectedAssetId] = useState(presetAssetId ?? "");
  const [step, setStep] = useState<Step>(
    presetAssetId ? "tap-kartu" : "pilih-barang"
  );
  const [scanningStaffName, setScanningStaffName] = useState<string | null>(
    null
  );
  const [result, setResult] = useState<ScanResult | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const selectableAssets = useMemo(
    () => assets.filter((asset) => asset.status !== "perawatan"),
    [assets]
  );

  const selectedAsset = assets.find((asset) => asset.id === selectedAssetId);

  const action: Action | null =
    selectedAsset?.status === "tersedia"
      ? "checkout"
      : selectedAsset?.status === "dipinjam"
      ? "checkin"
      : null;

  function handlePickAsset(assetId: string) {
    setSelectedAssetId(assetId);
    setStep("tap-kartu");
  }

  function handleTapCard(staffId: string, staffName: string) {
    if (!selectedAsset || !action) return;

    setScanningStaffName(staffName);
    setStep("scanning");

    setTimeout(() => {
      if (action === "checkout") {
        checkoutAsset(selectedAsset.id, staffId);
      } else {
        checkinAsset(selectedAsset.id, staffId);
      }

      setResult({
        assetName: selectedAsset.name,
        staffName,
        action,
        completedAt: new Date().toISOString(),
      });
      setStep("sukses");
    }, 1200);
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Simulasi tap kartu RFID"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-3xl dark:bg-zinc-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Simulasi Tap Kartu
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            <CloseIcon />
          </button>
        </div>

        {step === "pilih-barang" && (
          <div className="mt-4">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Pilih barang yang akan dipinjam atau dikembalikan.
            </p>
            <ul className="mt-4 space-y-2">
              {selectableAssets.map((asset) => {
                const meta = ASSET_STATUS_META[asset.status];
                return (
                  <li key={asset.id}>
                    <button
                      type="button"
                      onClick={() => handlePickAsset(asset.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-zinc-200 px-4 py-3 text-left transition-colors hover:border-indigo-300 hover:bg-indigo-50/50 dark:border-zinc-800 dark:hover:border-indigo-900 dark:hover:bg-indigo-500/5"
                    >
                      <span className="flex items-center gap-3">
                        <span className="text-xl" aria-hidden="true">
                          {CATEGORY_ICON[asset.category]}
                        </span>
                        <span>
                          <span className="block text-sm font-medium text-zinc-800 dark:text-zinc-100">
                            {asset.name}
                          </span>
                          <span className="block text-xs text-zinc-400">
                            {asset.code}
                          </span>
                        </span>
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badge}`}
                      >
                        {meta.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {step === "tap-kartu" && selectedAsset && action && (
          <div className="mt-4">
            <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
              <span className="text-xl" aria-hidden="true">
                {CATEGORY_ICON[selectedAsset.category]}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  {selectedAsset.name}
                </p>
                <p className="text-xs text-zinc-400">{selectedAsset.code}</p>
              </div>
              <span
                className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
                  action === "checkout"
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400"
                    : "bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400"
                }`}
              >
                {action === "checkout" ? "Pinjam (OUT)" : "Kembalikan (IN)"}
              </span>
            </div>

            <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Tap kartu petugas untuk konfirmasi:
            </p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {staff.map((person) => (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => handleTapCard(person.id, person.name)}
                  className="flex items-center gap-3 rounded-xl border border-zinc-200 px-3 py-2.5 text-left transition-colors hover:border-indigo-400 hover:bg-indigo-50/60 dark:border-zinc-800 dark:hover:border-indigo-800 dark:hover:bg-indigo-500/10"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
                    <CardIcon />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-zinc-800 dark:text-zinc-100">
                      {person.name}
                    </span>
                    <span className="block truncate text-xs text-zinc-400">
                      {person.cardId} · {person.role}
                    </span>
                  </span>
                </button>
              ))}
            </div>

            {!presetAssetId && (
              <button
                type="button"
                onClick={() => setStep("pilih-barang")}
                className="mt-4 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                &larr; Ganti barang
              </button>
            )}
          </div>
        )}

        {step === "scanning" && (
          <div className="mt-6 flex flex-col items-center gap-4 py-8 text-center">
            <span className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400/40" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-sky-500 text-white">
                <CardIcon />
              </span>
            </span>
            <div>
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                Membaca kartu {scanningStaffName}&hellip;
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Mohon tunggu sebentar
              </p>
            </div>
          </div>
        )}

        {step === "sukses" && result && (
          <div className="mt-6 flex flex-col items-center gap-4 py-6 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
              <CheckIcon />
            </span>
            <div>
              <p className="font-semibold text-zinc-800 dark:text-zinc-100">
                {result.action === "checkout"
                  ? "Barang berhasil dipinjam"
                  : "Barang berhasil dikembalikan"}
              </p>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="font-medium text-zinc-700 dark:text-zinc-200">
                  {result.assetName}
                </span>{" "}
                oleh{" "}
                <span className="font-medium text-zinc-700 dark:text-zinc-200">
                  {result.staffName}
                </span>
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                {formatDateTime(result.completedAt)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
            >
              Selesai
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
