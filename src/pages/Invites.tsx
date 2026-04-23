import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InviteSlideOver } from "@/components/InviteSlideOver";
import { Avatar } from "@/components/Brand";
import { StatusBadge } from "@/components/StatusBadge";
import { Plus, Mail } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";

export default function Invites() {
  const { applicants } = useApp();
  const [open, setOpen] = useState(false);
  const pending = applicants.filter(a => a.status === "Pending" || a.status === "In Review");

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invites</h1>
          <p className="text-muted-foreground mt-1">{pending.length} active invite{pending.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setOpen(true)} className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-10">
          <Plus className="w-4 h-4 mr-1" /> New invite
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {pending.map(a => (
          <Link to={`/applicants/${a.id}`} key={a.id}>
            <Card className="p-5 bg-gradient-card border-border/60 hover:border-primary/40 transition-all hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={a.name} color={a.avatarColor} size={40} />
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{a.name}</div>
                    <div className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {a.email}
                    </div>
                  </div>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <div className="text-sm text-muted-foreground border-t border-border/40 pt-3 mt-3">
                <div className="flex justify-between"><span>Property</span><span className="text-foreground">{a.property}</span></div>
                <div className="flex justify-between mt-1"><span>Sent</span><span className="text-foreground">{formatDistanceToNow(new Date(a.submittedAt), { addSuffix: true })}</span></div>
              </div>
            </Card>
          </Link>
        ))}
        {pending.length === 0 && (
          <Card className="p-10 col-span-full text-center bg-gradient-card border-border/60">
            <Mail className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <div className="font-semibold">No pending invites</div>
            <div className="text-sm text-muted-foreground mt-1">Send your first invite to get started.</div>
          </Card>
        )}
      </div>

      <InviteSlideOver open={open} onOpenChange={setOpen} />
    </div>
  );
}
