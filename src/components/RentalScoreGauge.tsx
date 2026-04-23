import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  score: number; // 0-900
  size?: number;
  strokeWidth?: number;
  showGrade?: boolean;
  className?: string;
  animate?: boolean;
}

function gradeFor(score: number): { label: string; color: string } {
  if (score >= 800) return { label: "Excellent", color: "hsl(var(--primary))" };
  if (score >= 700) return { label: "Strong", color: "hsl(var(--secondary))" };
  if (score >= 600) return { label: "Good", color: "hsl(var(--success))" };
  if (score >= 500) return { label: "Fair", color: "hsl(var(--warning))" };
  return { label: "High Risk", color: "hsl(var(--destructive))" };
}

export function RentalScoreGauge({ score, size = 220, strokeWidth = 14, showGrade = true, className, animate = true }: Props) {
  const max = 900;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius * 0.75; // 270deg arc
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score);
  const animFrame = useRef<number | null>(null);

  useEffect(() => {
    if (!animate) { setDisplayScore(score); return; }
    const start = performance.now();
    const from = displayScore;
    const duration = 1100;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(from + (score - from) * eased));
      if (t < 1) animFrame.current = requestAnimationFrame(step);
    };
    animFrame.current = requestAnimationFrame(step);
    return () => { if (animFrame.current) cancelAnimationFrame(animFrame.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [score, animate]);

  const pct = Math.min(1, Math.max(0, displayScore / max));
  const grade = gradeFor(displayScore);
  const dashOffset = circumference * (1 - pct);

  // 270deg arc starts at 135deg (bottom-left) and sweeps to 45deg (bottom-right)
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-[135deg]">
        <defs>
          <linearGradient id={`gauge-grad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
        />
        {/* Value */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke={`url(#gauge-grad-${size})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 80ms linear" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-xs uppercase tracking-widest text-muted-foreground">Rental Score</div>
        <div className="text-5xl font-bold tabular-nums leading-none mt-1" style={{ color: grade.color }}>
          {displayScore}
        </div>
        <div className="text-xs text-muted-foreground mt-1">/ {max}</div>
        {showGrade && (
          <div className="mt-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${grade.color}22`, color: grade.color }}>
            {grade.label}
          </div>
        )}
      </div>
    </div>
  );
}

export function MiniGauge({ score, size = 44 }: { score: number; size?: number }) {
  const max = 900;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius * 0.75;
  const pct = Math.min(1, Math.max(0, score / max));
  const grade = gradeFor(score);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-[135deg]">
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          stroke="hsl(var(--muted))" strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={`${circumference} ${2 * Math.PI * radius}`} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
          stroke={grade.color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
          strokeDashoffset={circumference * (1 - pct)} />
      </svg>
      <span className="absolute text-[11px] font-semibold tabular-nums" style={{ color: grade.color }}>{score}</span>
    </div>
  );
}
