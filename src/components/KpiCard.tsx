import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  delta?: number; // percent
  icon?: ReactNode;
  spark?: number[];
  accent?: "primary" | "secondary" | "success" | "warning";
}

export function KpiCard({ label, value, delta, icon, spark, accent = "primary" }: Props) {
  const accentColor = {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    success: "hsl(var(--success))",
    warning: "hsl(var(--warning))",
  }[accent];

  return (
    <Card className="p-5 bg-gradient-card border-border/60 hover:border-primary/40 transition-colors group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-[0.07] group-hover:opacity-[0.12] transition-opacity blur-2xl"
        style={{ background: accentColor }} />
      <div className="flex items-start justify-between mb-3 relative">
        <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</div>
        {icon && (
          <div className="p-2 rounded-lg" style={{ background: `${accentColor}1a`, color: accentColor }}>
            {icon}
          </div>
        )}
      </div>
      <div className="flex items-end gap-3 relative">
        <div className="text-3xl font-bold tracking-tight tabular-nums">{value}</div>
        {typeof delta === "number" && (
          <div className={cn(
            "flex items-center gap-0.5 text-xs font-semibold pb-1.5",
            delta >= 0 ? "text-success" : "text-destructive"
          )}>
            {delta >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {Math.abs(delta)}%
          </div>
        )}
      </div>
      {spark && <Sparkline values={spark} color={accentColor} />}
    </Card>
  );
}

function Sparkline({ values, color }: { values: number[]; color: string }) {
  const w = 120, h = 32;
  const max = Math.max(...values), min = Math.min(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={w} height={h} className="mt-3 opacity-80">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
