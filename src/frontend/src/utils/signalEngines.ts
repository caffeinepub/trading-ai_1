import type { OHLCV, PriceData } from "./priceEngine";

export type Direction = "BUY" | "SELL";

export interface Signal {
  pair: string;
  direction: Direction;
  entry: number;
  target: number;
  stopLoss: number;
  confidence: number;
  timestamp: string;
  sparkline: number[];
}

export interface GoldSignal extends Signal {
  timeframe: string;
  atr: number;
}

export interface AMDSignal {
  phase: "ACCUMULATION" | "MANIPULATION" | "DISTRIBUTION";
  session: string;
  direction: Direction;
  entryZone: [number, number];
  targetZone: [number, number];
  pair: string;
  confidence: number;
  timestamp: string;
  sparkline: number[];
}

export interface SMCSignal {
  pair: string;
  direction: Direction;
  type: "BOS" | "CHoCH" | "ORDER_BLOCK" | "FVG";
  label: string;
  entry: number;
  target: number;
  stopLoss: number;
  liquidity: number;
  confidence: number;
  timestamp: string;
  sparkline: number[];
}

function ema(data: number[], period: number): number[] {
  const k = 2 / (period + 1);
  const result: number[] = [data[0]];
  for (let i = 1; i < data.length; i++) {
    result.push(data[i] * k + result[i - 1] * (1 - k));
  }
  return result;
}

function rsi(closes: number[], period = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const rs = gains / (losses || 0.0001);
  return 100 - 100 / (1 + rs);
}

function atr(candles: OHLCV[], period = 14): number {
  const trs: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const tr = Math.max(
      candles[i].high - candles[i].low,
      Math.abs(candles[i].high - candles[i - 1].close),
      Math.abs(candles[i].low - candles[i - 1].close),
    );
    trs.push(tr);
  }
  const recent = trs.slice(-period);
  return recent.reduce((a, b) => a + b, 0) / recent.length;
}

function sparklineFrom(candles: OHLCV[], count = 12): number[] {
  return candles.slice(-count).map((c) => c.close);
}

