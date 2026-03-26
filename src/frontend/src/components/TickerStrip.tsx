import type { PriceData } from "../utils/priceEngine";

interface Props {
  prices: Record<string, PriceData>;
}

function TickerItem({ data }: { data: PriceData }) {
  const isPositive = data.changePercent >= 0;
  const decimals =
    data.symbol === "XAUUSD=X" ? 2 : data.symbol.includes("JPY") ? 3 : 5;
  return (
    <span className="flex items-center gap-2 px-6 shrink-0">
      <span className="text-xs font-semibold text-foreground">
        {data.label}
      </span>
      <span className="text-xs font-bold text-foreground">
        {data.price.toFixed(decimals)}
      </span>
      <span
        className={`text-xs font-medium ${isPositive ? "text-neon" : "text-sell"}`}
      >
        {isPositive ? "+" : ""}
        {data.changePercent.toFixed(3)}%
      </span>
      <span className="text-border">│</span>
    </span>
  );
}

export default function TickerStrip({ prices }: Props) {
  const items = Object.values(prices);
  if (items.length === 0) return null;

  const doubledItems = [...items, ...items];

  return (
    <div className="w-full bg-[oklch(0.14_0.015_220)] border-b border-border/40 overflow-hidden py-2">
      <div className="flex ticker-track">
        {doubledItems.map((d, i) => (
          <TickerItem key={`${d.symbol}-${i}`} data={d} />
        ))}
      </div>
    </div>
  );
}
