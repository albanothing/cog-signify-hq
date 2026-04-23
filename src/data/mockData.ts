import type { Applicant, NotificationItem, ActivityItem, AppSettings, CurrentUser, RentalPaymentMonth } from "@/types";

const avatarColors = [
  "187 92% 45%", "175 70% 41%", "260 70% 60%", "38 92% 55%",
  "330 75% 60%", "152 60% 50%", "210 80% 60%", "20 85% 58%",
];

function buildTimeline(monthsOfHistory: number, latePattern: "perfect" | "occasional-late" | "risky" | "none", rent: number): RentalPaymentMonth[] {
  if (latePattern === "none" || monthsOfHistory === 0) return [];
  const months: RentalPaymentMonth[] = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  for (let i = monthsOfHistory - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
    let status: RentalPaymentMonth["status"] = "on-time";
    if (latePattern === "occasional-late" && i % 11 === 3) status = "late";
    if (latePattern === "risky") {
      if (i % 4 === 1) status = "late";
      if (i % 9 === 2) status = "missed";
    }
    months.push({ month: label, status, amount: rent });
  }
  return months;
}

function isoDaysAgo(d: number): string {
  const date = new Date();
  date.setDate(date.getDate() - d);
  return date.toISOString();
}

export const seedApplicants: Applicant[] = [
  {
    id: "app-001", name: "Maya Patel", email: "maya.patel@email.com", phone: "(415) 555-0142",
    avatarColor: avatarColors[0], property: "Harborview Lofts", unit: "Unit 412",
    monthlyRent: 3200, monthlyIncome: 11800, employer: "Stripe",
    status: "Approved", rentalScore: 842, traditionalCredit: 781,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 36, submittedAt: isoDaysAgo(2),
    paymentTimeline: buildTimeline(24, "perfect", 2900),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: true }],
  },
  {
    id: "app-002", name: "Jordan Reyes", email: "jordan.r@email.com", phone: "(212) 555-0188",
    avatarColor: avatarColors[1], property: "Cedar Park Residences", unit: "Unit 207",
    monthlyRent: 2400, monthlyIncome: 4100, employer: "Freelance Designer",
    status: "Pending", rentalScore: 612, traditionalCredit: 645,
    identity: "verified", income: "warning", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 18, submittedAt: isoDaysAgo(1),
    flags: ["Rent-to-income above 50%"],
    paymentTimeline: buildTimeline(18, "occasional-late", 2100),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Tax returns", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: false }],
  },
  {
    id: "app-003", name: "Amara Okafor", email: "amara.okafor@email.com", phone: "(305) 555-0119",
    avatarColor: avatarColors[2], property: "Bayside Tower", unit: "Unit 1804",
    monthlyRent: 2800, monthlyIncome: 9200, employer: "Kaiser Permanente",
    status: "Credit-Invisible", rentalScore: 798, traditionalCredit: null,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "warning",
    monthsOfRentHistory: 42, submittedAt: isoDaysAgo(3),
    notes: "Credit-invisible immigrant — perfect rent payment record across 3.5 years.",
    paymentTimeline: buildTimeline(24, "perfect", 2500),
    documents: [{ name: "Passport", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "Landlord letter", uploaded: true }],
  },
  {
    id: "app-004", name: "Marcus Chen", email: "m.chen@email.com", phone: "(206) 555-0177",
    avatarColor: avatarColors[3], property: "Harborview Lofts", unit: "Unit 218",
    monthlyRent: 3000, monthlyIncome: 5200, employer: "Brightline Logistics",
    status: "Denied", rentalScore: 412, traditionalCredit: 540,
    identity: "verified", income: "verified", rentalHistory: "failed", creditCheck: "warning",
    monthsOfRentHistory: 22, submittedAt: isoDaysAgo(5),
    denialReason: "3 missed rent payments in last 24 months",
    paymentTimeline: buildTimeline(22, "risky", 2200),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: false }, { name: "References", uploaded: false }],
  },
  {
    id: "app-005", name: "Sofia Romano", email: "sofia.r@email.com", phone: "(617) 555-0156",
    avatarColor: avatarColors[4], property: "The Meridian", unit: "Unit 909",
    monthlyRent: 4200, monthlyIncome: 18500, employer: "McKinsey & Company",
    status: "Approved", rentalScore: 871, traditionalCredit: 812,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 60, submittedAt: isoDaysAgo(7),
    paymentTimeline: buildTimeline(24, "perfect", 3800),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: true }],
  },
  {
    id: "app-006", name: "Tariq Hassan", email: "tariq.h@email.com", phone: "(312) 555-0123",
    avatarColor: avatarColors[5], property: "Cedar Park Residences", unit: "Unit 305",
    monthlyRent: 2200, monthlyIncome: 6800, employer: "Northwestern University",
    status: "In Review", rentalScore: 738, traditionalCredit: 702,
    identity: "pending", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 24, submittedAt: isoDaysAgo(1),
    paymentTimeline: buildTimeline(24, "perfect", 1950),
    documents: [{ name: "Government ID", uploaded: true }, { name: "I-20 form", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "References", uploaded: true }],
  },
  {
    id: "app-007", name: "Elena Volkov", email: "elena.v@email.com", phone: "(718) 555-0144",
    avatarColor: avatarColors[6], property: "Bayside Tower", unit: "Unit 612",
    monthlyRent: 2600, monthlyIncome: 8400, employer: "Goldman Sachs",
    status: "Approved", rentalScore: 819, traditionalCredit: 765,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 30, submittedAt: isoDaysAgo(8),
    paymentTimeline: buildTimeline(24, "perfect", 2400),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: true }],
  },
  {
    id: "app-008", name: "Devon Williams", email: "devon.w@email.com", phone: "(404) 555-0167",
    avatarColor: avatarColors[7], property: "Sunset Park Homes", unit: "Unit 14B",
    monthlyRent: 1850, monthlyIncome: 4200, employer: "USPS",
    status: "Pending", rentalScore: 691, traditionalCredit: 658,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 14, submittedAt: isoDaysAgo(0),
    paymentTimeline: buildTimeline(14, "occasional-late", 1700),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: false }],
  },
  {
    id: "app-009", name: "Priya Sharma", email: "priya.s@email.com", phone: "(408) 555-0192",
    avatarColor: avatarColors[0], property: "The Meridian", unit: "Unit 1402",
    monthlyRent: 3800, monthlyIncome: 14200, employer: "NVIDIA",
    status: "Approved", rentalScore: 856, traditionalCredit: 798,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 48, submittedAt: isoDaysAgo(10),
    paymentTimeline: buildTimeline(24, "perfect", 3500),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: true }],
  },
  {
    id: "app-010", name: "Lucas Mendez", email: "lucas.m@email.com", phone: "(512) 555-0118",
    avatarColor: avatarColors[1], property: "Sunset Park Homes", unit: "Unit 22A",
    monthlyRent: 1950, monthlyIncome: 3100, employer: "DoorDash (1099)",
    status: "Denied", rentalScore: 388, traditionalCredit: 488,
    identity: "verified", income: "warning", rentalHistory: "failed", creditCheck: "warning",
    monthsOfRentHistory: 12, submittedAt: isoDaysAgo(6),
    denialReason: "Income below 2.5x rent threshold + late payment history",
    paymentTimeline: buildTimeline(12, "risky", 1800),
    documents: [{ name: "Government ID", uploaded: true }, { name: "1099 forms", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: false }],
  },
  {
    id: "app-011", name: "Hana Yamamoto", email: "hana.y@email.com", phone: "(503) 555-0133",
    avatarColor: avatarColors[2], property: "Riverstone Apartments", unit: "Unit 506",
    monthlyRent: 2100, monthlyIncome: 6900, employer: "Nike",
    status: "Credit-Invisible", rentalScore: 772, traditionalCredit: null,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "warning",
    monthsOfRentHistory: 28, submittedAt: isoDaysAgo(2),
    notes: "Recent immigrant — strong rental track record overseas verified by international landlord.",
    paymentTimeline: buildTimeline(24, "perfect", 1900),
    documents: [{ name: "Visa", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "International references", uploaded: true }],
  },
  {
    id: "app-012", name: "Brandon Foster", email: "brandon.f@email.com", phone: "(919) 555-0145",
    avatarColor: avatarColors[3], property: "Cedar Park Residences", unit: "Unit 411",
    monthlyRent: 2300, monthlyIncome: 7100, employer: "Duke Energy",
    status: "In Review", rentalScore: 724, traditionalCredit: 688,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 26, submittedAt: isoDaysAgo(1),
    paymentTimeline: buildTimeline(24, "occasional-late", 2050),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: true }],
  },
  {
    id: "app-013", name: "Zara Ahmed", email: "zara.a@email.com", phone: "(646) 555-0177",
    avatarColor: avatarColors[4], property: "Harborview Lofts", unit: "Unit 318",
    monthlyRent: 3100, monthlyIncome: 10200, employer: "Spotify",
    status: "Approved", rentalScore: 829, traditionalCredit: 758,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 36, submittedAt: isoDaysAgo(12),
    paymentTimeline: buildTimeline(24, "perfect", 2800),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: true }],
  },
  {
    id: "app-014", name: "Ethan Park", email: "ethan.p@email.com", phone: "(213) 555-0152",
    avatarColor: avatarColors[5], property: "Sunset Park Homes", unit: "Unit 8C",
    monthlyRent: 1750, monthlyIncome: 2400, employer: "UCLA (Student) — Co-signer: parent",
    status: "Pending", rentalScore: 534, traditionalCredit: 612,
    identity: "verified", income: "warning", rentalHistory: "pending", creditCheck: "verified",
    monthsOfRentHistory: 8, submittedAt: isoDaysAgo(0),
    flags: ["Co-signer required", "Student status"],
    paymentTimeline: buildTimeline(8, "occasional-late", 1600),
    documents: [{ name: "Student ID", uploaded: true }, { name: "Co-signer agreement", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: false }],
  },
  {
    id: "app-015", name: "Rachel Kim", email: "rachel.k@email.com", phone: "(415) 555-0190",
    avatarColor: avatarColors[6], property: "Bayside Tower", unit: "Unit 1108",
    monthlyRent: 2900, monthlyIncome: 9800, employer: "Salesforce",
    status: "Approved", rentalScore: 808, traditionalCredit: 742,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 32, submittedAt: isoDaysAgo(4),
    paymentTimeline: buildTimeline(24, "perfect", 2700),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: true }],
  },
  {
    id: "app-016", name: "Omar Diallo", email: "omar.d@email.com", phone: "(202) 555-0188",
    avatarColor: avatarColors[7], property: "Riverstone Apartments", unit: "Unit 308",
    monthlyRent: 2050, monthlyIncome: 5400, employer: "Howard University",
    status: "In Review", rentalScore: 681, traditionalCredit: 644,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 20, submittedAt: isoDaysAgo(2),
    paymentTimeline: buildTimeline(20, "occasional-late", 1900),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: true }],
  },
  {
    id: "app-017", name: "Isabella Rossi", email: "isabella.r@email.com", phone: "(305) 555-0166",
    avatarColor: avatarColors[0], property: "The Meridian", unit: "Unit 707",
    monthlyRent: 3600, monthlyIncome: 12400, employer: "Pfizer",
    status: "Approved", rentalScore: 838, traditionalCredit: 776,
    identity: "verified", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 44, submittedAt: isoDaysAgo(9),
    paymentTimeline: buildTimeline(24, "perfect", 3200),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: true }],
  },
  {
    id: "app-018", name: "Caleb Johnson", email: "caleb.j@email.com", phone: "(615) 555-0121",
    avatarColor: avatarColors[1], property: "Sunset Park Homes", unit: "Unit 5D",
    monthlyRent: 1800, monthlyIncome: 4800, employer: "FedEx",
    status: "Pending", rentalScore: 658, traditionalCredit: 632,
    identity: "pending", income: "verified", rentalHistory: "verified", creditCheck: "verified",
    monthsOfRentHistory: 16, submittedAt: isoDaysAgo(0),
    paymentTimeline: buildTimeline(16, "occasional-late", 1650),
    documents: [{ name: "Government ID", uploaded: true }, { name: "Pay stubs", uploaded: true }, { name: "Bank statements", uploaded: true }, { name: "References", uploaded: true }],
  },
];

