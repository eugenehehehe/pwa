// timeZone eksplisit memastikan hasil format identik antara render di server
// dan di browser klien, apa pun zona waktu masing-masing mesin.
const dateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  timeZone: "Asia/Jakarta",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateTime(iso: string): string {
  return `${dateTimeFormatter.format(new Date(iso))} WIB`;
}
