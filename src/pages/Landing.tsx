import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Brand";
import { RentalScoreGauge } from "@/components/RentalScoreGauge";
import {
  ShieldCheck, Banknote, Home, ArrowRight, CheckCircle2, XCircle,
  Fingerprint, TrendingUp, Sparkles, Building2,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/40">
        <div className="container flex h-16 items-center justify-between">
          <Logo />
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#compare" className="hover:text-foreground transition-colors">Compare</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/request-demo">
              <Button size="sm" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                Request Demo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-glow pointer-events-none" />
        <div className="container relative pt-24 pb-32 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-6">
              <Sparkles className="w-3.5 h-3.5" /> The Rental Credit Score, reimagined
            </div>
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.05] tracking-tight">
              The rental score that <span className="text-gradient">actually predicts</span> payment.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              CogSymb combines biometric identity, verified income, and real rent history into one decisive score —
              so you can approve great tenants and stop losing money to defaults.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/request-demo">
                <Button size="lg" className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-12 px-7">
                  Request a demo <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-12 px-7 border-border hover:bg-muted">
                  Try the live demo
                </Button>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> SOC 2 Type II</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> Fair Housing compliant</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-primary" /> FCRA-aligned</div>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="absolute -inset-8 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <Card className="relative p-8 bg-gradient-card border-primary/20 shadow-elegant">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Applicant Report</div>
                  <div className="text-xl font-bold mt-1">Maya Patel</div>
                  <div className="text-xs text-muted-foreground">Harborview Lofts · Unit 412</div>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-semibold border border-primary/30">
                  Approved
                </div>
              </div>
              <div className="flex justify-center my-4">
                <RentalScoreGauge score={842} size={200} />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/50">
                {[
                  { label: "Income", value: "$11.8k", icon: Banknote },
                  { label: "Rent ratio", value: "27%", icon: TrendingUp },
                  { label: "History", value: "36 mo", icon: Home },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <s.icon className="w-4 h-4 text-primary mx-auto mb-1" />
                    <div className="text-sm font-semibold">{s.value}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/40 bg-card/30">
        <div className="container py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { v: "59M", l: "Credit-invisible adults in the U.S." },
            { v: "37%", l: "Reduction in default rates*" },
            { v: "<2 min", l: "Average screening completion" },
            { v: "900", l: "Predictive score range" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold text-gradient">{s.v}</div>
              <div className="text-xs text-muted-foreground mt-1.5">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section id="features" className="container py-24">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight">A complete financial picture, finally.</h2>
          <p className="mt-4 text-muted-foreground">Three pillars combine into one score that landlords can actually trust.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Fingerprint, title: "Biometric Identity", desc: "Multi-factor liveness + government ID match. Fraud-proof onboarding in under a minute.", color: "primary" },
            { icon: Banknote, title: "Verified Income", desc: "Direct payroll & bank connections — no manual pay stubs, no fake W-2s.", color: "secondary" },
            { icon: Home, title: "Real Rent History", desc: "Verified payment behavior from previous landlords — including credit-invisible applicants.", color: "primary" },
          ].map((f, i) => (
            <Card key={i} className="p-7 bg-gradient-card border-border/60 hover:border-primary/40 transition-all hover:-translate-y-1 group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-y border-border/40 bg-card/20">
        <div className="container py-24">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <h2 className="text-4xl font-bold tracking-tight">From invite to decision in minutes.</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { n: "01", t: "Send invite", d: "Email or SMS link to your applicant." },
              { n: "02", t: "Applicant verifies", d: "Biometric ID + payroll connection." },
              { n: "03", t: "We score", d: "Rental Credit Score from 0–900." },
              { n: "04", t: "You decide", d: "Approve, deny, or request more info." },
            ].map((s, i) => (
              <div key={i} className="relative">
                <div className="text-5xl font-bold text-primary/20 mb-2">{s.n}</div>
                <h3 className="text-lg font-semibold mb-1">{s.t}</h3>
                <p className="text-sm text-muted-foreground">{s.d}</p>
                {i < 3 && <ArrowRight className="hidden md:block absolute -right-3 top-3 w-5 h-5 text-primary/30" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="compare" className="container py-24">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold tracking-tight">Traditional credit reports vs CogSymb</h2>
          <p className="mt-4 text-muted-foreground">A credit score was never built to predict rent. Ours is.</p>
        </div>
        <Card className="overflow-hidden bg-gradient-card border-border/60">
          <div className="grid grid-cols-3 text-sm">
            <div className="p-5 font-semibold text-muted-foreground border-b border-border/50">Capability</div>
            <div className="p-5 font-semibold text-center border-b border-l border-border/50">Traditional credit</div>
            <div className="p-5 font-semibold text-center border-b border-l border-border/50 bg-primary/5 text-primary">CogSymb</div>
            {[
              ["Verified income", false, true],
              ["Real rent payment history", false, true],
              ["Biometric identity verification", false, true],
              ["Scores credit-invisible applicants", false, true],
              ["Predicts likelihood of paying rent", false, true],
              ["Available in <2 minutes", false, true],
            ].map(([cap, trad, cog], i) => (
              <div key={i} className="contents">
                <div className="p-5 border-b border-border/40">{cap as string}</div>
                <div className="p-5 border-b border-l border-border/40 text-center">
                  {trad ? <CheckCircle2 className="w-5 h-5 text-primary mx-auto" /> : <XCircle className="w-5 h-5 text-destructive/70 mx-auto" />}
                </div>
                <div className="p-5 border-b border-l border-border/40 text-center bg-primary/5">
                  {cog ? <CheckCircle2 className="w-5 h-5 text-primary mx-auto" /> : <XCircle className="w-5 h-5 text-destructive mx-auto" />}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Logo cloud */}
      <section className="container py-16 border-y border-border/40">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8">
          Trusted by property management leaders
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-60">
          {["Harborview PM", "Cedar Park Holdings", "Bayside Group", "Meridian Estates", "Sunset Realty", "Riverstone"].map(n => (
            <div key={n} className="flex items-center gap-2 text-base font-semibold text-muted-foreground">
              <Building2 className="w-4 h-4" /> {n}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="container py-24 max-w-3xl text-center">
        <ShieldCheck className="w-10 h-10 text-primary mx-auto mb-6" />
        <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed">
          "We approved 22% more applicants while cutting defaults nearly in half.
          The credit-invisible scoring alone changed our entire underwriting model."
        </blockquote>
        <div className="mt-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Sarah Lin</span> · Director of Leasing, Bayside Group
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="container pb-24">
        <Card className="p-12 bg-gradient-primary text-primary-foreground text-center shadow-glow border-0">
          <h2 className="text-4xl font-bold tracking-tight">Stop guessing. Start scoring.</h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">See CogSymb in action with a 15-minute demo tailored to your portfolio.</p>
          <div className="mt-7 flex flex-wrap gap-3 justify-center">
            <Link to="/request-demo">
              <Button size="lg" variant="secondary" className="h-12 px-7 bg-background text-foreground hover:bg-background/90">
                Request a demo
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="ghost" className="h-12 px-7 text-primary-foreground hover:bg-white/10">
                Try the live demo
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      <footer className="border-t border-border/40">
        <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span>© 2025 CogSymb, Inc.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Security</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