export const seedNotifications: NotificationItem[] = [
  { id: "n1", title: "New applicant submitted", description: "Caleb Johnson applied for Sunset Park Homes Unit 5D.", type: "applicant", read: false, createdAt: isoDaysAgo(0) },
  { id: "n2", title: "Rental score ready", description: "Maya Patel scored 842 — ready for review.", type: "score", read: false, createdAt: isoDaysAgo(0) },
  { id: "n3", title: "Income verified", description: "Sofia Romano: $18,500/mo verified via payroll connection.", type: "payment", read: false, createdAt: isoDaysAgo(1) },
  { id: "n4", title: "Biometric ID confirmed", description: "Tariq Hassan completed multi-factor identity check.", type: "applicant", read: true, createdAt: isoDaysAgo(1) },
  { id: "n5", title: "Risk alert", description: "Marcus Chen flagged for missed rent payments.", type: "system", read: true, createdAt: isoDaysAgo(2) },
  { id: "n6", title: "Report completed", description: "Amara Okafor's full report is available.", type: "score", read: true, createdAt: isoDaysAgo(3) },
  { id: "n7", title: "New invite sent", description: "Invite emailed to brandon.f@email.com.", type: "applicant", read: true, createdAt: isoDaysAgo(1) },
  { id: "n8", title: "Payment history verified", description: "Hana Yamamoto: 28 months of perfect payments.", type: "payment", read: true, createdAt: isoDaysAgo(2) },
  { id: "n9", title: "Plan usage at 70%", description: "You've used 70 of 100 screenings this month.", type: "system", read: true, createdAt: isoDaysAgo(4) },
  { id: "n10", title: "New applicant submitted", description: "Ethan Park applied with co-signer.", type: "applicant", read: true, createdAt: isoDaysAgo(0) },
  { id: "n11", title: "Identity flagged for review", description: "Document quality issue on application app-018.", type: "system", read: true, createdAt: isoDaysAgo(0) },
  { id: "n12", title: "Approval recorded", description: "Sofia Romano approved for The Meridian Unit 909.", type: "applicant", read: true, createdAt: isoDaysAgo(7) },
];

