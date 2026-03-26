# Trading AI

## Current State
New project. Empty backend and frontend scaffolding only.

## Requested Changes (Diff)

### Add
- Real-time forex price ticker (auto-refreshes every 30 seconds) for major pairs: XAUUSD, EURUSD, GBPUSD, USDJPY
- Section 1: GainzAlgo V2 Alpha signals — entry, target, stoploss for top forex pairs using EMA crossover + RSI + momentum logic
- Section 2: HT Gold Scalper Pro signals — ATR-based scalping signals specifically for XAUUSD (Gold)
- Section 3: AMD Signals — Accumulation, Manipulation, Distribution cycle detection signals
- Section 4: SMC (Smart Money Concepts) signals — order blocks, liquidity sweeps, fair value gap signals
- Auto-refresh every 30 seconds with countdown timer
- Signal direction (BUY/SELL), entry price, target price, stop loss price, risk/reward ratio
- Signal strength/confidence percentage

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Backend: Simple Motoko actor (minimal, since all signal logic is computed frontend-side)
2. Frontend: Fetch live forex prices from a public API (e.g. exchangerate-api or similar free endpoint). Fall back to simulated realistic prices if API unavailable.
3. Signal engines: Implement 4 independent signal computation modules in TypeScript:
   - GainzAlgo V2 Alpha: EMA(9/21) crossover + RSI divergence + volume momentum
   - HT Gold Scalper Pro: ATR channel + Heiken Ashi reversal + pivot points
   - AMD: Session-based Accumulation/Manipulation/Distribution detection
   - SMC: Order block detection + liquidity sweep + fair value gap
4. UI: Dark professional trading dashboard, 4-section grid, real-time price ticker bar at top, 30s auto-refresh countdown
