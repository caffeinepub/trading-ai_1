import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { PriceData } from "../utils/priceEngine";
import Sparkline from "./Sparkline";

interface Props {
  prices: Record<string, PriceData>;
}

const ACCENT_COLORS = [
  "#2FEA7B",
  "#F2C14E",
  "#3AA7FF",
  "#B56BFF",
  "#FF5B6B",
  "#2FEA7B",
];

export default function MarketOverview({ prices }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: "smooth" });
    }
  };

  const items = Object.values(prices);

  return (
    <section className="mt-16" data-ocid="market_overview.section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Market Overview
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scroll(-1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            data-ocid="market_overview.pagination_prev"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-foreground hover:border-border transition-colors"
            data-ocid="market_overview.pagination_next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "none" }}
        data-ocid="market_overview.list"
      >
        {items.map((pd, i) => {
          const isPos = pd.changePercent >= 0;
          const color = ACCENT_COLORS[i % ACCENT_COLORS.length];
          const decimals =
            pd.symbol === "XAUUSD=X" ? 2 : pd.symbol.includes("JPY") ? 3 : 5;
          return (
            <div
              key={pd.symbol}
              className="flex-shrink-0 w-44 rounded-xl border p-4 bg-card transition-all"
              style={{ borderColor: `${color}35` }}
              data-ocid={`market_overview.item.${i + 1}`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-foreground">
                  {pd.label}
                </span>
                <span
                  className="text-[10px] font-semibold rounded-full px-2 py-0.5"
                  style={{ background: `${color}15`, color }}
                >
                  LIVE
                </span>
              </div>
              <div className="mb-2">
                <Sparkline
                  data={pd.ohlcv.slice(-12).map((c) => c.close)}
                  color={isPos ? "#2FEA7B" : "#FF5B6B"}
                  width={120}
                  height={30}
                />
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-foreground">
                  {pd.price.toFixed(decimals)}
                </span>
                <span
                  className={`text-xs font-semibold ${isPos ? "text-neon" : "text-sell"}`}
                >
                  {isPos ? "+" : ""}
                  {pd.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
