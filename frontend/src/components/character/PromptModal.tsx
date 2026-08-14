import { useState, useMemo, useEffect } from "react";
import { Sparkles, Copy, Check, ShieldAlert, Wand2, Layers, Info, Lock, Unlock, Zap } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  generateCharacterPrompt,
  CharacterAppearanceTraits,
  CharacterPersonalityTraits,
} from "@/lib/promptGenerator";

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  appearance: CharacterAppearanceTraits;
  personality: CharacterPersonalityTraits;
  currentLevel: number;
}

export function PromptModal({
  isOpen,
  onClose,
  appearance = {},
  personality = {},
  currentLevel = 1,
}: PromptModalProps) {
  const heroLevel = currentLevel || 1;
  const [levelOverride, setLevelOverride] = useState<number>(heroLevel);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [copiedPos, setCopiedPos] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  // Sync level with current hero level when modal opens or hero stats update
  useEffect(() => {
    if (!isPreviewMode) {
      setLevelOverride(heroLevel);
    }
  }, [heroLevel, isPreviewMode, isOpen]);

  const activeLevel = isPreviewMode ? levelOverride : heroLevel;

  const promptResult = useMemo(() => {
    return generateCharacterPrompt(appearance || {}, personality || {}, activeLevel);
  }, [appearance, personality, activeLevel]);

  const handleCopyPositive = () => {
    navigator.clipboard.writeText(promptResult.positivePrompt);
    setCopiedPos(true);
    toast.success("Positive prompt copied to clipboard!");
    setTimeout(() => setCopiedPos(false), 2000);
  };

  const handleCopyNegative = () => {
    navigator.clipboard.writeText(promptResult.negativePrompt);
    setCopiedNeg(true);
    toast.success("Negative prompt copied to clipboard!");
    setTimeout(() => setCopiedNeg(false), 2000);
  };

  const handleCopyAll = () => {
    const fullText = `--- POSITIVE PROMPT ---\n${promptResult.positivePrompt}\n\n--- NEGATIVE PROMPT ---\n${promptResult.negativePrompt}`;
    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    toast.success("Full prompt bundle copied to clipboard!");
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="realm-dark max-w-2xl border border-primary/40 bg-background/95 p-6 backdrop-blur-xl sm:rounded-2xl">
        <DialogHeader className="gap-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-widest">
              <Wand2 className="h-4 w-4" /> AI Image Generator Prompt
            </div>
            <div className="flex items-center gap-1.5 font-mono text-xs text-accent bg-accent/10 px-2.5 py-1 rounded border border-accent/30">
              <Zap className="h-3.5 w-3.5" /> Character XP Level: <strong>Lvl {heroLevel}</strong>
            </div>
          </div>
          <DialogTitle className="font-display text-xl text-foreground">
            Mystic Fantasy Character Prompt
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Prompts are automatically dictated by your character's current XP Level progression stats.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          {/* Level Progression & Lock Bar */}
          <div className="rounded-xl border border-primary/30 bg-card/60 p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-primary" /> Active Tier Rules
              </span>
              <span className="font-mono text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/30">
                {promptResult.levelTierName}
              </span>
            </div>

            {/* Lock / Unlock Preview Toggle */}
            <div className="flex items-center justify-between pt-1 border-t border-border/40">
              <span className="font-mono text-[11px] text-muted-foreground flex items-center gap-1.5">
                {isPreviewMode ? (
                  <Unlock className="h-3.5 w-3.5 text-accent" />
                ) : (
                  <Lock className="h-3.5 w-3.5 text-primary" />
                )}
                {isPreviewMode
                  ? "Testing Future Levels (Preview Mode)"
                  : `Locked to Hero XP Level (Lvl ${heroLevel})`}
              </span>
              <button
                onClick={() => {
                  setIsPreviewMode(!isPreviewMode);
                  if (isPreviewMode) {
                    setLevelOverride(heroLevel);
                  }
                }}
                className="rune-tab text-[10px] font-mono uppercase px-3 py-1 border border-primary/30 bg-card/80 text-primary hover:bg-primary/20 transition"
              >
                {isPreviewMode ? "🔒 Lock to XP Level" : "🔓 Test Future Levels"}
              </button>
            </div>

            {/* Slider (Active in Preview Mode) */}
            {isPreviewMode && (
              <div className="flex flex-col gap-2 pt-2 border-t border-border/30">
                <div className="flex items-center gap-4">
                  <Slider
                    value={[levelOverride]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(vals) => setLevelOverride(vals[0])}
                    className="flex-1"
                  />
                  <span className="font-mono text-sm font-bold text-accent w-12 text-right">
                    Lvl {levelOverride}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">Quick Set:</span>
                  {[1, 3, 5, 8, 10].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLevelOverride(lvl)}
                      className={`px-2.5 py-0.5 rounded text-[11px] font-mono transition ${
                        levelOverride === lvl
                          ? "bg-accent text-accent-foreground font-bold shadow-[0_0_10px_rgba(0,240,181,0.4)]"
                          : "bg-muted/40 text-muted-foreground hover:bg-accent/20 hover:text-accent"
                      }`}
                    >
                      Lvl {lvl}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Level Restrictions Summary Banner */}
            <div className="rounded-lg bg-background/60 border border-border/60 p-3 text-xs flex flex-col gap-1 text-muted-foreground">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-foreground font-medium">
                <Info className="h-3.5 w-3.5 text-primary" /> Lvl {activeLevel} Visual Restrictions:
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                <li><strong className="text-foreground/90">Attire:</strong> {promptResult.attireDescription}</li>
                <li><strong className="text-foreground/90">Posture & Mood:</strong> {promptResult.postureDescription}</li>
                <li><strong className="text-foreground/90">Environment:</strong> {promptResult.backgroundDescription}</li>
              </ul>
            </div>
          </div>

          {/* Positive Prompt Card */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Positive Prompt
              </span>
              <button
                onClick={handleCopyPositive}
                className={`rune-tab flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase transition-all duration-150 active:scale-95 transform cursor-pointer border ${
                  copiedPos
                    ? "border-emerald-500/80 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105"
                    : "border-primary/40 bg-primary/10 text-primary hover:border-primary hover:bg-primary/25 hover:shadow-[0_0_15px_rgba(200,170,110,0.4)]"
                }`}
              >
                {copiedPos ? <Check className="h-3.5 w-3.5 text-emerald-400 animate-bounce" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedPos ? "Copied!" : "Copy Positive"}
              </button>
            </div>
            <textarea
              readOnly
              rows={4}
              value={promptResult.positivePrompt}
              className="w-full rounded-xl border border-primary/30 bg-black/60 p-3 font-mono text-xs text-foreground/90 focus:outline-none resize-none leading-relaxed select-all"
            />
          </div>

          {/* Negative Prompt Card */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-wider text-destructive flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" /> Negative Prompt
              </span>
              <button
                onClick={handleCopyNegative}
                className={`rune-tab flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase transition-all duration-150 active:scale-95 transform cursor-pointer border ${
                  copiedNeg
                    ? "border-emerald-500/80 bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-105"
                    : "border-destructive/40 bg-destructive/10 text-destructive hover:border-destructive hover:bg-destructive/25 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                }`}
              >
                {copiedNeg ? <Check className="h-3.5 w-3.5 text-emerald-400 animate-bounce" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedNeg ? "Copied!" : "Copy Negative"}
              </button>
            </div>
            <textarea
              readOnly
              rows={2}
              value={promptResult.negativePrompt}
              className="w-full rounded-xl border border-destructive/30 bg-black/60 p-3 font-mono text-xs text-muted-foreground focus:outline-none resize-none leading-relaxed select-all"
            />
          </div>

          {/* Workflow guide */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 flex items-center justify-between gap-2 text-[11px] font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">
                1
              </span>
              <span>Copy Prompt</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">
                2
              </span>
              <span>Generate in Midjourney / ChatGPT</span>
            </div>
            <span>→</span>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-[10px]">
                3
              </span>
              <span>Upload Picture to Character Portrait</span>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-border bg-card/60 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:bg-card hover:text-foreground transition active:scale-95"
          >
            Close
          </button>
          <button
            onClick={handleCopyAll}
            className={`rune-tab flex items-center gap-2 px-6 py-2.5 text-xs font-mono uppercase tracking-wider transition-all duration-200 active:scale-95 transform cursor-pointer ${
              copiedAll
                ? "bg-emerald-600 text-white shadow-[0_0_25px_rgba(16,185,129,0.7)] scale-105"
                : "bg-[linear-gradient(180deg,color-mix(in_oklab,var(--gold)_34%,transparent),color-mix(in_oklab,var(--gold)_10%,transparent))] text-primary shadow-[0_0_20px_-4px_var(--gold)] hover:shadow-[0_0_35px_rgba(223,184,108,0.7)] hover:scale-[1.02]"
            }`}
          >
            {copiedAll ? <Check className="h-4 w-4 animate-bounce" /> : <Copy className="h-4 w-4" />}
            {copiedAll ? "Bundle Copied!" : "Copy Full Bundle"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
