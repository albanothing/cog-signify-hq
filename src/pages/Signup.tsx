import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useApp();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      signIn({
        name: name || "New User",
        email: email || "new@cogsymb.com",
        company: company || "Your Company",
        initials: (name || "NU").split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase(),
      });
      toast.success("Account created — welcome to CogSymb!");
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <AuthShell
      title="Create your CogSymb account"
      subtitle="Start screening tenants in minutes."
      footer={<>Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2"><Label>Full name</Label><Input required value={name} onChange={e => setName(e.target.value)} className="h-11" /></div>
        <div className="space-y-2"><Label>Work email</Label><Input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="h-11" /></div>
        <div className="space-y-2"><Label>Company</Label><Input required value={company} onChange={e => setCompany(e.target.value)} className="h-11" /></div>
        <div className="space-y-2"><Label>Password</Label><Input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="h-11" /></div>
        <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account…</> : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
