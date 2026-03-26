import { MoreHorizontal } from "lucide-react";
import type { Signal } from "../utils/signalEngines";
import MetricTile from "./MetricTile";
import Sparkline from "./Sparkline";

interface Props {
  number: number;
  title: string;
  accentColor: string;
  glowClass: string;
  signal: Signal;
  countdown: number;
  extra?: React.ReactNode;
}

export default function SignalCard({
  number,
  title,
  accentColor,
  glowClass,
  signal,
  countdown,
  extra,
}: Props) {
  const isBuy = signal.direction === "BUY";
  const directionColor = isBuy ? "#2FEA7B" : "#FF5B6B";
  const sparkColor = isBuy ? "#2FEA7B" : "#FF5B6B";
  const decimals = signal.pair.includes("XAU")
    ? 2
    : signal.pair.includes("JPY")
      ? 3
      : 5;

  return (
    <div
      className={`relative rounded-2xl border p-5 flex flex-col gap-4 bg-card shadow-card ${glowClass} transition-all duration-500`}
      style={{ borderColor: `${accentColor}50` }}
      data-ocid={`signal_${number}.card`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            <span style={{ color: accentColor }} className="mr-1">
              {number}.
            </span>
            {title}
          </h3>
          <span
            className="inline-flex items-center gap-1.5 mt-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{
              background: `${accentColor}15`,
              color: accentColor,
              border: `1px solid ${accentColor}40`,
            }}
          >
            <span
              className="h-1.5 w-1.5 rounded-full pulse-active animate-pulse"
              style={{ background: accentColor }}
            />
            Active Signal
          </span>
        </div>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
          data-ocid={`signal_${number}.open_modal_button`}
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div
            className="text-3xl font-extrabold leading-none"
            style={{ color: directionColor }}
          >
            {signal.direction}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {signal.timestamp}
          </div>
        </div>
        <Sparkline
          data={signal.sparkline}
          color={sparkColor}
          width={90}
          height={36}
        />
        <div className="text-right">
          <div className="text-sm font-bold text-foreground">{signal.pair}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Forex</div>
        </div>
      </div>

      {extra}

      <div className="flex gap-2">
        <MetricTile
          label="Entry"
          value={signal.entry.toFixed(decimals)}
          accentColor={accentColor}
        />
        <MetricTile
          label="Target"
          value={signal.target.toFixed(decimals)}
          accentColor="#2FEA7B"
          isUp={isBuy}
        />
        <MetricTile
          label="Stop Loss"
          value={signal.stopLoss.toFixed(decimals)}
          accentColor="#FF5B6B"
          isUp={!isBuy}
        />
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
          className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-colors"
          style={{
            borderColor: `${accentColor}30`,
            background: `${accentColor}08`,
          }}
          data-ocid={`signal_${number}.secondary_button`}
        >
          VIEW DETAIL
        </button>
      </div>
    </div>
  );
}
