import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Copy,
  Upload,
  Link as LinkIcon,
  RotateCcw,
  Check,
  Sparkles,
  Image as ImageIcon,
  Swords,
  Coins,
  Flame,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import portrait from "@/assets/character-portrait.jpg";
import heroAvatar from "@/assets/hero-avatar.jpg";
import backdrop from "@/assets/realm-backdrop.jpg";
import { ArcaneOverlay } from "@/components/character/ArcaneOverlay";
import { PromptModal } from "@/components/character/PromptModal";
import { TopNav } from "@/components/ui/TopNav";
import { useStudyStore } from "@/hooks/useStudyStore";
import {
  CharacterAppearanceTraits,
  CharacterPersonalityTraits,
  generateCharacterPrompt,
} from "@/lib/promptGenerator";

export const Route = createFileRoute("/character")({
  head: () => ({
    meta: [
      { title: "Character Settings — Forge Your Avatar" },
      {
        name: "description",
        content:
          "Shape your study companion: choose appearance and personality traits, upload custom avatar pictures, and copy the generated character prompt.",
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
  const {
    avatarUrl,
    setAvatarUrl,
    stats,
    appearance,
    updateAppearance,
    personality,
    updatePersonality,
  } = useStudyStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showUrlInput, setShowUrlInput] = useState(false);
  const [tempUrl, setTempUrl] = useState("");

  const activeAvatar = avatarUrl || portrait;
  const rows = tab === "appearance" ? APPEARANCE : PERSONALITY;

  const handleSelectTrait = (label: string, value: string) => {
    if (tab === "appearance") {
      const keyMap: Record<string, keyof CharacterAppearanceTraits> = {
        Gender: "gender",
        Age: "age",
        Hair: "hair",
        "Hair Colour": "hairColour",
        "Eye Colour": "eyeColour",
        "Cloth style": "clothStyle",
        "Cloth Colour": "clothColour",
      };
      const key = keyMap[label];
      if (key) {
        updateAppearance({ [key]: value });
      }
    } else {
      const keyMap: Record<string, keyof CharacterPersonalityTraits> = {
        Temperament: "temperament",
        Voice: "voice",
        Motivation: "motivation",
        Flaw: "flaw",
        Companion: "companion",
        Aura: "aura",
      };
      const key = keyMap[label];
      if (key) {
        updatePersonality({ [key]: value });
      }
    }
  };

  const getTraitValue = (label: string) => {
    if (tab === "appearance") {
      const keyMap: Record<string, keyof CharacterAppearanceTraits> = {
        Gender: "gender",
        Age: "age",
        Hair: "hair",
        "Hair Colour": "hairColour",
        "Eye Colour": "eyeColour",
        "Cloth style": "clothStyle",
        "Cloth Colour": "clothColour",
      };
      const key = keyMap[label];
      return (key && appearance ? appearance[key] : "") || "";
    } else {
      const keyMap: Record<string, keyof CharacterPersonalityTraits> = {
        Temperament: "temperament",
        Voice: "voice",
        Motivation: "motivation",
        Flaw: "flaw",
        Companion: "companion",
        Aura: "aura",
      };
      const key = keyMap[label];
      return (key && personality ? personality[key] : "") || "";
    }
  };

  const compressImage = (dataUrl: string, callback: (compressed: string) => void) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 600;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", 0.85);
        callback(compressed);
      } else {
        callback(dataUrl);
      }
    };
    img.onerror = () => callback(dataUrl);
    img.src = dataUrl;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        compressImage(result, (compressed) => {
          setAvatarUrl(compressed);
          toast.success("✨ New character photo uploaded & saved! Maintained on Home & all pages.");
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempUrl.trim()) return;

    setAvatarUrl(tempUrl.trim());
    setTempUrl("");
    setShowUrlInput(false);
    toast.success("Avatar image updated from URL! Synced with Main Page.");
  };

  const handleSelectPreset = (url: string) => {
    setAvatarUrl(url);
    toast.success("Preset avatar selected! Synced with Main Page.");
  };

  const handleResetAvatar = () => {
    setAvatarUrl("");
    toast.info("Reset to default character avatar.");
  };

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
                  <Select
                    value={getTraitValue(row.label)}
                    onValueChange={(val) => handleSelectTrait(row.label, val)}
                  >
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

          <button
            onClick={() => {
              const res = generateCharacterPrompt(appearance, personality, stats?.level || 1);
              navigator.clipboard.writeText(res.positivePrompt);
              toast.success(`✨ Character Prompt copied to clipboard! (Lvl ${stats?.level || 1} Mystic Forest)`, {
                duration: 3000,
              });
            }}
            className="rune-tab group inline-flex w-full max-w-xs items-center justify-center gap-3 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--gold)_34%,transparent),color-mix(in_oklab,var(--gold)_10%,transparent))] px-8 py-4 text-xs font-mono uppercase tracking-wider text-primary shadow-[0_0_34px_-10px_var(--gold)] hover:shadow-[0_0_45px_rgba(223,184,108,0.7)] hover:scale-[1.03] active:scale-95 transition-all duration-150 transform cursor-pointer sm:text-sm"
          >
            <Copy className="h-4 w-4 transition duration-300 group-hover:scale-125" />
            Copy Prompt
          </button>
        </section>

        {/* Right: character portrait */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-10">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="rune-frame group relative overflow-hidden rounded-2xl border border-primary/40 bg-card/60 p-2 shadow-2xl backdrop-blur-md cursor-pointer"
            title="Click to upload new character photo"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
              <img
                src={activeAvatar}
                alt="Full-body illustration of the selected fantasy character"
                width={1024}
                height={1536}
                className="h-full w-full object-cover object-[50%_18%] transition duration-500 group-hover:scale-105"
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,color-mix(in_oklab,var(--background)_85%,transparent))]" />

              {/* Upload Hover Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100 backdrop-blur-xs">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary bg-black/80 text-primary shadow-[0_0_24px_rgba(200,170,110,0.6)] group-hover:scale-110 transition duration-300">
                  <Upload className="h-7 w-7" />
                </div>
                <span className="font-display text-sm uppercase tracking-widest text-primary drop-shadow">
                  Upload Custom Photo
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  Click photo to change picture
                </span>
              </div>
            </div>

            {/* Corner runic accents */}
            <span className="pointer-events-none absolute left-3 top-3 h-6 w-6 border-l border-t border-primary/60" />
            <span className="pointer-events-none absolute right-3 top-3 h-6 w-6 border-r border-t border-primary/60" />
            <span className="pointer-events-none absolute bottom-3 left-3 h-6 w-6 border-b border-l border-primary/60" />
            <span className="pointer-events-none absolute bottom-3 right-3 h-6 w-6 border-b border-r border-primary/60" />
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </aside>
      </div>
    </main>
  );
}
