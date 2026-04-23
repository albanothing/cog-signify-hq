import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, XCircle, Clock } from "lucide-react";
import type { CheckStatus } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  status: CheckStatus;
  metric?: string;
  description?: string;
  details?: { label: string; value: string }[];
  icon?: ReactNode;
}

const statusMeta: Record<CheckStatus, { icon: typeof CheckCircle2; color: string; label: string }> = {
  verified: { icon: CheckCircle2, color: "hsl(var(--primary))", label: "Verified" },
  warning: { icon: AlertTriangle, color: "hsl(var(--warning))", label: "Caution" },
  failed: { icon: XCircle, color: "hsl(var(--destructive))", label: "Failed" },
  pending: { icon: Clock, color: "hsl(var(--muted-foreground))", label: "Pending" },
};

export function InfoBox({ title, status, metric, description, details, icon }: Props) {
  const meta = statusMeta[status];
  const Icon = meta.icon;
  return (
    <Card className="p-5 bg-gradient-card border-border/60 hover:border-primary/30 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {icon && <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>}
          <div className="font-semibold text-sm">{title}</div>
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full")}
          style={{ background: `${meta.color}1a`, color: meta.color }}>
          <Icon className="w-3.5 h-3.5" /> {meta.label}
        </div>
      </div>
      {metric && <div className="text-2xl font-bold tabular-nums">{metric}</div>}
      {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      {details && (
        <div className="mt-3 pt-3 border-t border-border/60 space-y-1.5">
          {details.map((d, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{d.label}</span>
              <span className="font-medium">{d.value}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
