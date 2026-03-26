import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Signal } from "../utils/signalEngines";
import SignalCard from "./SignalCard";

interface Props {
  signals: Signal[];
  countdown: number;
}

export default function GainzAlgoCard({ signals, countdown }: Props) {
  const [idx, setIdx] = useState(0);
  if (!signals.length) return null;
  const signal = signals[idx];

  return (
    <SignalCard
      number={1}
      title="GainzAlgo V2 Alpha"
      accentColor="#2FEA7B"
      glowClass="glow-green"
      signal={signal}
      countdown={countdown}
      extra={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIdx((p) => Math.max(0, p - 1))}
            disabled={idx === 0}
            className="p-1 rounded hover:bg-accent/50 disabled:opacity-30 transition-colors"
            data-ocid="gainz.pagination_prev"
          >
            <ChevronLeft className="h-3 w-3 text-muted-foreground" />
          </button>
          <div className="flex gap-1">
            {signals.map((s, i) => (
              <button
                type="button"
                key={s.pair}
                onClick={() => setIdx(i)}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === idx ? "16px" : "6px",
                  background: i === idx ? "#2FEA7B" : "#2FEA7B40",
                }}
                data-ocid={`gainz.tab.${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIdx((p) => Math.min(signals.length - 1, p + 1))}
            disabled={idx === signals.length - 1}
            className="p-1 rounded hover:bg-accent/50 disabled:opacity-30 transition-colors"
            data-ocid="gainz.pagination_next"
          >
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </button>
          <span className="text-xs text-muted-foreground ml-1">
            {signal.pair}
          </span>
        </div>
      }
    />
  );
}
