import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { properties } from "@/data/mockData";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Avatar } from "@/components/Brand";
import { MiniGauge } from "@/components/RentalScoreGauge";
import { CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Filter, Plus, Search } from "lucide-react";
import { InviteSlideOver } from "@/components/InviteSlideOver";
import { format } from "date-fns";
import type { ApplicantStatus } from "@/types";

type SortKey = "name" | "rentalScore" | "submittedAt" | "status";

export default function Applicants() {
  const { applicants } = useApp();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicantStatus | "all">("all");
  const [propFilter, setPropFilter] = useState<string>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "submittedAt", dir: "desc" });
  const [page, setPage] = useState(1);
  const [inviteOpen, setInviteOpen] = useState(false);
  const pageSize = 8;

  const filtered = useMemo(() => {
    let rows = applicants.filter(a => {
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (propFilter !== "all" && a.property !== propFilter) return false;
      if (q) {
        const s = q.toLowerCase();
        if (!a.name.toLowerCase().includes(s) && !a.email.toLowerCase().includes(s) && !a.property.toLowerCase().includes(s)) return false;
      }
      return true;
    });
    rows = [...rows].sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      switch (sort.key) {
        case "name": return a.name.localeCompare(b.name) * dir;
        case "rentalScore": return (a.rentalScore - b.rentalScore) * dir;
        case "submittedAt": return (new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime()) * dir;
        case "status": return a.status.localeCompare(b.status) * dir;
      }
    });
    return rows;
  }, [applicants, q, statusFilter, propFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (key: SortKey) => {
    setSort(s => s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sort.key !== k ? <ChevronDown className="w-3 h-3 opacity-30" /> :
    sort.dir === "asc" ? <ChevronUp className="w-3 h-3 text-primary" /> : <ChevronDown className="w-3 h-3 text-primary" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Applicants</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} applicant{filtered.length !== 1 ? "s" : ""} · click any row to view the full report</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-10">
          <Plus className="w-4 h-4 mr-1" /> Invite applicant
        </Button>
      </div>

      <Card className="p-4 bg-gradient-card border-border/60">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search name, email, property…" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} className="pl-9 bg-background/50" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v as any); setPage(1); }}>
              <SelectTrigger className="w-[150px] bg-background/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Denied">Denied</SelectItem>
                <SelectItem value="Credit-Invisible">Credit-Invisible</SelectItem>
              </SelectContent>
            </Select>
            <Select value={propFilter} onValueChange={(v) => { setPropFilter(v); setPage(1); }}>
              <SelectTrigger className="w-[200px] bg-background/50"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All properties</SelectItem>
                {properties.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      <Card className="bg-gradient-card border-border/60 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border/60">
              <TableHead><button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-foreground">Applicant <SortIcon k="name" /></button></TableHead>
              <TableHead>Property</TableHead>
              <TableHead><button onClick={() => toggleSort("rentalScore")} className="flex items-center gap-1 hover:text-foreground">Rental Score <SortIcon k="rentalScore" /></button></TableHead>
              <TableHead className="text-center">Income</TableHead>
              <TableHead><button onClick={() => toggleSort("status")} className="flex items-center gap-1 hover:text-foreground">Status <SortIcon k="status" /></button></TableHead>
              <TableHead><button onClick={() => toggleSort("submittedAt")} className="flex items-center gap-1 hover:text-foreground">Submitted <SortIcon k="submittedAt" /></button></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map(a => (
              <TableRow key={a.id}
                onClick={() => navigate(`/applicants/${a.id}`)}
                className="cursor-pointer border-border/40">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar name={a.name} color={a.avatarColor} size={36} />
                    <div className="min-w-0">
                      <div className="font-medium truncate">{a.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{a.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{a.property}</div>
                  <div className="text-xs text-muted-foreground">{a.unit}</div>
                </TableCell>
                <TableCell><MiniGauge score={a.rentalScore} /></TableCell>
                <TableCell className="text-center">
                  {a.income === "verified" ? <CheckCircle2 className="w-4 h-4 text-primary mx-auto" /> :
                   a.income === "warning" ? <span className="text-warning text-xs">!</span> :
                   a.income === "pending" ? <span className="text-muted-foreground text-xs">…</span> :
                   <span className="text-destructive text-xs">✗</span>}
                </TableCell>
                <TableCell><StatusBadge status={a.status} /></TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(a.submittedAt), "MMM d")}</TableCell>
              </TableRow>
            ))}
            {pageRows.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No applicants match your filters.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-4 border-t border-border/40 text-sm text-muted-foreground">
          <div>Page {page} of {totalPages}</div>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <InviteSlideOver open={inviteOpen} onOpenChange={setInviteOpen} />
    </div>
  );
}
