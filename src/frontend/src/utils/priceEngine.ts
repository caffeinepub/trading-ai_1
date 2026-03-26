export interface PriceData {
  symbol: string;
  label: string;
  price: number;
  change: number;
  changePercent: number;
  ohlcv: OHLCV[];
}

export interface OHLCV {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

const BASE_PRICES: Record<string, number> = {
  "EURUSD=X": 1.0921,
  "GBPUSD=X": 1.2734,
  "USDJPY=X": 149.85,
  "XAUUSD=X": 2334.5,
  "GBPJPY=X": 190.74,
  "AUDUSD=X": 0.6521,
};

const LABELS: Record<string, string> = {
  "EURUSD=X": "EUR/USD",
  "GBPUSD=X": "GBP/USD",
  "USDJPY=X": "USD/JPY",
  "XAUUSD=X": "XAU/USD",
  "GBPJPY=X": "GBP/JPY",
  "AUDUSD=X": "AUD/USD",
};

// In-memory state for simulated prices
const currentPrices: Record<string, number> = { ...BASE_PRICES };
const prevPrices: Record<string, number> = { ...BASE_PRICES };

function noise(range: number): number {
  return (Math.random() - 0.5) * 2 * range;
}

function getPipRange(symbol: string): number {
  if (symbol === "XAUUSD=X") return 3.0;
  if (symbol === "USDJPY=X") return 0.25;
  if (symbol === "GBPJPY=X") return 0.35;
  return 0.0008;
}

export function generateOHLCV(symbol: string, count = 50): OHLCV[] {
  const base = currentPrices[symbol] || BASE_PRICES[symbol];
  const range = getPipRange(symbol);
  const candles: OHLCV[] = [];
  let price = base * (1 - 0.002);
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const open = price;
    const move = noise(range * 3);
    const close = open + move;
    const high = Math.max(open, close) + Math.abs(noise(range));
    const low = Math.min(open, close) - Math.abs(noise(range));
    const volume = 1000 + Math.random() * 9000;
    candles.push({
      open,
      high,
      low,
      close,
      volume,
      timestamp: now - (count - i) * 60000 * 15,
    });
    price = close;
  }
  return candles;
}

export function refreshPrices(): Record<string, PriceData> {
  const result: Record<string, PriceData> = {};

  for (const symbol of Object.keys(BASE_PRICES)) {
    const prev = currentPrices[symbol];
    prevPrices[symbol] = prev;
    const range = getPipRange(symbol);
    const newPrice = prev + noise(range * 4);
    currentPrices[symbol] = +newPrice.toFixed(
      symbol === "XAUUSD=X"
        ? 2
        : symbol === "USDJPY=X" || symbol === "GBPJPY=X"
          ? 3
          : 5,
    );
    const change = currentPrices[symbol] - BASE_PRICES[symbol];
    const changePercent = (change / BASE_PRICES[symbol]) * 100;
    result[symbol] = {
      symbol,
      label: LABELS[symbol],
      price: currentPrices[symbol],
      change: +change.toFixed(symbol === "XAUUSD=X" ? 2 : 5),
      changePercent: +changePercent.toFixed(3),
      ohlcv: generateOHLCV(symbol),
    };
  }
  return result;
}

export const SYMBOLS = Object.keys(BASE_PRICES);
