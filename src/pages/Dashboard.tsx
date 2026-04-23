import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { KpiCard } from "@/components/KpiCard";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/Brand";
import { MiniGauge } from "@/components/RentalScoreGauge";
import { Users, CheckCircle2, Send, Gauge, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid } from "recharts";
import { screeningTrend, scoreDistribution } from "@/data/mockData";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { applicants, activity, currentUser } = useApp();

  const stats = useMemo(() => {
    const total = applicants.length;
    const approved = applicants.filter(a => a.status === "Approved").length;
    const pending = applicants.filter(a => a.status === "Pending" || a.status === "In Review").length;
    const avg = Math.round(applicants.reduce((s, a) => s + a.rentalScore, 0) / total);
    return { total, approved, pending, avg, approvalRate: Math.round((approved / total) * 100) };
  }, [applicants]);

  const riskAlerts = applicants
    .filter(a => a.rentalScore < 600 || (a.flags && a.flags.length > 0))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser.name.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what's happening across your portfolio today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Screenings" value={String(stats.total)} delta={12} icon={<Users className="w-4 h-4" />}
          spark={[28, 32, 30, 38, 42, 51, 47, 62, 70]} accent="primary" />
        <KpiCard label="Approval Rate" value={`${stats.approvalRate}%`} delta={5} icon={<CheckCircle2 className="w-4 h-4" />}
          spark={[68, 70, 65, 72, 74, 73, 75, 78, stats.approvalRate]} accent="success" />
        <KpiCard label="Pending Reviews" value={String(stats.pending)} delta={-8} icon={<Send className="w-4 h-4" />}
          spark={[12, 9, 11, 8, 10, 7, 9, 6, stats.pending]} accent="warning" />
        <KpiCard label="Avg. Rental Score" value={String(stats.avg)} delta={3} icon={<Gauge className="w-4 h-4" />}
          spark={[680, 692, 705, 712, 720, 715, 728, 735, stats.avg]} accent="secondary" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-gradient-card border-border/60">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold">Screenings over time</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Last 6 months</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={screeningTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="screenings" stroke="hsl(var(--primary))" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="approvals" stroke="hsl(var(--secondary))" fill="url(#g2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/60">
          <div className="mb-5">
            <h3 className="font-semibold">Score distribution</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Current applicant pool</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={scoreDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6 bg-gradient-card border-border/60">
          <h3 className="font-semibold mb-5">Recent activity</h3>
          <ul className="space-y-3">
            {activity.slice(0, 8).map(a => (
              <li key={a.id} className="flex items-start gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  a.type === "approved" ? "bg-primary" :
                  a.type === "denied" ? "bg-destructive" :
                  a.type === "invited" ? "bg-secondary" :
                  "bg-muted-foreground"
                }`} />
                <div className="flex-1">
                  <div>{a.message}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/60">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h3 className="font-semibold">Top risk alerts</h3>
          </div>
          <ul className="space-y-3">
            {riskAlerts.map(a => (
              <li key={a.id}>
                <Link to={`/applicants/${a.id}`} className="flex items-center gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar name={a.name} color={a.avatarColor} size={32} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{a.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{a.flags?.[0] ?? a.denialReason ?? "Low rental score"}</div>
                  </div>
                  <MiniGauge score={a.rentalScore} size={36} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