export const seedActivity: ActivityItem[] = [
  { id: "a1", message: "Approved Maya Patel for Harborview Lofts Unit 412", type: "approved", applicantId: "app-001", createdAt: isoDaysAgo(2) },
  { id: "a2", message: "Sent invite to Caleb Johnson", type: "invited", applicantId: "app-018", createdAt: isoDaysAgo(0) },
  { id: "a3", message: "Denied Marcus Chen — payment history risk", type: "denied", applicantId: "app-004", createdAt: isoDaysAgo(5) },
  { id: "a4", message: "Report completed for Amara Okafor", type: "completed", applicantId: "app-003", createdAt: isoDaysAgo(3) },
  { id: "a5", message: "Approved Sofia Romano for The Meridian Unit 909", type: "approved", applicantId: "app-005", createdAt: isoDaysAgo(7) },
  { id: "a6", message: "Viewed report: Tariq Hassan", type: "viewed", applicantId: "app-006", createdAt: isoDaysAgo(1) },
  { id: "a7", message: "Approved Elena Volkov", type: "approved", applicantId: "app-007", createdAt: isoDaysAgo(8) },
  { id: "a8", message: "Sent invite to Devon Williams", type: "invited", applicantId: "app-008", createdAt: isoDaysAgo(0) },
  { id: "a9", message: "Approved Priya Sharma", type: "approved", applicantId: "app-009", createdAt: isoDaysAgo(10) },
  { id: "a10", message: "Denied Lucas Mendez — income/payment risk", type: "denied", applicantId: "app-010", createdAt: isoDaysAgo(6) },
  { id: "a11", message: "Report completed for Hana Yamamoto", type: "completed", applicantId: "app-011", createdAt: isoDaysAgo(2) },
  { id: "a12", message: "Approved Zara Ahmed", type: "approved", applicantId: "app-013", createdAt: isoDaysAgo(12) },
  { id: "a13", message: "Sent invite to Ethan Park", type: "invited", applicantId: "app-014", createdAt: isoDaysAgo(0) },
  { id: "a14", message: "Approved Rachel Kim", type: "approved", applicantId: "app-015", createdAt: isoDaysAgo(4) },
  { id: "a15", message: "Approved Isabella Rossi", type: "approved", applicantId: "app-017", createdAt: isoDaysAgo(9) },
];

