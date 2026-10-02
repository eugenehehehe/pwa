import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaturan",
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight">Pengaturan</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        Kelola preferensi aplikasi monitoring Anda.
      </p>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
              Notifikasi Push
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Dapatkan notifikasi saat ada perangkat bermasalah.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            Aktif
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
              Mode Offline
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Simpan data terakhir agar tetap dapat diakses tanpa internet.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            Aktif
          </span>
        </div>
      </div>
    </div>
  );
}
