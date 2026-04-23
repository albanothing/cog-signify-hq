import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/context/AppContext";
import { properties } from "@/data/mockData";
import { CheckCircle2, ChevronLeft, Send } from "lucide-react";
import { toast } from "sonner";
import type { Applicant } from "@/types";

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

const packages = [
  { id: "basic", name: "Basic", price: "$25", desc: "Identity + credit only" },
  { id: "standard", name: "Standard", price: "$45", desc: "Adds verified income" },
  { id: "premium", name: "Premium", price: "$69", desc: "Full Rental Credit Score" },
];

export function InviteSlideOver({ open, onOpenChange }: Props) {
  const { addApplicant, pushNotification, pushActivity } = useApp();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [property, setProperty] = useState(properties[0]);
  const [unit, setUnit] = useState("");
  const [rent, setRent] = useState("2400");
  const [pkg, setPkg] = useState("premium");
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState(0);

  const reset = () => {
    setStep(1); setName(""); setEmail(""); setPhone(""); setUnit(""); setRent("2400"); setPkg("premium"); setSending(false); setProgress(0);
  };

  const handleClose = (next: boolean) => {
    if (!next) setTimeout(reset, 250);
    onOpenChange(next);
  };

  const submit = () => {
    setSending(true);
    let p = 0;
    const id = setInterval(() => {
      p += 18;
      setProgress(Math.min(100, p));
      if (p >= 100) {
        clearInterval(id);
        const newApp: Applicant = {
          id: `app-${Date.now().toString(36)}`,
          name, email, phone,
          avatarColor: "187 92% 45%",
          property, unit: unit || "Unit TBD",
          monthlyRent: Number(rent), monthlyIncome: 0, employer: "—",
          status: "Pending", rentalScore: 0, traditionalCredit: null,
          identity: "pending", income: "pending", rentalHistory: "pending", creditCheck: "pending",
          monthsOfRentHistory: 0, submittedAt: new Date().toISOString(),
          paymentTimeline: [], documents: [],
        };
        addApplicant(newApp);
        pushNotification({ title: "Invite sent", description: `Invite emailed to ${email}.`, type: "applicant" });
        pushActivity({ message: `Sent invite to ${name}`, type: "invited", applicantId: newApp.id });
        toast.success(`Invite sent to ${email}`);
        handleClose(false);
      }
    }, 180);
  };

  const canNext1 = name && email && phone;
  const canNext2 = property && unit && rent;

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-card">
        <SheetHeader>
          <SheetTitle className="text-xl">Invite an applicant</SheetTitle>
          <SheetDescription>3 steps · about 30 seconds</SheetDescription>
        </SheetHeader>

        {/* Stepper */}
        <div className="flex items-center gap-2 mt-6 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex-1 flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>{s}</div>
              {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-primary" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        {sending ? (
          <div className="py-12 text-center space-y-5">
            <Send className="w-10 h-10 text-primary mx-auto animate-pulse" />
            <div className="font-semibold">Sending invite to {email}…</div>
            <Progress value={progress} className="max-w-xs mx-auto" />
          </div>
        ) : step === 1 ? (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold">Applicant info</h3>
            <div className="space-y-2"><Label>Full name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@email.com" /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(555) 123-4567" /></div>
            <Button disabled={!canNext1} onClick={() => setStep(2)} className="w-full bg-gradient-primary text-primary-foreground hover:opacity-90 mt-4">Continue</Button>
          </div>
        ) : step === 2 ? (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold">Property & lease</h3>
            <div className="space-y-2">
              <Label>Property</Label>
              <Select value={property} onValueChange={setProperty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{properties.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Unit</Label><Input value={unit} onChange={e => setUnit(e.target.value)} placeholder="Unit 412" /></div>
            <div className="space-y-2"><Label>Monthly rent (USD)</Label><Input type="number" value={rent} onChange={e => setRent(e.target.value)} /></div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
              <Button disabled={!canNext2} onClick={() => setStep(3)} className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90">Continue</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            <h3 className="font-semibold">Choose screening package</h3>
            <div className="space-y-2">
              {packages.map(p => (
                <button key={p.id} onClick={() => setPkg(p.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${pkg === p.id ? "border-primary bg-primary/5" : "border-border hover:border-border/80"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold flex items-center gap-2">{p.name}
                        {pkg === p.id && <CheckCircle2 className="w-4 h-4 text-primary" />}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{p.desc}</div>
                    </div>
                    <div className="font-bold text-primary">{p.price}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="rounded-lg bg-muted/40 p-4 text-sm">
              <div className="font-semibold mb-2">Review</div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Applicant</span><span>{name}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Property</span><span>{property} · {unit}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Monthly rent</span><span>${Number(rent).toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Package</span><span className="capitalize">{pkg}</span></div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button variant="outline" onClick={() => setStep(2)}><ChevronLeft className="w-4 h-4 mr-1" /> Back</Button>
              <Button onClick={submit} className="flex-1 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                <Send className="w-4 h-4 mr-1" /> Send invite
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
