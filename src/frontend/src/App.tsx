import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import AMDCard from "./components/AMDCard";
import Footer from "./components/Footer";
import GainzAlgoCard from "./components/GainzAlgoCard";
import GoldScalperCard from "./components/GoldScalperCard";
import Header from "./components/Header";
import MarketOverview from "./components/MarketOverview";
import SMCCard from "./components/SMCCard";
import TickerStrip from "./components/TickerStrip";
import { refreshPrices } from "./utils/priceEngine";
import type { PriceData } from "./utils/priceEngine";
import {
  generateAMDSignals,
  generateGainzAlgoSignals,
  generateGoldScalperSignals,
  generateSMCSignals,
} from "./utils/signalEngines";
import type {
  AMDSignal,
  GoldSignal,
  SMCSignal,
  Signal,
} from "./utils/signalEngines";

const REFRESH_INTERVAL = 30;

export default function App() {
  const [prices, setPrices] = useState<Record<string, PriceData>>({});
  const [gainzSignals, setGainzSignals] = useState<Signal[]>([]);
  const [goldSignals, setGoldSignals] = useState<GoldSignal[]>([]);
  const [amdSignals, setAmdSignals] = useState<AMDSignal[]>([]);
  const [smcSignals, setSmcSignals] = useState<SMCSignal[]>([]);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);
  const [lastUpdated, setLastUpdated] = useState("");

  const refresh = useCallback(() => {
    const newPrices = refreshPrices();
    setPrices(newPrices);
    setGainzSignals(generateGainzAlgoSignals(newPrices));
    setGoldSignals(generateGoldScalperSignals(newPrices));
    setAmdSignals(generateAMDSignals(newPrices));
    setSmcSignals(generateSMCSignals(newPrices));
    setLastUpdated(new Date().toLocaleTimeString());
    setCountdown(REFRESH_INTERVAL);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refresh();
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [refresh]);

  const hasData = gainzSignals.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <TickerStrip prices={prices} />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="hero-glow relative py-20 text-center"
          data-ocid="hero.section"
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-extrabold text-foreground tracking-tight mb-4">
              Forex Trading Signals Dashboard
            </h1>
            <p className="text-base text-muted-foreground max-w-xl mx-auto">
              Advanced AI-Powered Insights. Join over 25,000+ traders.
            </p>
            <div className="flex items-center justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-neon animate-pulse" />
                <span className="text-muted-foreground">Live Market Data</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">
                  Last updated: {lastUpdated || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Auto-refresh in</span>
                <span
                  className="inline-flex items-center justify-center h-7 w-7 rounded-full border text-xs font-bold text-foreground"
                  style={{
                    borderColor: countdown <= 5 ? "#FF5B6B" : "#2FEA7B",
                    color: countdown <= 5 ? "#FF5B6B" : "#2FEA7B",
                  }}
                  data-ocid="hero.countdown"
                >
                  {countdown}
                </span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Signals Grid */}
        <div
          className="container mx-auto max-w-7xl px-4"
          data-ocid="signals.section"
        >
          {hasData ? (
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GainzAlgoCard signals={gainzSignals} countdown={countdown} />
              <GoldScalperCard signals={goldSignals} countdown={countdown} />
              <AMDCard signals={amdSignals} countdown={countdown} />
              <SMCCard signals={smcSignals} countdown={countdown} />
            </motion.div>
          ) : (
            <div
              className="flex items-center justify-center h-48"
              data-ocid="signals.loading_state"
            >
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-neon border-t-transparent animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Loading signals...
                </span>
              </div>
            </div>
          )}

          <MarketOverview prices={prices} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
