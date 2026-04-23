import { Outlet, useNavigate, NavLink as RRNavLink } from "react-router-dom";
import { LayoutDashboard, Users, Send, FileText, Settings as SettingsIcon, Search, Bell, LogOut, User, CreditCard, Menu, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useApp } from "@/context/AppContext";
import { Logo, Avatar } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/applicants", label: "Applicants", icon: Users },
  { to: "/invites", label: "Invites", icon: Send },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export default function AppLayout() {
  const { currentUser, notifications, signOut, markNotificationsRead } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unread = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const handleSignOut = () => {
    signOut();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
          <RRNavLink to="/dashboard" onClick={() => setMobileOpen(false)}>
            <Logo />
          </RRNavLink>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <RRNavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </RRNavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="rounded-lg bg-gradient-primary/10 p-3 border border-primary/20">
            <div className="text-xs font-semibold text-primary mb-1">Pro Plan</div>
            <div className="text-xs text-muted-foreground">70 / 100 screenings used</div>
            <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-gradient-primary" style={{ width: "70%" }} />
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center px-4 lg:px-6 gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search applicants, properties, reports..." className="pl-9 bg-muted/40 border-border/60 h-9" />
          </div>
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu onOpenChange={(open) => { if (open && unread > 0) setTimeout(() => markNotificationsRead(), 1500); }}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  {unread > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-background animate-pulse" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 max-h-[480px] overflow-auto">
                <DropdownMenuLabel className="flex items-center justify-between">
                  Notifications
                  {unread > 0 && <span className="text-xs text-primary font-normal">{unread} new</span>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.slice(0, 8).map(n => (
                  <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 py-2.5">
                    <div className="flex items-center gap-2 w-full">
                      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", n.read ? "bg-muted-foreground/40" : "bg-primary")} />
                      <span className="font-medium text-sm flex-1">{n.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground pl-3.5">{n.description}</span>
                    <span className="text-[10px] text-muted-foreground pl-3.5 mt-0.5">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full hover:bg-muted/60 transition-colors">
                  <Avatar name={currentUser.name} color="187 92% 45%" size={30} />
                  <div className="hidden md:block text-left">
                    <div className="text-xs font-semibold leading-tight">{currentUser.name}</div>
                    <div className="text-[10px] text-muted-foreground leading-tight">{currentUser.role}</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-semibold">{currentUser.name}</div>
                  <div className="text-xs text-muted-foreground font-normal">{currentUser.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings?tab=billing")}>
                  <CreditCard className="w-4 h-4 mr-2" /> Billing
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 animate-fade-in">
          <Outlet />
        </main>
      </div>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />}
    </div>
  );
}
