"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

function useOnlineStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Badge status koneksi yang selalu tampil, cocok diletakkan di Header.
 */
export function ConnectionBadge() {
  const isOnline = useOnlineStatus();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isOnline
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
          : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isOnline ? "bg-emerald-500" : "bg-rose-500 animate-pulse"
        }`}
      />
      {isOnline ? "Online" : "Offline"}
    </span>
  );
}

/**
 * Toast yang muncul saat koneksi terputus, dan sekilas saat kembali online.
 */
export default function OfflineNotifier() {
  const isOnline = useOnlineStatus();
  const [previousIsOnline, setPreviousIsOnline] = useState(isOnline);
  const [justReconnected, setJustReconnected] = useState(false);

  // Deteksi transisi offline -> online saat render, mengikuti pola React
  // untuk "menyesuaikan state ketika sebuah nilai berubah" tanpa Effect.
  if (previousIsOnline !== isOnline) {
    setPreviousIsOnline(isOnline);
    if (isOnline) {
      setJustReconnected(true);
    }
  }

  useEffect(() => {
    if (!justReconnected) return;
    const timer = setTimeout(() => setJustReconnected(false), 3000);
    return () => clearTimeout(timer);
  }, [justReconnected]);

  if (isOnline && !justReconnected) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[60] flex justify-center px-4 pt-[max(0.5rem,env(safe-area-inset-top))]"
    >
      <div
        className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-white shadow-lg transition-colors ${
          isOnline ? "bg-emerald-600" : "bg-amber-600"
        }`}
      >
        <span
          className={`h-2 w-2 rounded-full bg-white ${
            isOnline ? "" : "animate-pulse"
          }`}
        />
        {isOnline ? "Kembali online" : "Anda sedang offline"}
      </div>
    </div>
  );
}
