import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Map, Swords, Sparkles, User } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import portrait from "@/assets/character-portrait.jpg";
import backdrop from "@/assets/realm-backdrop.jpg";
import { ArcaneOverlay } from "@/components/character/ArcaneOverlay";

import { TopNav } from "@/components/ui/TopNav";

export const Route = createFileRoute("/character")({
  head: () => ({
    meta: [
      { title: "Character Settings — Forge Your Avatar" },
      {
        name: "description",
        content:
          "Shape your study companion: choose appearance and personality traits, then copy the generated character prompt.",
      },
      { property: "og:title", content: "Character Settings — Forge Your Avatar" },
      {
        property: "og:description",
        content: "Choose appearance and personality traits for your study companion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CharacterSettings,
});

const APPEARANCE: { label: string; options: string[] }[] = [
  { label: "Gender", options: ["Female", "Male", "Androgynous"] },
  { label: "Age", options: ["Youth", "Young adult", "Adult", "Ancient"] },
  { label: "Hair", options: ["Long & flowing", "Braided", "Short", "Bun"] },
  { label: "Hair Colour", options: ["Silver", "Ash blonde", "Raven", "Copper"] },
  { label: "Eye Colour", options: ["Emerald", "Ice blue", "Amber", "Violet"] },
  { label: "Cloth style", options: ["Ranger cloak", "Mage robe", "Light armour", "Noble attire"] },
  { label: "Cloth Colour", options: ["Forest green", "Midnight", "Bronze", "Ivory"] },
];

const PERSONALITY: { label: string; options: string[] }[] = [
  { label: "Temperament", options: ["Calm", "Fiery", "Playful", "Stoic"] },
  { label: "Voice", options: ["Warm", "Commanding", "Soft", "Wry"] },
  { label: "Motivation", options: ["Curiosity", "Duty", "Glory", "Freedom"] },
  { label: "Flaw", options: ["Impatient", "Proud", "Reckless", "Secretive"] },
  { label: "Companion", options: ["Owl", "Wolf", "Fox", "None"] },
  { label: "Aura", options: ["Moonlit", "Ember", "Verdant", "Starlit"] },
];

function CharacterSettings() {
  const [tab, setTab] = useState<"appearance" | "personality">("appearance");
  const rows = tab === "appearance" ? APPEARANCE : PERSONALITY;

  return (
    <main className="realm-dark relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Backdrop */}
      <div className="pointer-events-none fixed inset-0">
        <img
          src={backdrop}
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_70%_35%,transparent,color-mix(in_oklab,var(--background)_80%,transparent))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_6%,color-mix(in_oklab,var(--background)_78%,transparent)_46%,color-mix(in_oklab,var(--background)_40%,transparent)_100%)]" />
        <ArcaneOverlay />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,var(--background))]" />
      </div>

      {/* Top nav */}
      <TopNav active="character" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 py-10 lg:min-h-[calc(100vh-7rem)] md:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)]">
        {/* Left: traits table */}
        <section className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 sm:max-w-md">
            {(["appearance", "personality"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rune-tab px-6 py-3 text-xs uppercase tracking-wider sm:text-sm ${
                  tab === t
                    ? "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--gold)_34%,transparent),color-mix(in_oklab,var(--gold)_10%,transparent))] text-primary shadow-[0_0_28px_-6px_var(--gold)]"
                    : "bg-card/60 text-muted-foreground hover:text-primary"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="rune-frame rounded-2xl p-2 sm:p-4">
            <ul className="divide-y divide-border/60">
              {rows.map((row) => (
                <li
                  key={row.label}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-3 py-3 transition hover:bg-primary/5 sm:px-4"
                >
                  <span className="min-w-0 truncate font-display text-base tracking-wide text-foreground/90">
                    {row.label}
                  </span>
                  <Select>
                    <SelectTrigger className="h-10 w-40 shrink-0 rounded-lg border-primary/30 bg-background/50 font-mono text-xs uppercase tracking-widest text-muted-foreground hover:border-primary/60 sm:w-52">
                      <SelectValue placeholder="Choose…" />
                    </SelectTrigger>
                    <SelectContent className="realm-dark border-primary/30 bg-popover text-popover-foreground">
                      {row.options.map((o) => (
                        <SelectItem key={o} value={o} className="font-mono text-xs uppercase tracking-widest">
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </li>
              ))}
            </ul>
          </div>

          <button className="rune-tab group inline-flex w-full max-w-xs items-center justify-center gap-3 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--gold)_30%,transparent),color-mix(in_oklab,var(--gold)_8%,transparent))] px-8 py-4 text-xs font-mono uppercase tracking-wider text-primary shadow-[0_0_34px_-10px_var(--gold)] hover:shadow-[0_0_44px_-6px_var(--gold)] sm:text-sm">
            <Copy className="h-4 w-4 transition group-hover:scale-110" />
            Copy Prompt
          </button>
        </section>

        {/* Right: character portrait */}
        <aside className="lg:sticky lg:top-10">
          <div className="rune-frame relative overflow-hidden rounded-2xl">
            <div className="relative aspect-[4/5] w-full">
              <img
                src={portrait}
                alt="Full-body illustration of the selected fantasy character"
                width={1024}
                height={1536}
                className="h-full w-full object-cover object-[50%_18%]"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,color-mix(in_oklab,var(--background)_85%,transparent))]" />
            </div>
            <span className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l border-t border-primary/60" />
            <span className="pointer-events-none absolute right-3 top-3 h-6 w-6 border-r border-t border-primary/60" />
            <span className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 border-b border-l border-primary/60" />
            <span className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b border-r border-primary/60" />
          </div>
          <div className="mt-3 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground/80">
            <span>Avatar Render</span>
            <span className="text-primary/80">v.01</span>
          </div>
        </aside>
      </div>
    </main>
  );
}
