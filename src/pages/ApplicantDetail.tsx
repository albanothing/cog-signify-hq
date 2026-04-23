import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/Brand";
import { RentalScoreGauge } from "@/components/RentalScoreGauge";
import { StatusBadge } from "@/components/StatusBadge";
import { InfoBox } from "@/components/InfoBox";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft, Banknote, Check, CheckCircle2, ChevronRight, FileCheck2, Fingerprint,
  Home, Mail, MessageSquareWarning, Phone, X, XCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { format } from "date-fns";

export default function ApplicantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getApplicant, updateApplicantStatus, pushActivity, pushNotification } = useApp();
  const applicant = id ? getApplicant(id) : undefined;
  const [confirmOpen, setConfirmOpen] = useState<"approve" | "deny" | null>(null);

  if (!applicant) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Applicant not found.</p>
        <Link to="/applicants"><Button variant="outline" className="mt-4">Back to applicants</Button></Link>
      </div>
    );
  }

  const rentRatio = applicant.monthlyIncome > 0 ? Math.round((applicant.monthlyRent / applicant.monthlyIncome) * 100) : 0;

  const handleDecision = (decision: "approve" | "deny") => {
    const newStatus = decision === "approve" ? "Approved" : "Denied";
    updateApplicantStatus(applicant.id, newStatus, decision === "deny" ? "Manual review — does not meet criteria" : undefined);
    pushActivity({ message: `${decision === "approve" ? "Approved" : "Denied"} ${applicant.name}`, type: decision === "approve" ? "approved" : "denied", applicantId: applicant.id });
    pushNotification({ title: `${newStatus}: ${applicant.name}`, description: `${applicant.property} · ${applicant.unit}`, type: "applicant" });
    toast.success(`${applicant.name} marked ${newStatus.toLowerCase()}`);
    setConfirmOpen(null);
    setTimeout(() => navigate("/applicants"), 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link to="/applicants" className="hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Applicants
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground">{applicant.name}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <Card className="p-6 bg-gradient-card border-border/60">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-4">
                <Avatar name={applicant.name} color={applicant.avatarColor} size={64} />
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{applicant.name}</h1>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {applicant.email}</span>
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {applicant.phone}</span>
                    <span className="flex items-center gap-1"><Home className="w-3.5 h-3.5" /> {applicant.property} · {applicant.unit}</span>
                  </div>
                </div>
              </div>
              <StatusBadge status={applicant.status} className="text-sm px-3 py-1" />
            </div>
            {applicant.notes && (
              <div className="mt-4 p-3 rounded-lg bg-secondary/10 border border-secondary/30 text-sm text-secondary-foreground">
                <span className="font-semibold text-secondary">Note:</span> {applicant.notes}
              </div>
            )}
            {applicant.flags && applicant.flags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {applicant.flags.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-warning/15 text-warning border border-warning/30">
                    <MessageSquareWarning className="w-3 h-3" /> {f}
                  </span>
                ))}
              </div>
            )}
          </Card>

          <Tabs defaultValue="overview">
            <TabsList className="bg-muted/40">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="identity">Identity</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="rental">Rental History</TabsTrigger>
              <TabsTrigger value="credit">Credit</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4 mt-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <InfoBox title="Identity Verification" status={applicant.identity}
                  metric={applicant.identity === "verified" ? "Confirmed" : applicant.identity === "pending" ? "In progress" : "Action needed"}
                  description="Multi-factor biometric + government ID match"
                  icon={<Fingerprint className="w-4 h-4" />}
                  details={[
                    { label: "Liveness check", value: applicant.identity === "verified" ? "Pass" : "—" },
                    { label: "ID match", value: applicant.identity === "verified" ? "99.7%" : "—" },
                  ]} />
                <InfoBox title="Verified Income" status={applicant.income}
                  metric={applicant.monthlyIncome > 0 ? `$${applicant.monthlyIncome.toLocaleString()}/mo` : "Pending"}
                  description={applicant.employer}
                  icon={<Banknote className="w-4 h-4" />}
                  details={[
                    { label: "Source", value: "Direct payroll" },
                    { label: "Rent-to-income", value: `${rentRatio}%` },
                  ]} />
                <InfoBox title="Rental Payment History" status={applicant.rentalHistory}
                  metric={`${applicant.monthsOfRentHistory} months`}
                  description={`On-time rate: ${calcOnTime(applicant.paymentTimeline)}%`}
                  icon={<Home className="w-4 h-4" />}
                  details={[
                    { label: "Late payments", value: String(applicant.paymentTimeline.filter(p => p.status === "late").length) },
                    { label: "Missed", value: String(applicant.paymentTimeline.filter(p => p.status === "missed").length) },
                  ]} />
                <InfoBox title="Traditional Credit" status={applicant.creditCheck}
                  metric={applicant.traditionalCredit ? String(applicant.traditionalCredit) : "Credit-Invisible"}
                  description={applicant.traditionalCredit ? "FICO-equivalent score" : "Compensated by verified rent history"}
                  icon={<FileCheck2 className="w-4 h-4" />}
                  details={[
                    { label: "Bureau", value: applicant.traditionalCredit ? "Experian" : "—" },
                    { label: "Hard inquiry", value: "No" },
                  ]} />
              </div>

              {/* Payment timeline */}
              {applicant.paymentTimeline.length > 0 && (
                <Card className="p-6 bg-gradient-card border-border/60">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Rental payment timeline</h3>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> On time</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning" /> Late</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-destructive" /> Missed</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-1.5">
                    {applicant.paymentTimeline.slice(-24).map((m, i) => (
                      <div key={i} className="group relative">
                        <div className={`h-10 rounded-md ${
                          m.status === "on-time" ? "bg-primary/70 hover:bg-primary" :
                          m.status === "late" ? "bg-warning/70 hover:bg-warning" :
                          "bg-destructive/70 hover:bg-destructive"
                        } transition-colors cursor-default`} />
                        <div className="absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-popover border border-border text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10">
                          {m.month}: {m.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Income breakdown */}
              {applicant.monthlyIncome > 0 && (
                <Card className="p-6 bg-gradient-card border-border/60">
                  <h3 className="font-semibold mb-4">Income breakdown</h3>
                  <div className="grid sm:grid-cols-3 gap-4 mb-5">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Employer</div>
                      <div className="font-semibold mt-1">{applicant.employer}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Monthly income</div>
                      <div className="font-semibold mt-1 text-primary">${applicant.monthlyIncome.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase tracking-wider">Monthly rent</div>
                      <div className="font-semibold mt-1">${applicant.monthlyRent.toLocaleString()}</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span>Rent-to-income ratio</span>
                      <span className={`font-semibold ${rentRatio > 40 ? "text-destructive" : rentRatio > 33 ? "text-warning" : "text-primary"}`}>
                        {rentRatio}%
                      </span>
                    </div>
                    <Progress value={rentRatio} className="h-2" />
                    <div className="text-xs text-muted-foreground mt-2">Recommended: under 33% · Caution: 33–40% · Risky: 40%+</div>
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="identity" className="mt-5">
              <Card className="p-6 bg-gradient-card border-border/60 space-y-4">
                <div className="flex items-center gap-3"><Fingerprint className="w-6 h-6 text-primary" /><h3 className="font-semibold text-lg">Biometric Identity Verification</h3></div>
                {[
                  { label: "Liveness detection", status: applicant.identity === "verified" },
                  { label: "Government ID match", status: applicant.identity === "verified" },
                  { label: "Selfie ↔ ID face match", status: applicant.identity === "verified" },
                  { label: "Document authenticity", status: applicant.identity === "verified" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span className="text-sm">{c.label}</span>
                    {c.status ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <span className="text-muted-foreground text-xs">Pending</span>}
                  </div>
                ))}
              </Card>
            </TabsContent>

            <TabsContent value="income" className="mt-5">
              <Card className="p-6 bg-gradient-card border-border/60">
                <div className="flex items-center gap-3 mb-4"><Banknote className="w-6 h-6 text-primary" /><h3 className="font-semibold text-lg">Verified Income</h3></div>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-lg bg-muted/30"><span className="text-sm">Employer</span><span className="font-medium">{applicant.employer}</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/30"><span className="text-sm">Monthly income</span><span className="font-medium">${applicant.monthlyIncome.toLocaleString()}</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/30"><span className="text-sm">Verification source</span><span className="font-medium">Direct payroll connection</span></div>
                  <div className="flex justify-between p-3 rounded-lg bg-muted/30"><span className="text-sm">Last verified</span><span className="font-medium">{format(new Date(applicant.submittedAt), "MMM d, yyyy")}</span></div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="rental" className="mt-5">
              <Card className="p-6 bg-gradient-card border-border/60">
                <h3 className="font-semibold text-lg mb-4">Rental payment history ({applicant.monthsOfRentHistory} months)</h3>
                <div className="space-y-2 max-h-96 overflow-auto pr-2">
                  {applicant.paymentTimeline.slice().reverse().map((m, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 text-sm">
                      <span>{m.month}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">${m.amount.toLocaleString()}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          m.status === "on-time" ? "bg-primary/15 text-primary" :
                          m.status === "late" ? "bg-warning/15 text-warning" :
                          "bg-destructive/15 text-destructive"
                        }`}>{m.status}</span>
                      </div>
                    </div>
                  ))}
                  {applicant.paymentTimeline.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">No rental history available yet.</div>}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="credit" className="mt-5">
              <Card className="p-6 bg-gradient-card border-border/60">
                <h3 className="font-semibold text-lg mb-4">Traditional Credit</h3>
                {applicant.traditionalCredit ? (
                  <div>
                    <div className="text-5xl font-bold text-gradient">{applicant.traditionalCredit}</div>
                    <div className="text-xs text-muted-foreground mt-1">Experian · soft pull</div>
                  </div>
                ) : (
                  <div className="p-5 rounded-lg bg-secondary/10 border border-secondary/30">
                    <div className="font-semibold text-secondary mb-1">Credit-Invisible</div>
                    <div className="text-sm text-muted-foreground">This applicant has no traditional credit file. Their CogSymb Rental Credit Score of <span className="text-foreground font-semibold">{applicant.rentalScore}</span> is built from verified income and rental payment history.</div>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="documents" className="mt-5">
              <Card className="p-6 bg-gradient-card border-border/60">
                <h3 className="font-semibold text-lg mb-4">Document checklist</h3>
                <div className="space-y-2">
                  {applicant.documents.map((d, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        {d.uploaded ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <XCircle className="w-4 h-4 text-muted-foreground" />}
                        <span className="text-sm">{d.name}</span>
                      </div>
                      <span className={`text-xs ${d.uploaded ? "text-primary" : "text-muted-foreground"}`}>{d.uploaded ? "Uploaded" : "Missing"}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT 1/3 sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <Card className="p-6 bg-gradient-card border-border/60 text-center">
              <RentalScoreGauge score={applicant.rentalScore} size={220} className="mx-auto" />
              <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-border/50">
                <Stat label="Income" value={applicant.monthlyIncome > 0 ? `$${(applicant.monthlyIncome / 1000).toFixed(1)}k` : "—"} />
                <Stat label="Rent ratio" value={applicant.monthlyIncome > 0 ? `${rentRatio}%` : "—"} />
                <Stat label="History" value={`${applicant.monthsOfRentHistory}mo`} />
              </div>
            </Card>

            {applicant.status !== "Approved" && applicant.status !== "Denied" && (
              <Card className="p-5 bg-gradient-card border-border/60 space-y-3">
                <div className="text-sm font-semibold">Decision</div>

                <AlertDialog open={confirmOpen === "approve"} onOpenChange={(o) => setConfirmOpen(o ? "approve" : null)}>
                  <AlertDialogTrigger asChild>
                    <Button className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-11">
                      <Check className="w-4 h-4 mr-1" /> Approve applicant
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve {applicant.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark the applicant as approved and notify your team. The applicant will receive a confirmation email.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDecision("approve")} className="bg-gradient-primary text-primary-foreground">Approve</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={confirmOpen === "deny"} onOpenChange={(o) => setConfirmOpen(o ? "deny" : null)}>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="w-full h-11 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                      <X className="w-4 h-4 mr-1" /> Deny applicant
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Deny {applicant.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will mark the applicant as denied and trigger an FCRA-compliant adverse action notice.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDecision("deny")} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Deny</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => toast.info("Request for more info sent to applicant")}>
                  Request more info
                </Button>
              </Card>
            )}

            {applicant.status === "Denied" && applicant.denialReason && (
              <Card className="p-4 bg-destructive/5 border-destructive/30">
                <div className="text-xs uppercase tracking-wider text-destructive font-semibold mb-1">Denial reason</div>
                <div className="text-sm">{applicant.denialReason}</div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
      <div className="font-semibold mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}

function calcOnTime(timeline: { status: string }[]): number {
  if (!timeline.length) return 0;
  const ot = timeline.filter(t => t.status === "on-time").length;
  return Math.round((ot / timeline.length) * 100);
}
