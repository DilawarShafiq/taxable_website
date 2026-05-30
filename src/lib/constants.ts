export const JURISDICTION_FLAGS: Record<string, string> = {
  usa: "🇺🇸",
  uk: "🇬🇧",
  saudi: "🇸🇦",
  pakistan: "🇵🇰",
  uae: "🇦🇪",
};

export const JURISDICTION_NAMES: Record<string, string> = {
  usa: "United States",
  uk: "United Kingdom",
  saudi: "Saudi Arabia",
  pakistan: "Pakistan",
  uae: "UAE",
};

export const JURISDICTION_AUTHORITIES: Record<string, string> = {
  usa: "IRS",
  uk: "HMRC",
  saudi: "ZATCA",
  pakistan: "FBR",
  uae: "FTA",
};

export const JURISDICTION_OPTIONS = [
  { value: "pakistan", label: "🇵🇰 Pakistan", sub: "FBR" },
  { value: "uk", label: "🇬🇧 United Kingdom", sub: "HMRC" },
  { value: "usa", label: "🇺🇸 United States", sub: "IRS" },
  { value: "saudi", label: "🇸🇦 Saudi Arabia", sub: "ZATCA" },
  { value: "uae", label: "🇦🇪 UAE", sub: "FTA" },
];

export const CASE_STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_review: "In Review",
  pending_docs: "Awaiting Docs",
  filed: "Filed",
  closed: "Closed",
};

export const CASE_STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  in_review: "bg-yellow-100 text-yellow-700",
  pending_docs: "bg-orange-100 text-orange-700",
  filed: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-600",
};

export const APPOINTMENT_STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export const DOCUMENT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  processing: "bg-blue-100 text-blue-700",
  done: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

export const DOCUMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  processing: "Processing",
  done: "Done",
  failed: "Failed",
};

export const CASE_TYPE_LABELS: Record<string, string> = {
  tax_filing: "Tax Filing",
  audit: "Audit",
  accounting: "Accounting",
  consultation: "Consultation",
};
