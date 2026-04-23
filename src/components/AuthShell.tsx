import { ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Brand";
import { ShieldCheck, Fingerprint, TrendingUp, Home } from "lucide-react";

const quotes = [
  { icon: Fingerprint, text: "Biometric ID stops fake applications before they cost you money.", who: "Identity Verification" },
  { icon: TrendingUp, text: "Verified income — no more doctored pay stubs.", who: "Real Income" },
  { icon: Home, text: "We score the applicants traditional credit can't see.", who: "Credit-Invisible Coverage" },
  { icon: ShieldCheck, text: "FCRA-aligned, fair-housing safe, SOC 2 Type II.", who: "Built for Compliance" },
];

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % quotes.length), 4500);
    return () => clearInterval(t);
  }, []);
  const Q = quotes[idx];
  const QIcon = Q.icon;

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Form side */}
      <div className="flex flex-col p-6 lg:p-10">
        <Link to="/"><Logo /></Link>
        <div className="flex-1 flex items-center justify-center py-10">
          <div className="w-full max-w-sm animate-fade-in">
            <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-2">{subtitle}</p>}
            <div className="mt-8">{children}</div>
            {footer && <div className="mt-6 text-sm text-muted-foreground text-center">{footer}</div>}
          </div>
        </div>
      </div>

      {/* Brand side */}
      <div className="hidden lg:flex relative overflow-hidden bg-card border-l border-border/50">
        <div className="absolute inset-0 bg-hero-glow" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-secondary/15 blur-3xl" />
        <div className="relative flex-1 flex flex-col justify-between p-12">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold">CogSymb</div>
          <div className="space-y-6 max-w-md animate-fade-in" key={idx}>
            <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary flex items-center justify-center">
              <QIcon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-semibold leading-snug tracking-tight">"{Q.text}"</p>
            <div className="text-sm text-muted-foreground">— {Q.who}</div>
          </div>
          <div className="flex gap-1.5">
            {quotes.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === idx ? "w-8 bg-primary" : "w-4 bg-muted"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
