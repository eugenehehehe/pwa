"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  INITIAL_ASSETS,
  INITIAL_LOGS,
  STAFF_DIRECTORY,
  type Asset,
  type LoanLog,
  type Staff,
} from "@/lib/mockData";

type InventoryContextValue = {
  assets: Asset[];
  staff: Staff[];
  logs: LoanLog[];
  /** Pinjamkan sebuah barang kepada petugas (Tap Kartu / OUT). */
  checkoutAsset: (assetId: string, staffId: string) => void;
  /** Kembalikan sebuah barang yang sedang dipinjam (Tap Kartu / IN). */
  checkinAsset: (assetId: string, staffId: string) => void;
  /** Cari log pinjaman yang masih aktif untuk sebuah barang. */
  getOpenLog: (assetId: string) => LoanLog | undefined;
};

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [assets, setAssets] = useState<Asset[]>(INITIAL_ASSETS);
  const [logs, setLogs] = useState<LoanLog[]>(INITIAL_LOGS);
  const staff = STAFF_DIRECTORY;

  function getOpenLog(assetId: string) {
    return logs.find((log) => log.assetId === assetId && log.status === "dipinjam");
  }

  function checkoutAsset(assetId: string, staffId: string) {
    const asset = assets.find((item) => item.id === assetId);
    const person = staff.find((item) => item.id === staffId);
    if (!asset || !person || asset.status !== "tersedia") return;

    const newLog: LoanLog = {
      id: `LOG-${Date.now()}`,
      assetId: asset.id,
      assetName: asset.name,
      assetCode: asset.code,
      borrowerId: person.id,
      borrowerName: person.name,
      borrowerCardId: person.cardId,
      checkoutAt: new Date().toISOString(),
      checkinAt: null,
      status: "dipinjam",
      overdue: false,
    };

    setLogs((prev) => [newLog, ...prev]);
    setAssets((prev) =>
      prev.map((item) =>
        item.id === assetId ? { ...item, status: "dipinjam" } : item
      )
    );
  }

  function checkinAsset(assetId: string, staffId: string) {
    const asset = assets.find((item) => item.id === assetId);
    const person = staff.find((item) => item.id === staffId);
    if (!asset || !person || asset.status !== "dipinjam") return;

    const checkinAt = new Date().toISOString();

    setLogs((prev) =>
      prev.map((log) =>
        log.assetId === assetId && log.status === "dipinjam"
          ? {
              ...log,
              checkinAt,
              status: "dikembalikan",
              overdue: false,
              returnedById: person.id,
              returnedByName: person.name,
            }
          : log
      )
    );
    setAssets((prev) =>
      prev.map((item) =>
        item.id === assetId ? { ...item, status: "tersedia" } : item
      )
    );
  }

  const value = useMemo(
    () => ({ assets, staff, logs, checkoutAsset, checkinAsset, getOpenLog }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [assets, staff, logs]
  );

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error("useInventory harus dipakai di dalam InventoryProvider");
  }
  return ctx;
}
