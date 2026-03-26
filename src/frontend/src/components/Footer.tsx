import { TrendingUp } from "lucide-react";
import { SiDiscord, SiTelegram, SiX, SiYoutube } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`;

  return (
    <footer className="border-t border-border/40 mt-20 bg-[oklch(0.13_0.015_220)]">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neon/10 border border-neon/30">
                <TrendingUp className="h-4 w-4 text-neon" />
              </div>
              <span className="text-lg font-bold text-foreground">
                Trading AI
              </span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Advanced AI-powered forex trading signals with multi-strategy
              analysis. Serving 25,000+ traders worldwide.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Links
            </h4>
            <ul className="flex flex-col gap-2">
              {["Home", "Signals", "Tools", "Analytics", "Contact"].map((l) => (
                <li key={l}>
                  <a
                    href="/"
                    onClick={(e) => e.preventDefault()}
                    className="text-sm text-muted-foreground hover:text-neon transition-colors"
                    data-ocid={`footer.${l.toLowerCase()}.link`}
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Risk Disclaimer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Trading forex involves substantial risk. Past performance does not
              guarantee future results. Signals are for informational purposes
              only and do not constitute financial advice. Always use proper
              risk management and only trade with capital you can afford to
              lose.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Social Media
            </h4>
            <div className="flex gap-3">
              {[
                { Icon: SiX, label: "X" },
                { Icon: SiTelegram, label: "Telegram" },
                { Icon: SiDiscord, label: "Discord" },
                { Icon: SiYoutube, label: "YouTube" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="/"
                  onClick={(e) => e.preventDefault()}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground hover:text-neon hover:border-neon/40 transition-colors"
                  aria-label={label}
                  data-ocid={`footer.${label.toLowerCase()}.link`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neon transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground">
            All data is simulated for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