function nowStr(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function fmt(val: number, symbol: string): number {
  if (symbol.includes("XAU")) return +val.toFixed(2);
  if (symbol.includes("JPY")) return +val.toFixed(3);
  return +val.toFixed(5);
}

export function generateGainzAlgoSignals(
  prices: Record<string, PriceData>,
): Signal[] {
  const pairs = ["EURUSD=X", "GBPUSD=X", "USDJPY=X", "XAUUSD=X"];
  return pairs
    .map((sym) => {
      const pd = prices[sym];
      if (!pd) return null;
      const closes = pd.ohlcv.map((c) => c.close);
      const ema9 = ema(closes, 9);
      const ema21 = ema(closes, 21);
      const lastEma9 = ema9[ema9.length - 1];
      const lastEma21 = ema21[ema21.length - 1];
      const prevEma9 = ema9[ema9.length - 2];
      const prevEma21 = ema21[ema21.length - 2];
      const rsiVal = rsi(closes);
      const atrVal = atr(pd.ohlcv);

      let direction: Direction = "BUY";
      let confidence = 65;

      const crossed = lastEma9 > lastEma21 && prevEma9 <= prevEma21;
      const crossedDown = lastEma9 < lastEma21 && prevEma9 >= prevEma21;

      if (crossed || lastEma9 > lastEma21) {
        direction = "BUY";
        confidence = 70 + (rsiVal < 60 ? 10 : 0) + (crossed ? 8 : 0);
      } else if (crossedDown || lastEma9 < lastEma21) {
        direction = "SELL";
        confidence = 70 + (rsiVal > 40 ? 10 : 0) + (crossedDown ? 8 : 0);
      }
      confidence = Math.min(96, confidence);

      const entry = pd.price;
      const pip = atrVal * 1.5;
      const target = fmt(
        direction === "BUY" ? entry + pip * 2 : entry - pip * 2,
        sym,
      );
      const stopLoss = fmt(
        direction === "BUY" ? entry - pip : entry + pip,
        sym,
      );

      return {
        pair: pd.label,
        direction,
        entry: fmt(entry, sym),
        target,
        stopLoss,
        confidence,
        timestamp: nowStr(),
        sparkline: sparklineFrom(pd.ohlcv),
      } as Signal;
    })
    .filter(Boolean) as Signal[];
}

export function generateGoldScalperSignals(
  prices: Record<string, PriceData>,
): GoldSignal[] {
  const pd = prices["XAUUSD=X"];
  if (!pd) return [];
  const timeframes = ["M15", "H1", "H4"];
  const atrVal = atr(pd.ohlcv);

  return timeframes.map((tf, i): GoldSignal => {
    const haClose =
      pd.ohlcv
        .slice(-5 - i * 3)
        .reduce((s, c) => s + (c.open + c.high + c.low + c.close) / 4, 0) /
      (5 + i * 3);
    const haOpen =
      (pd.ohlcv[pd.ohlcv.length - 2 - i].open +
        pd.ohlcv[pd.ohlcv.length - 2 - i].close) /
      2;
    const isBullish = haClose > haOpen;

    const recent5 = pd.ohlcv.slice(-5);
    const pivotH = Math.max(...recent5.map((c) => c.high));
    const pivotL = Math.min(...recent5.map((c) => c.low));
    const direction: Direction =
      isBullish && pd.price > (pivotH + pivotL) / 2 ? "BUY" : "SELL";

    const multiplier = tf === "M15" ? 1 : tf === "H1" ? 2 : 3.5;
    const entry = pd.price + (Math.random() - 0.5) * atrVal * 0.3;
    const tp =
      direction === "BUY"
        ? entry + atrVal * multiplier * 1.5
        : entry - atrVal * multiplier * 1.5;
    const sl =
      direction === "BUY"
        ? entry - atrVal * multiplier
        : entry + atrVal * multiplier;
    const confidence = 75 + Math.floor(Math.random() * 15);

    return {
      pair: `XAU/USD (${tf})`,
      direction,
      entry: +entry.toFixed(2),
      target: +tp.toFixed(2),
      stopLoss: +sl.toFixed(2),
      confidence,
      timestamp: nowStr(),
      sparkline: sparklineFrom(pd.ohlcv, 12),
      timeframe: tf,
      atr: +atrVal.toFixed(2),
    };
  });
}

function getCurrentSession(): { phase: AMDSignal["phase"]; session: string } {
  const hour = new Date().getUTCHours();
  if (hour >= 0 && hour < 7)
    return { phase: "ACCUMULATION", session: "Asia Session" };
  if (hour >= 7 && hour < 13)
    return { phase: "MANIPULATION", session: "London Open" };
  return { phase: "DISTRIBUTION", session: "New York Session" };
}

export function generateAMDSignals(
  prices: Record<string, PriceData>,
): AMDSignal[] {
  const pairs = ["EURUSD=X", "GBPUSD=X", "GBPJPY=X"];
  const { phase, session } = getCurrentSession();

  return pairs
    .map((sym): AMDSignal => {
      const pd = prices[sym];
      if (!pd) return null as any;
      const atrVal = atr(pd.ohlcv);
      const direction: Direction =
        phase === "ACCUMULATION"
          ? pd.changePercent >= 0
            ? "BUY"
            : "SELL"
          : phase === "MANIPULATION"
            ? pd.changePercent < 0
              ? "BUY"
              : "SELL"
            : pd.price > pd.ohlcv[pd.ohlcv.length - 10].close
              ? "SELL"
              : "BUY";

      const entry = pd.price;
      const spread = atrVal * 0.5;
      const entryZone: [number, number] = [
        fmt(entry - spread, sym),
        fmt(entry + spread, sym),
      ];
      const targetOffset =
        atrVal *
        (phase === "ACCUMULATION" ? 1 : phase === "MANIPULATION" ? 2 : 1.5);
      const targetZone: [number, number] =
        direction === "BUY"
          ? [
              fmt(entry + targetOffset, sym),
              fmt(entry + targetOffset * 1.3, sym),
            ]
          : [
              fmt(entry - targetOffset * 1.3, sym),
              fmt(entry - targetOffset, sym),
            ];

      const confidence =
        phase === "MANIPULATION"
          ? 82 + Math.floor(Math.random() * 10)
          : phase === "DISTRIBUTION"
            ? 78 + Math.floor(Math.random() * 12)
            : 70 + Math.floor(Math.random() * 15);

      return {
        phase,
        session,
        direction,
        entryZone,
        targetZone,
        pair: pd.label,
        confidence: Math.min(95, confidence),
        timestamp: nowStr(),
        sparkline: sparklineFrom(pd.ohlcv),
      };
    })
    .filter(Boolean);
}

export function generateSMCSignals(
  prices: Record<string, PriceData>,
): SMCSignal[] {
  const pairs = ["EURUSD=X", "GBPUSD=X", "XAUUSD=X", "USDJPY=X"];
  const types: SMCSignal["type"][] = ["BOS", "CHoCH", "ORDER_BLOCK", "FVG"];
  const labels: Record<SMCSignal["type"], string> = {
    BOS: "Break of Structure",
    CHoCH: "Change of Character",
    ORDER_BLOCK: "Order Block",
    FVG: "Fair Value Gap",
  };

  return pairs
    .map((sym, i): SMCSignal => {
      const pd = prices[sym];
      if (!pd) return null as any;
      const closes = pd.ohlcv.map((c) => c.close);
      const atrVal = atr(pd.ohlcv);

      const last = closes[closes.length - 1];
      const prev3 = closes.slice(-10, -1);
      const isSwingHigh = last > Math.max(...prev3.slice(0, 5));
      const isSwingLow = last < Math.min(...prev3.slice(0, 5));

      const type = types[i % types.length];
      const direction: Direction =
        type === "BOS"
          ? isSwingHigh
            ? "SELL"
            : "BUY"
          : type === "CHoCH"
            ? isSwingLow
              ? "BUY"
              : "SELL"
            : type === "ORDER_BLOCK"
              ? pd.changePercent > 0
                ? "BUY"
                : "SELL"
              : Math.random() > 0.4
                ? "BUY"
                : "SELL";

      const entry = pd.price;
      const ob = pd.ohlcv.slice(-10, -3).reduce(
        (b, c) => {
          if (direction === "BUY" && c.close > c.open) return c;
          if (direction === "SELL" && c.close < c.open) return c;
          return b;
        },
        pd.ohlcv[pd.ohlcv.length - 5],
      );

      const liquidity =
        direction === "BUY"
          ? fmt(Math.max(...pd.ohlcv.slice(-20).map((c) => c.high)), sym)
          : fmt(Math.min(...pd.ohlcv.slice(-20).map((c) => c.low)), sym);

      const pip = atrVal * 1.2;
      const target = fmt(
        direction === "BUY" ? entry + pip * 2.5 : entry - pip * 2.5,
        sym,
      );
      const sl = fmt(
        direction === "BUY" ? ob.low - atrVal * 0.3 : ob.high + atrVal * 0.3,
        sym,
      );
      const confidence = 74 + Math.floor(Math.random() * 18);

      return {
        pair: pd.label,
        direction,
        type,
        label: labels[type],
        entry: fmt(entry, sym),
        target,
        stopLoss: sl,
        liquidity,
        confidence: Math.min(96, confidence),
        timestamp: nowStr(),
        sparkline: sparklineFrom(pd.ohlcv),
      };
    })
    .filter(Boolean);
}
