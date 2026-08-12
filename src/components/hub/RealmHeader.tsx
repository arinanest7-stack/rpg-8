import { Coins } from "lucide-react";
import { EditableText } from "./EditableText";
import heroAvatar from "@/assets/hero-avatar.jpg";

type Props = {
  name: string;
  description: string;
  onName: (v: string) => void;
  onDescription: (v: string) => void;
  xp: number;
  xpMax: number;
  level: number;
  gold: number;
  avatarUrl?: string;
};

export function RealmHeader({
  name,
  description,
  onName,
  onDescription,
  xp,
  xpMax,
  level,
  gold,
  avatarUrl,
}: Props) {
  const pct = Math.min(100, Math.round((xp / xpMax) * 100));
  const remaining = Math.max(0, xpMax - xp);
  const img = avatarUrl ?? heroAvatar;

  return (
    <div className="rune-frame relative overflow-hidden p-6 md:p-8 bg-card/60 backdrop-blur-md">
      <div className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative grid gap-6 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        {/* Big avatar */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-background/40 shadow-[0_0_60px_-12px_var(--primary)]">
            <img
              src={img}
              alt={`${name} avatar portrait`}
              width={1024}
              height={1024}
              className="aspect-square h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-foreground/10" />
          </div>
        </div>

        {/* Right: header info */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="label-mono mb-1 text-primary">RPG Character Sheet</div>
            <div className="flex flex-wrap items-center gap-3">
              <EditableText
                value={name}
                onChange={onName}
                as="h1"
                className="font-display text-4xl uppercase leading-none tracking-wider text-foreground md:text-5xl"
              />
              <span className="inline-flex items-center rounded-lg border border-gold/50 bg-gold/10 px-3 py-1.5 font-mono text-sm font-bold uppercase tracking-widest text-gold">
                Lv {level}
              </span>
            </div>
            <EditableText
              value={description}
              onChange={onDescription}
              multiline
              placeholder="Add a short description..."
              className="mt-2 block max-w-2xl text-sm text-muted-foreground"
            />
          </div>

          {/* XP progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="label-mono text-primary">XP Progress</span>
              <span className="font-mono text-sm">
                <span className="text-foreground">{xp}</span>
                <span className="text-muted-foreground"> / {xpMax} XP</span>
              </span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full border border-accent/40 bg-background/60">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: "var(--gradient-xp)" }}
              />
            </div>
            <div className="text-right font-mono text-xs text-muted-foreground">
              {remaining} XP to next level
            </div>
          </div>

          {/* Gold ledger */}
          <div className="inline-flex w-fit items-center gap-2 rounded-xl border border-gold/50 bg-gold/10 px-4 py-2.5 font-display text-lg text-gold shadow-[0_0_30px_-12px_var(--gold)]">
            <Coins className="h-5 w-5" />
            <span>Gold Ledger: {gold}g</span>
          </div>
        </div>
      </div>
    </div>
  );
}
