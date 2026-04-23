export type ApplicantStatus = "Approved" | "Denied" | "Pending" | "In Review" | "Credit-Invisible";

export type CheckStatus = "verified" | "warning" | "failed" | "pending";

export interface RentalPaymentMonth {
  month: string; // e.g. "Jan 2024"
  status: "on-time" | "late" | "missed" | "n/a";
  amount: number;
}

export interface Applicant {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarColor: string; // hsl token bg
  property: string;
  unit: string;
  monthlyRent: number;
  monthlyIncome: number;
  employer: string;
  status: ApplicantStatus;
  rentalScore: number; // 0-900
  traditionalCredit: number | null; // 300-850 or null for credit-invisible
  identity: CheckStatus;
  income: CheckStatus;
  rentalHistory: CheckStatus;
  creditCheck: CheckStatus;
  monthsOfRentHistory: number;
  submittedAt: string; // ISO
  notes?: string;
  denialReason?: string;
  flags?: string[];
  paymentTimeline: RentalPaymentMonth[];
  documents: { name: string; uploaded: boolean }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: "applicant" | "score" | "payment" | "system";
  read: boolean;
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  message: string;
  type: "approved" | "denied" | "invited" | "completed" | "viewed";
  applicantId?: string;
  createdAt: string;
}

export interface AppSettings {
  strictIncomeVerification: boolean;
  requireBiometricId: boolean;
  autoDenyBelowThreshold: boolean;
  minRentalScore: number;
  notifyEmail: boolean;
  notifySms: boolean;
  notifyInApp: boolean;
}

export interface CurrentUser {
  name: string;
  email: string;
  company: string;
  role: string;
  initials: string;
}
