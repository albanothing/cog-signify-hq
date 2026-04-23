import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function RequestDemo() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [units, setUnits] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1100);
  };

  if (done) {
    return (
      <AuthShell title="You're on the list 🎉" subtitle="A solutions engineer will reach out within one business day.">
        <div className="flex flex-col items-center text-center py-6">
          <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center mb-4">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-6">In the meantime, kick the tires with our live, fully-mocked demo.</p>
          <Link to="/login" className="w-full">
            <Button className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
              Try the demo now
            </Button>
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Request a demo"
      subtitle="See CogSymb in action with a 15-min walkthrough."
      footer={<>Just want to look around? <Link to="/login" className="text-primary hover:underline">Try the live demo</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2"><Label>Full name</Label><Input required value={name} onChange={e => setName(e.target.value)} className="h-11" /></div>
        <div className="space-y-2"><Label>Work email</Label><Input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="h-11" /></div>
        <div className="space-y-2"><Label>Company</Label><Input required value={company} onChange={e => setCompany(e.target.value)} className="h-11" /></div>
        <div className="space-y-2"><Label>Units under management</Label><Input required value={units} onChange={e => setUnits(e.target.value)} className="h-11" placeholder="e.g. 250" /></div>
        <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</> : "Request demo"}
        </Button>
      </form>
    </AuthShell>
  );
}
