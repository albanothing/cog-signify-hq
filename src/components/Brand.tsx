import { cn } from "@/lib/utils";

export function Avatar({ name, color, size = 36 }: { name: string; color: string; size?: number }) {
  const initials = name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center font-semibold text-white shrink-0"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, hsl(${color}), hsl(${color} / 0.7))`,
        fontSize: size * 0.38,
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}

export function Logo({ className, size = "default" }: { className?: string; size?: "default" | "sm" }) {
  const dim = size === "sm" ? "w-7 h-7" : "w-9 h-9";
  const text = size === "sm" ? "text-base" : "text-lg";
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(dim, "relative rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow")}>
        <svg viewBox="0 0 24 24" fill="none" className="w-1/2 h-1/2 text-primary-foreground">
          <path d="M12 2L4 6v6c0 5 3.5 9.5 8 10 4.5-.5 8-5 8-10V6l-8-4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className={cn("font-bold tracking-tight", text)}>
        Cog<span className="text-primary">Symb</span>
      </span>
    </div>
  );
}
