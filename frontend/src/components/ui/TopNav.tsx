import { Link } from "@tanstack/react-router";
import { Swords, Coins, Flame, Zap } from "lucide-react";
import { useStudyStore } from "@/hooks/useStudyStore";
import portrait from "@/assets/character-portrait.jpg";

type ActivePage = "home" | "journey" | "character" | "hub" | "quests";

interface TopNavProps {
  active?: ActivePage;
}

const NAV_ITEMS: { id: ActivePage; label: string; to: string }[] = [
  { id: "home", label: "HOME", to: "/" },
  { id: "journey", label: "JOURNEY", to: "/journey" },
  { id: "character", label: "CHARACTER", to: "/character" },
  { id: "hub", label: "PATH MODELER", to: "/hub" },
  { id: "quests", label: "QUESTS", to: "/quests" },
];

export function TopNav({ active }: TopNavProps) {
  const { stats, avatarUrl } = useStudyStore();
  const activeAvatar = avatarUrl || portrait;

  // Show stats panel in top right ONLY for character, hub, and quests pages (not journey)
  const showUpperRightStats = active === "character" || active === "hub" || active === "quests";

  return (
    <header className="relative z-20 w-full max-w-7xl mx-auto px-4 pt-6 pb-2 flex flex-col md:flex-row items-center justify-between gap-4 select-none">
      {/* Navigation Links */}
      <nav className="flex items-center justify-center gap-6 md:gap-10">
        {NAV_ITEMS.map((item) => {
          const isActive = item.id === active;
          return (
            <span key={item.id} className="relative">
              <Link
                to={item.to}
                className={`font-display text-xs md:text-sm uppercase tracking-[0.28em] transition duration-200 ${
                  isActive
                    ? "text-primary font-bold drop-shadow-[0_0_12px_rgba(200,170,110,0.5)]"
                    : "text-muted-foreground/70 hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
              {isActive && (
                <span className="absolute -bottom-1.5 left-0 h-[2px] w-full gold-rule shadow-[0_0_8px_rgba(200,170,110,0.6)]" />
              )}
            </span>
          );
        })}
      </nav>

      {/* Upper Right: Persistent Character RPG Stats Panel (on character, hub, quests) */}
      {showUpperRightStats && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-black/75 px-3 py-1.5 shadow-xl backdrop-blur-md">
          <Link
            to="/character"
            className="relative h-8 w-8 overflow-hidden rounded-full border border-primary/60 transition hover:scale-110 hover:border-primary shrink-0 shadow-[0_0_10px_rgba(200,170,110,0.3)]"
            title="Character Settings & Avatar"
          >
            <img src={activeAvatar} alt="Hero Avatar" className="h-full w-full object-cover" />
          </Link>

          <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
            {/* Level */}
            <div className="flex items-center gap-1" title="Hero Level">
              <Swords className="h-3.5 w-3.5 text-primary" />
              <span className="font-bold text-foreground">Lvl {stats?.level || 1}</span>
            </div>

            {/* XP Bar */}
            <div className="flex flex-col gap-0.5" title={`XP: ${stats?.xp || 0}/${stats?.xpMax || 100}`}>
              <div className="flex items-center justify-between gap-2 text-[10px]">
                <span className="flex items-center gap-1 text-accent font-semibold">
                  <Zap className="h-3 w-3 text-accent" />
                  {stats?.xp || 0} XP
                </span>
              </div>
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-black/90 border border-primary/20 p-0.2">
                <div
                  className="h-full bg-accent rounded-full transition-all duration-300 shadow-[0_0_6px_rgba(0,240,181,0.5)]"
                  style={{ width: `${Math.min(100, Math.max(8, ((stats?.xp || 0) / (stats?.xpMax || 100)) * 100))}%` }}
                />
              </div>
            </div>

            {/* Gold */}
            <div className="flex items-center gap-1" title="Gold Coins">
              <Coins className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold text-primary">{stats?.gold || 0}G</span>
            </div>

            {/* Streak */}
            <div className="flex items-center gap-1" title="Daily Study Streak">
              <Flame className="h-3.5 w-3.5 text-primary" />
              <span className="font-semibold text-foreground">{stats?.streak || 0}D</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
