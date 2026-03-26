import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { GoldSignal } from "../utils/signalEngines";
import SignalCard from "./SignalCard";

interface Props {
  signals: GoldSignal[];
  countdown: number;
}

export default function GoldScalperCard({ signals, countdown }: Props) {
  const [idx, setIdx] = useState(0);
  if (!signals.length) return null;
  const signal = signals[idx];

  return (
    <SignalCard
      number={2}
      title="HT Gold Scalper Pro"
      accentColor="#F2C14E"
      glowClass="glow-gold"
      signal={signal}
      countdown={countdown}
      extra={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIdx((p) => Math.max(0, p - 1))}
            disabled={idx === 0}
            className="p-1 rounded hover:bg-accent/50 disabled:opacity-30 transition-colors"
            data-ocid="gold.pagination_prev"
          >
            <ChevronLeft className="h-3 w-3 text-muted-foreground" />
          </button>
          <div className="flex gap-1.5 items-center">
            {signals.map((s, i) => (
              <button
                type="button"
                key={s.timeframe}
                onClick={() => setIdx(i)}
                className="rounded-md px-2 py-0.5 text-[10px] font-bold transition-all"
                style={{
                  background: i === idx ? "#F2C14E20" : "transparent",
                  color: i === idx ? "#F2C14E" : "#7E8A94",
                  border: `1px solid ${i === idx ? "#F2C14E50" : "transparent"}`,
                }}
                data-ocid={`gold.tab.${i + 1}`}
              >
                {s.timeframe}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIdx((p) => Math.min(signals.length - 1, p + 1))}
            disabled={idx === signals.length - 1}
            className="p-1 rounded hover:bg-accent/50 disabled:opacity-30 transition-colors"
            data-ocid="gold.pagination_next"
          >
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          </button>
        </div>
      }
    />
  );
}
