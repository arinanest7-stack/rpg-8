import { Link } from "@tanstack/react-router";

type ActivePage = "journey" | "character" | "hub" | "quests";

interface TopNavProps {
  active: ActivePage;
}

const NAV_ITEMS: { id: ActivePage; label: string; to: string }[] = [
  { id: "journey", label: "JOURNEY", to: "/journey" },
  { id: "character", label: "CHARACTER", to: "/character" },
  { id: "hub", label: "PATH MODELER", to: "/hub" },
  { id: "quests", label: "QUESTS", to: "/quests" },
];

export function TopNav({ active }: TopNavProps) {
  return (
    <nav className="relative z-20 flex items-center justify-center gap-8 md:gap-12 pt-8 pb-4 select-none">
      {NAV_ITEMS.map((item) => {
        const isActive = item.id === active;
        return (
          <span key={item.id} className="relative">
            <Link
              to={item.to}
              className={`font-display text-xs md:text-sm uppercase tracking-[0.32em] transition duration-200 ${
                isActive
                  ? "text-primary font-bold drop-shadow-[0_0_12px_rgba(200,170,110,0.5)]"
                  : "text-muted-foreground/70 hover:text-primary"
              }`}
            >
              {item.label}
            </Link>
            {isActive && (
              <span className="absolute -bottom-2 left-0 h-[2px] w-full gold-rule shadow-[0_0_8px_rgba(200,170,110,0.6)]" />
            )}
          </span>
        );
      })}
    </nav>
  );
}