export const defaultSettings: AppSettings = {
  strictIncomeVerification: true,
  requireBiometricId: true,
  autoDenyBelowThreshold: false,
  minRentalScore: 600,
  notifyEmail: true,
  notifySms: false,
  notifyInApp: true,
};

export const defaultUser: CurrentUser = {
  name: "Alex Morgan",
  email: "alex@harborviewpm.com",
  company: "Harborview Property Management",
  role: "Owner",
  initials: "AM",
};

export const properties = [
  "Harborview Lofts",
  "Cedar Park Residences",
  "Bayside Tower",
  "The Meridian",
  "Sunset Park Homes",
  "Riverstone Apartments",
];

export const teammates = [
  { name: "Alex Morgan", email: "alex@harborviewpm.com", role: "Owner", initials: "AM" },
  { name: "Priya Iyer", email: "priya@harborviewpm.com", role: "Admin", initials: "PI" },
  { name: "Daniel Cho", email: "daniel@harborviewpm.com", role: "Reviewer", initials: "DC" },
];

export const invoices = [
  { id: "INV-1042", date: "Apr 1, 2025", amount: "$499.00", status: "Paid" },
  { id: "INV-1031", date: "Mar 1, 2025", amount: "$499.00", status: "Paid" },
  { id: "INV-1018", date: "Feb 1, 2025", amount: "$499.00", status: "Paid" },
  { id: "INV-1004", date: "Jan 1, 2025", amount: "$499.00", status: "Paid" },
];

export const screeningTrend = [
  { month: "Nov", screenings: 38, approvals: 26 },
  { month: "Dec", screenings: 44, approvals: 31 },
  { month: "Jan", screenings: 51, approvals: 38 },
  { month: "Feb", screenings: 47, approvals: 35 },
  { month: "Mar", screenings: 62, approvals: 48 },
  { month: "Apr", screenings: 70, approvals: 54 },
];

export const scoreDistribution = [
  { range: "300-499", count: 2 },
  { range: "500-599", count: 1 },
  { range: "600-699", count: 5 },
  { range: "700-799", count: 6 },
  { range: "800-900", count: 8 },
];
