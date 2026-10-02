"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    // Dinonaktifkan saat development agar tidak ada cache basi yang
    // mengganggu Hot Reload / Fast Refresh.
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    function register() {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.error("Gagal mendaftarkan service worker:", error);
      });
    }

    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);

  return null;
}
