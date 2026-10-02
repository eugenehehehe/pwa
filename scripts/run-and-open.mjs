// Menjalankan `next <command>` lalu otomatis membuka browser ke
// http://localhost:<port> begitu server benar-benar siap menerima koneksi.
import { spawn } from "node:child_process";

const [, , command, ...extraArgs] = process.argv;

if (!command) {
  console.error("Gunakan: node scripts/run-and-open.mjs <start|dev> [...args]");
  process.exit(1);
}

const PORT = Number(process.env.PORT) || 3000;
const URL = `http://localhost:${PORT}`;

const server = spawn("npx", ["next", command, ...extraArgs], {
  stdio: "inherit",
  shell: true,
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.kill(signal));
}

server.on("exit", (code) => process.exit(code ?? 0));

async function isServerUp() {
  try {
    await fetch(URL, { signal: AbortSignal.timeout(1000) });
    return true;
  } catch {
    return false;
  }
}

function openBrowser(url) {
  const platform = process.platform;
  const openCommand =
    platform === "win32"
      ? `start "" "${url}"`
      : platform === "darwin"
      ? `open "${url}"`
      : `xdg-open "${url}"`;

  spawn(openCommand, { shell: true, stdio: "ignore", detached: true }).unref();
}

async function waitThenOpen() {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await isServerUp()) {
      console.log(`\nMembuka ${URL} di browser...`);
      openBrowser(URL);
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  console.warn(`Server tidak merespons di ${URL} setelah 30 detik, browser tidak dibuka otomatis.`);
}

waitThenOpen();
