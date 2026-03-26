import { TrendingUp } from "lucide-react";

const navLinks = ["Home", "Signals", "Tools", "Analytics", "Contact"];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-[oklch(0.13_0.015_220/0.95)] backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <div className="flex items-center gap-2" data-ocid="header.link">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neon/10 border border-neon/30">
            <TrendingUp className="h-4 w-4 text-neon" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">
            Trading AI
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link}
              href="/"
              onClick={(e) => e.preventDefault()}
              className="text-sm font-medium text-muted-foreground hover:text-neon transition-colors duration-200"
              data-ocid={`nav.${link.toLowerCase()}.link`}
            >
              {link}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground hidden sm:block">
            Live Trading
          </span>
          <span className="h-2 w-2 rounded-full bg-neon pulse-active animate-pulse" />
        </div>
      </div>
    </header>
  );
}
