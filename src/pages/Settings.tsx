import { useSearchParams } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/context/AppContext";
import { invoices, teammates } from "@/data/mockData";
import { Avatar } from "@/components/Brand";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download } from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") ?? "profile";
  const { settings, updateSettings, currentUser, updateUser } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account, billing, and screening criteria.</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => setParams({ tab: v })}>
        <TabsList className="bg-muted/40">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="criteria">Screening Criteria</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="p-6 bg-gradient-card border-border/60 max-w-2xl">
            <div className="flex items-center gap-4 mb-6">
              <Avatar name={currentUser.name} color="187 92% 45%" size={64} />
              <div>
                <Button variant="outline" size="sm">Change avatar</Button>
                <div className="text-xs text-muted-foreground mt-2">JPG, PNG up to 2 MB</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Full name</Label><Input value={currentUser.name} onChange={e => updateUser({ name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Email</Label><Input value={currentUser.email} onChange={e => updateUser({ email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Company</Label><Input value={currentUser.company} onChange={e => updateUser({ company: e.target.value })} /></div>
              <div className="space-y-2"><Label>Role</Label><Input value={currentUser.role} onChange={e => updateUser({ role: e.target.value })} /></div>
            </div>
            <div className="mt-6 flex gap-2">
              <Button onClick={() => toast.success("Profile saved")} className="bg-gradient-primary text-primary-foreground hover:opacity-90">Save changes</Button>
              <Button variant="outline" onClick={() => toast.info("Password reset link sent")}>Change password</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <Card className="p-6 bg-gradient-primary/10 border-primary/30">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Current plan</div>
                <div className="text-2xl font-bold">Pro</div>
                <div className="text-sm text-muted-foreground mt-1">$499 / month · billed monthly</div>
              </div>
              <Button variant="outline">Upgrade plan</Button>
            </div>
            <div className="mt-5 pt-5 border-t border-primary/20">
              <div className="flex items-center justify-between text-sm mb-2">
                <span>Screenings used this month</span>
                <span className="font-semibold">70 / 100</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary" style={{ width: "70%" }} />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/60">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Payment method</h3>
              <Button variant="outline" size="sm">Update</Button>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
              <CreditCard className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <div className="font-medium">Visa ending in 4242</div>
                <div className="text-xs text-muted-foreground">Expires 12/2027</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-card border-border/60">
            <h3 className="font-semibold mb-4">Invoices</h3>
            <Table>
              <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Date</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody>
                {invoices.map(i => (
                  <TableRow key={i.id}>
                    <TableCell className="font-medium">{i.id}</TableCell>
                    <TableCell>{i.date}</TableCell>
                    <TableCell>{i.amount}</TableCell>
                    <TableCell><span className="text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary">{i.status}</span></TableCell>
                    <TableCell><Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="mt-6">
          <Card className="p-6 bg-gradient-card border-border/60 max-w-2xl space-y-5">
            <Toggle label="Strict income verification" desc="Require direct payroll/bank connection — no manual pay stubs."
              checked={settings.strictIncomeVerification} onChange={v => updateSettings({ strictIncomeVerification: v })} />
            <Toggle label="Require biometric ID" desc="Multi-factor liveness + government ID match for every applicant."
              checked={settings.requireBiometricId} onChange={v => updateSettings({ requireBiometricId: v })} />
            <Toggle label="Auto-deny below threshold" desc="Automatically deny applicants whose Rental Score falls below the threshold."
              checked={settings.autoDenyBelowThreshold} onChange={v => updateSettings({ autoDenyBelowThreshold: v })} />
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Minimum Rental Score</Label>
                <span className="text-sm font-semibold text-primary tabular-nums">{settings.minRentalScore}</span>
              </div>
              <Slider min={300} max={900} step={10} value={[settings.minRentalScore]} onValueChange={([v]) => updateSettings({ minRentalScore: v })} />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5"><span>300</span><span>900</span></div>
            </div>
            <Button onClick={() => toast.success("Screening criteria saved")} className="bg-gradient-primary text-primary-foreground hover:opacity-90">Save criteria</Button>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card className="p-6 bg-gradient-card border-border/60 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Team members</h3>
              <Button size="sm" variant="outline">Invite teammate</Button>
            </div>
            <div className="space-y-2">
              {teammates.map(t => (
                <div key={t.email} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar name={t.name} color="187 92% 45%" size={36} />
                    <div>
                      <div className="font-medium text-sm">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.email}</div>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/15 text-secondary">{t.role}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card className="p-6 bg-gradient-card border-border/60 max-w-2xl space-y-5">
            <Toggle label="Email notifications" desc="Get an email when an applicant completes screening."
              checked={settings.notifyEmail} onChange={v => updateSettings({ notifyEmail: v })} />
            <Toggle label="SMS notifications" desc="Critical alerts via SMS."
              checked={settings.notifySms} onChange={v => updateSettings({ notifySms: v })} />
            <Toggle label="In-app notifications" desc="Show notifications in the bell menu."
              checked={settings.notifyInApp} onChange={v => updateSettings({ notifyInApp: v })} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="flex-1">
        <div className="font-medium text-sm">{label}</div>
        <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
