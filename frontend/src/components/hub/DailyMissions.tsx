import { Link } from "@tanstack/react-router";
import { BookOpen, Library, Sparkles } from "lucide-react";

type Mission = { id: string; title: string; reward: string; done: boolean };

const seed: Mission[] = [
  { id: "m1", title: "Read 1 chapter of Valenciano textbook", reward: "+15 XP · +10g", done: false },
  { id: "m2", title: "Complete 3 methodology steps", reward: "+20 XP · +15g", done: false },
  { id: "m3", title: "Log a reflection entry", reward: "+10 XP · +5g", done: true },
];

export function DailyMissions() {
  return (
    <div className="rune-frame p-5 bg-card/60 backdrop-blur-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-magenta/15 p-2 text-magenta">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <div className="label-mono text-magenta">Daily Missions</div>
            <h3 className="font-display text-lg leading-tight">Quest Board</h3>
          </div>
        </div>
        <Link
          to="/quests"
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-primary hover:bg-primary/20 transition"
        >
          <Library className="h-3.5 w-3.5" /> Library
        </Link>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Complete missions to earn XP and Gold.
      </p>
      <ul className="mt-3 flex flex-col gap-2">
        {seed.map((m) => (
          <li
            key={m.id}
            className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
          >
            <div
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                m.done ? "border-xp bg-xp text-background" : "border-border"
              }`}
            >
              {m.done && <Sparkles className="h-3 w-3" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className={`text-sm ${m.done ? "text-muted-foreground line-through" : ""}`}>
                {m.title}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-gold">
                {m.reward}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


