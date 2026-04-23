import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("alex@harborviewpm.com");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  const { signIn } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      signIn({ email });
      toast.success("Welcome back, Alex 👋");
      navigate("/dashboard");
    }, 1100);
  };

  return (
    <AuthShell
      title="Sign in to CogSymb"
      subtitle="Use any email and password — this is a live demo."
      footer={<>Don't have an account? <Link to="/signup" className="text-primary hover:underline">Create one</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Work email</Label>
          <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="h-11" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
          </div>
          <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="h-11" />
        </div>
        <Button type="submit" disabled={loading} className="w-full h-11 bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in…</> : "Sign in"}
        </Button>
        <Button type="button" variant="outline" className="w-full h-11" onClick={() => { setEmail("demo@cogsymb.com"); setPassword("demo1234"); }}>
          Use demo credentials
        </Button>
      </form>
    </AuthShell>
  );
}
