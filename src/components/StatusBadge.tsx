import { cn } from "@/lib/utils";
import type { ApplicantStatus } from "@/types";

const styles: Record<ApplicantStatus, string> = {
  Approved: "bg-primary/15 text-primary border-primary/30",
  Denied: "bg-destructive/15 text-destructive border-destructive/30",
  Pending: "bg-muted text-muted-foreground border-border",
  "In Review": "bg-warning/15 text-warning border-warning/30",
  "Credit-Invisible": "bg-secondary/15 text-secondary border-secondary/40",
};

export function StatusBadge({ status, className }: { status: ApplicantStatus; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap",
      styles[status],
      className
    )}>
      {status === "Approved" && <span className="w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />}
      {status === "Denied" && <span className="w-1.5 h-1.5 rounded-full bg-destructive mr-1.5" />}
      {status === "Pending" && <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mr-1.5" />}
      {status === "In Review" && <span className="w-1.5 h-1.5 rounded-full bg-warning mr-1.5 animate-pulse" />}
      {status === "Credit-Invisible" && <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-1.5" />}
      {status}
    </span>
  );
}
