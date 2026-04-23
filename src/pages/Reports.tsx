import { useApp } from "@/context/AppContext";
import { Card } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from "recharts";
import { properties } from "@/data/mockData";

export default function Reports() {
  const { applicants } = useApp();

  const byProperty = properties.map(p => {
    const list = applicants.filter(a => a.property === p);
    return { property: p, total: list.length, approved: list.filter(a => a.status === "Approved").length };
  });

  const statusBreakdown = [
    { name: "Approved", value: applicants.filter(a => a.status === "Approved").length, color: "hsl(var(--primary))" },
    { name: "Pending", value: applicants.filter(a => a.status === "Pending").length, color: "hsl(var(--muted-foreground))" },
    { name: "In Review", value: applicants.filter(a => a.status === "In Review").length, color: "hsl(var(--warning))" },
    { name: "Denied", value: applicants.filter(a => a.status === "Denied").length, color: "hsl(var(--destructive))" },
    { name: "Credit-Invisible", value: applicants.filter(a => a.status === "Credit-Invisible").length, color: "hsl(var(--secondary))" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground mt-1">Portfolio-wide insights from your applicant pool.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-card border-border/60">
          <h3 className="font-semibold mb-1">Screenings by property</h3>
          <p className="text-xs text-muted-foreground mb-5">Total applications and approvals per property</p>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={byProperty} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="property" stroke="hsl(var(--muted-foreground))" fontSize={10} tickLine={false} axisLine={false} interval={0} angle={-15} textAnchor="end" height={70} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
                <Bar dataKey="approved" fill="hsl(var(--secondary))" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card border-border/60">
          <h3 className="font-semibold mb-1">Status breakdown</h3>
          <p className="text-xs text-muted-foreground mb-5">Distribution across all applicants</p>
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={statusBreakdown} dataKey="value" nameKey="name" outerRadius={90} innerRadius={50}>
                  {statusBreakdown.map((s, i) => <Cell key={i} fill={s.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
