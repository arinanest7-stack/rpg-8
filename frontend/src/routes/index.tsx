import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Plus, Swords, Coins, Flame, Zap, Shield } from "lucide-react";
import heroAvatar from "@/assets/hero-avatar.jpg";
import backdrop from "@/assets/realm-backdrop.jpg";
import { ArcaneOverlay } from "@/components/character/ArcaneOverlay";
import { useStudyStore } from "@/hooks/useStudyStore";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { stats, avatarUrl } = useStudyStore();
  const currentAvatar = avatarUrl || heroAvatar;

  return (
    <main className="realm-dark relative flex min-h-screen flex-col items-center justify-between overflow-hidden bg-background px-4 py-8 text-foreground select-none">
      {/* Background layer */}
      <div className="pointer-events-none fixed inset-0">
        <img
          src={backdrop}
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_40%,transparent,color-mix(in_oklab,var(--background)_85%,transparent))]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,15,10,0.5)_0%,rgba(6,18,11,0.95)_100%)]" />
        <ArcaneOverlay />
      </div>

      {/* Top Header */}
      <div className="relative z-10 pt-4 text-center">
        <div className="font-mono text-xs uppercase tracking-[0.4em] text-primary/80">
          Learning Realm
        </div>
        <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-[0.22em] text-primary sm:text-4xl shadow-sm drop-shadow-[0_2px_12px_rgba(200,170,110,0.3)]">
          Choose Your Hero
        </h1>
      </div>

      {/* Center Hero Selection Container */}
      <div className="relative z-10 my-auto flex w-full max-w-2xl flex-col items-center gap-6">
        <div className="relative flex items-center justify-center gap-6 w-full">
          {/* Left Arrow Nav Button */}
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/40 bg-black/60 text-primary/80 transition hover:border-primary hover:bg-black/80 hover:text-primary hover:scale-110 shadow-lg">
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Hero Card */}
          <div className="rune-frame group relative max-w-md overflow-hidden rounded-2xl border border-primary/40 bg-card/60 p-2 shadow-2xl backdrop-blur-md">
            {/* Corner runic accents */}
            <span className="pointer-events-none absolute left-3 top-3 z-20 h-5 w-5 border-l-2 border-t-2 border-primary/70" />
            <span className="pointer-events-none absolute right-3 top-3 z-20 h-5 w-5 border-r-2 border-t-2 border-primary/70" />
            <span className="pointer-events-none absolute bottom-3 left-3 z-20 h-5 w-5 border-b-2 border-l-2 border-primary/70" />
            <span className="pointer-events-none absolute bottom-3 right-3 z-20 h-5 w-5 border-b-2 border-r-2 border-primary/70" />

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
              <img
                src={currentAvatar}
                alt="Lyra Duskwind"
                className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(6,18,11,0.92)_100%)]" />
              
              {/* Character Details */}
              <div className="absolute bottom-4 inset-x-0 text-center px-4">
                <h2 className="font-display text-xl uppercase tracking-[0.2em] text-primary drop-shadow-md">
                  Lyra Duskwind
                </h2>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Seeker of the Verdant Weave
                </div>
              </div>
            </div>
          </div>

          {/* Right Nav Buttons */}
          <div className="flex flex-col gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-black/60 text-primary/80 transition hover:border-primary hover:bg-black/80 hover:text-primary hover:scale-110 shadow-lg">
              <ChevronRight className="h-5 w-5" />
            </button>
            <Link
              to="/character"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-black/60 text-primary/80 transition hover:border-primary hover:bg-black/80 hover:text-primary hover:scale-110 shadow-lg"
              title="Configure Hero Traits"
            >
              <Plus className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="w-full max-w-md rounded-xl border border-primary/30 bg-black/70 p-3 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between px-2 font-mono text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Swords className="h-3.5 w-3.5 text-primary" />
              <span>LEVEL <strong className="text-foreground">{stats.level}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="h-3.5 w-3.5 text-primary" />
              <span>GOLD <strong className="text-primary">{stats.gold}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-primary" />
              <span>STREAK <strong className="text-foreground">{stats.streak}D</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-accent" />
              <span>XP <strong className="text-accent">{stats.xp}/{stats.xpMax}</strong></span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-black/80 p-0.5 border border-primary/20">
            <div className="flex h-full w-full rounded-full overflow-hidden">
              <div className="h-full bg-accent transition-all duration-500" style={{ width: "45%" }} />
              <div className="h-full bg-primary/80 transition-all duration-500" style={{ width: "25%" }} />
            </div>
          </div>
        </div>

        {/* START THE JOURNEY Action Button */}
        <Link
          to="/journey"
          className="rune-tab relative mt-2 inline-flex items-center justify-center bg-[linear-gradient(180deg,rgba(200,170,110,0.35)_0%,rgba(200,170,110,0.12)_100%)] px-12 py-3.5 font-display text-sm uppercase tracking-[0.25em] text-primary shadow-[0_0_30px_-5px_rgba(200,170,110,0.4)] border border-primary/60 transition hover:scale-105 hover:bg-primary/25 hover:shadow-[0_0_40px_0px_rgba(200,170,110,0.6)]"
        >
          Start The Journey
        </Link>
      </div>

      {/* Bottom Actions Bar */}
      <div className="relative z-10 flex w-full max-w-5xl items-center justify-between pb-2">
        <Link
          to="/character"
          className="rune-tab rounded-full border border-primary/40 bg-black/60 px-6 py-2.5 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary hover:bg-card hover:text-primary"
        >
          Modelate The Character
        </Link>

        <Link
          to="/hub"
          className="rune-tab rounded-full border border-primary/40 bg-black/60 px-6 py-2.5 font-display text-xs uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary hover:bg-card hover:text-primary"
        >
          Modelate The Path
        </Link>
      </div>
    </main>
  );
}

