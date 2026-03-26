import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import type { AMDSignal } from "../utils/signalEngines";
import Sparkline from "./Sparkline";

interface Props {
  signals: AMDSignal[];
  countdown: number;
}

const PHASE_COLORS: Record<string, string> = {
  ACCUMULATION: "#3AA7FF",
  MANIPULATION: "#F2C14E",
  DISTRIBUTION: "#FF5B6B",
};

export default function AMDCard({ signals, countdown }: Props) {
  const [idx, setIdx] = useState(0);
  if (!signals.length) return null;
  const signal = signals[idx];
  const accentColor = "#3AA7FF";
  const phaseColor = PHASE_COLORS[signal.phase] || accentColor;
  const isBuy = signal.direction === "BUY";
  const decimals = signal.pair.includes("JPY") ? 3 : 5;

  return (
    <div
      className="relative rounded-2xl border p-5 flex flex-col gap-4 bg-card shadow-card glow-cyan transition-all duration-500"
      style={{ borderColor: `${accentColor}50` }}
      data-ocid="amd.card"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            <span style={{ color: accentColor }} className="mr-1">
              3.
            </span>
            AMD Signals
          </h3>
          <span
            className="inline-flex items-center gap-1.5 mt-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{
              background: `${phaseColor}15`,
              color: phaseColor,
              border: `1px solid ${phaseColor}40`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full animate-pulse"
              style={{ background: phaseColor }}
            />
            {signal.phase}
          </span>
        </div>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          data-ocid="amd.open_modal_button"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div
            className="text-3xl font-extrabold leading-none"
            style={{ color: isBuy ? "#2FEA7B" : "#FF5B6B" }}
          >
            {signal.direction}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {signal.session}
          </div>
        </div>
        <Sparkline
          data={signal.sparkline}
          color={isBuy ? "#2FEA7B" : "#FF5B6B"}
          width={90}
          height={36}
        />
        <div className="text-right">
          <div className="text-sm font-bold text-foreground">{signal.pair}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {signal.session}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIdx((p) => Math.max(0, p - 1))}
          disabled={idx === 0}
          className="p-1 rounded hover:bg-accent/50 disabled:opacity-30"
          data-ocid="amd.pagination_prev"
        >
          <ChevronLeft className="h-3 w-3 text-muted-foreground" />
        </button>
        <div className="flex gap-1">
          {signals.map((s, i) => (
            <button
              type="button"
              key={s.pair}
              onClick={() => setIdx(i)}
              className="text-[10px] font-semibold rounded px-2 py-0.5 transition-all"
              style={{
                background: i === idx ? `${accentColor}20` : "transparent",
                color: i === idx ? accentColor : "#7E8A94",
                border: `1px solid ${i === idx ? `${accentColor}50` : "transparent"}`,
              }}
              data-ocid={`amd.tab.${i + 1}`}
            >
              {s.pair}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIdx((p) => Math.min(signals.length - 1, p + 1))}
          disabled={idx === signals.length - 1}
          className="p-1 rounded hover:bg-accent/50 disabled:opacity-30"
          data-ocid="amd.pagination_next"
        >
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        </button>
      </div>

      <div className="flex gap-2">
        <div
          className="flex-1 rounded-xl border p-3"
          style={{
            background: `${accentColor}0A`,
            borderColor: `${accentColor}30`,
          }}
        >
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Entry Zone
          </div>
          <div className="text-xs font-bold text-foreground">
            {signal.entryZone[0].toFixed(decimals)} –{" "}
            {signal.entryZone[1].toFixed(decimals)}
          </div>
        </div>
        <div
          className="flex-1 rounded-xl border p-3"
          style={{ background: "#2FEA7B0A", borderColor: "#2FEA7B30" }}
        >
          <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
            Target Zone
          </div>
          <div className="text-xs font-bold text-foreground">
            {signal.targetZone[0].toFixed(decimals)} –{" "}
            {signal.targetZone[1].toFixed(decimals)}
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">Confidence</span>
          <span className="font-semibold" style={{ color: accentColor }}>
            {signal.confidence}%
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-accent/40 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${signal.confidence}%`,
              background: `linear-gradient(90deg, ${accentColor}80, ${accentColor})`,
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground">
          Refresh in{" "}
          <span className="font-semibold text-foreground">{countdown}s</span>
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase"
          style={{
            background: "#2FEA7B15",
            color: "#2FEA7B",
            border: "1px solid #2FEA7B40",
          }}
        >
          ACTIVE
        </span>
        <button
          type="button"
          className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:text-foreground transition-colors"
          style={{
            borderColor: `${accentColor}30`,
            background: `${accentColor}08`,
          }}
          data-ocid="amd.secondary_button"
        >
          VIEW DETAIL
        </button>
      </div>
    </div>
  );
}
