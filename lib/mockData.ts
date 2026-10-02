export type AssetStatus = "tersedia" | "dipinjam" | "perawatan";

export type AssetCategory =
  | "Kursi"
  | "Meja"
  | "Elektronik"
  | "Kebersihan"
  | "Audio"
  | "Alat Tulis";

export type Asset = {
  id: string;
  code: string;
  name: string;
  category: AssetCategory;
  location: string;
  status: AssetStatus;
};

export type Staff = {
  id: string;
  cardId: string;
  name: string;
  role: string;
  department: string;
};

export type LoanStatus = "dipinjam" | "dikembalikan";

export type LoanLog = {
  id: string;
  assetId: string;
  assetName: string;
  assetCode: string;
  borrowerId: string;
  borrowerName: string;
  borrowerCardId: string;
  checkoutAt: string;
  checkinAt: string | null;
  returnedById?: string;
  returnedByName?: string;
  status: LoanStatus;
  /** Ditandai manual pada data dummy untuk mensimulasikan pinjaman yang lewat jadwal. */
  overdue: boolean;
};

export const ASSET_STATUS_META: Record<
  AssetStatus,
  { label: string; badge: string; dot: string }
> = {
  tersedia: {
    label: "Tersedia",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  dipinjam: {
    label: "Dipinjam",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  perawatan: {
    label: "Perawatan",
    badge: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
    dot: "bg-zinc-400",
  },
};

export const LOAN_STATUS_META: Record<
  LoanStatus,
  { label: string; badge: string }
> = {
  dipinjam: {
    label: "Dipinjam",
    badge:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  dikembalikan: {
    label: "Dikembalikan",
    badge:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
};

export const CATEGORY_ICON: Record<AssetCategory, string> = {
  Kursi: "🪑",
  Meja: "🗄️",
  Elektronik: "🔌",
  Kebersihan: "🧹",
  Audio: "🎤",
  "Alat Tulis": "✏️",
};

export const INITIAL_ASSETS: Asset[] = [
  {
    id: "AST-001",
    code: "RFID-AST-001",
    name: "Kursi Kuliah Lipat",
    category: "Kursi",
    location: "Gudang GKU Lt.1",
    status: "tersedia",
  },
  {
    id: "AST-002",
    code: "RFID-AST-002",
    name: "Meja Seminar Lipat",
    category: "Meja",
    location: "Gudang GKU Lt.1",
    status: "dipinjam",
  },
  {
    id: "AST-003",
    code: "RFID-AST-003",
    name: "Proyektor Epson EB-X06",
    category: "Elektronik",
    location: "Ruang Multimedia",
    status: "dipinjam",
  },
  {
    id: "AST-004",
    code: "RFID-AST-004",
    name: "Laptop Inventaris #3",
    category: "Elektronik",
    location: "Lab Komputer 2",
    status: "tersedia",
  },
  {
    id: "AST-005",
    code: "RFID-AST-005",
    name: "Mic Wireless Shure",
    category: "Audio",
    location: "Ruang Auditorium",
    status: "perawatan",
  },
  {
    id: "AST-006",
    code: "RFID-AST-006",
    name: "Sapu Ijuk",
    category: "Kebersihan",
    location: "Gudang Kebersihan",
    status: "tersedia",
  },
  {
    id: "AST-007",
    code: "RFID-AST-007",
    name: "Pel Lantai",
    category: "Kebersihan",
    location: "Gudang Kebersihan",
    status: "tersedia",
  },
  {
    id: "AST-008",
    code: "RFID-AST-008",
    name: "Papan Tulis Mini",
    category: "Alat Tulis",
    location: "Ruang 204",
    status: "tersedia",
  },
  {
    id: "AST-009",
    code: "RFID-AST-009",
    name: "Spidol Board Marker (Box)",
    category: "Alat Tulis",
    location: "Ruang TU",
    status: "dipinjam",
  },
  {
    id: "AST-010",
    code: "RFID-AST-010",
    name: "Printer Canon G2010",
    category: "Elektronik",
    location: "Ruang TU",
    status: "perawatan",
  },
  {
    id: "AST-011",
    code: "RFID-AST-011",
    name: "Kabel HDMI 10m",
    category: "Elektronik",
    location: "Ruang Multimedia",
    status: "tersedia",
  },
  {
    id: "AST-012",
    code: "RFID-AST-012",
    name: "Kursi Sofa Tunggu",
    category: "Kursi",
    location: "Lobi Fakultas",
    status: "dipinjam",
  },
];

export const STAFF_DIRECTORY: Staff[] = [
  {
    id: "STF-01",
    cardId: "CARD-1001",
    name: "Yoga Pratama",
    role: "Petugas Kebersihan",
    department: "Rumah Tangga",
  },
  {
    id: "STF-02",
    cardId: "CARD-1002",
    name: "Rina Marlina",
    role: "Staff Tata Usaha",
    department: "TU Fakultas",
  },
  {
    id: "STF-03",
    cardId: "CARD-1003",
    name: "Budi Santoso",
    role: "Teknisi IT",
    department: "UPT TIK",
  },
  {
    id: "STF-04",
    cardId: "CARD-1004",
    name: "Dewi Anjani",
    role: "Asisten Laboratorium",
    department: "Lab Komputer",
  },
  {
    id: "STF-05",
    cardId: "CARD-1005",
    name: "Ahmad Fauzi",
    role: "Petugas Keamanan",
    department: "Satpam Kampus",
  },
  {
    id: "STF-06",
    cardId: "CARD-1006",
    name: "Siti Nurhaliza",
    role: "Mahasiswa Magang",
    department: "BEM Fakultas",
  },
];

export const INITIAL_LOGS: LoanLog[] = [
  {
    id: "LOG-001",
    assetId: "AST-002",
    assetName: "Meja Seminar Lipat",
    assetCode: "RFID-AST-002",
    borrowerId: "STF-02",
    borrowerName: "Rina Marlina",
    borrowerCardId: "CARD-1002",
    checkoutAt: "2026-09-29T08:10:00+07:00",
    checkinAt: null,
    status: "dipinjam",
    overdue: true,
  },
  {
    id: "LOG-002",
    assetId: "AST-003",
    assetName: "Proyektor Epson EB-X06",
    assetCode: "RFID-AST-003",
    borrowerId: "STF-03",
    borrowerName: "Budi Santoso",
    borrowerCardId: "CARD-1003",
    checkoutAt: "2026-10-01T13:00:00+07:00",
    checkinAt: null,
    status: "dipinjam",
    overdue: false,
  },
  {
    id: "LOG-003",
    assetId: "AST-009",
    assetName: "Spidol Board Marker (Box)",
    assetCode: "RFID-AST-009",
    borrowerId: "STF-02",
    borrowerName: "Rina Marlina",
    borrowerCardId: "CARD-1002",
    checkoutAt: "2026-09-28T09:00:00+07:00",
    checkinAt: null,
    status: "dipinjam",
    overdue: true,
  },
  {
    id: "LOG-004",
    assetId: "AST-012",
    assetName: "Kursi Sofa Tunggu",
    assetCode: "RFID-AST-012",
    borrowerId: "STF-05",
    borrowerName: "Ahmad Fauzi",
    borrowerCardId: "CARD-1005",
    checkoutAt: "2026-10-02T07:30:00+07:00",
    checkinAt: null,
    status: "dipinjam",
    overdue: false,
  },
  {
    id: "LOG-005",
    assetId: "AST-001",
    assetName: "Kursi Kuliah Lipat",
    assetCode: "RFID-AST-001",
    borrowerId: "STF-06",
    borrowerName: "Siti Nurhaliza",
    borrowerCardId: "CARD-1006",
    checkoutAt: "2026-09-25T10:00:00+07:00",
    checkinAt: "2026-09-25T15:00:00+07:00",
    returnedById: "STF-06",
    returnedByName: "Siti Nurhaliza",
    status: "dikembalikan",
    overdue: false,
  },
  {
    id: "LOG-006",
    assetId: "AST-006",
    assetName: "Sapu Ijuk",
    assetCode: "RFID-AST-006",
    borrowerId: "STF-01",
    borrowerName: "Yoga Pratama",
    borrowerCardId: "CARD-1001",
    checkoutAt: "2026-09-26T07:00:00+07:00",
    checkinAt: "2026-09-26T07:40:00+07:00",
    returnedById: "STF-01",
    returnedByName: "Yoga Pratama",
    status: "dikembalikan",
    overdue: false,
  },
  {
    id: "LOG-007",
    assetId: "AST-004",
    assetName: "Laptop Inventaris #3",
    assetCode: "RFID-AST-004",
    borrowerId: "STF-04",
    borrowerName: "Dewi Anjani",
    borrowerCardId: "CARD-1004",
    checkoutAt: "2026-09-30T09:00:00+07:00",
    checkinAt: "2026-10-01T09:00:00+07:00",
    returnedById: "STF-04",
    returnedByName: "Dewi Anjani",
    status: "dikembalikan",
    overdue: false,
  },
  {
    id: "LOG-008",
    assetId: "AST-011",
    assetName: "Kabel HDMI 10m",
    assetCode: "RFID-AST-011",
    borrowerId: "STF-03",
    borrowerName: "Budi Santoso",
    borrowerCardId: "CARD-1003",
    checkoutAt: "2026-09-27T11:00:00+07:00",
    checkinAt: "2026-09-27T14:00:00+07:00",
    returnedById: "STF-03",
    returnedByName: "Budi Santoso",
    status: "dikembalikan",
    overdue: false,
  },
];
