import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Library,
  ChevronDown,
  ChevronUp,
  Search,
  Check,
  Zap,
  Coins,
  Award,
  Maximize2,
  Minimize2,
  Map,
  Swords,
  Sparkles,
  Flame,
  Trophy,
  Store,
  User,
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import backdrop from "@/assets/realm-backdrop.jpg";
import { ArcaneOverlay } from "@/components/character/ArcaneOverlay";
import { useStudyStore } from "@/hooks/useStudyStore";
import { cn } from "@/lib/utils";

import { TopNav } from "@/components/ui/TopNav";

export const Route = createFileRoute("/quests")({
  head: () => ({
    meta: [
      { title: "Quest Library — Learning Realm" },
      {
        name: "description",
        content:
          "Browse all available quests, filter by skills, toggle skill categories, and track your study progression.",
      },
      { property: "og:title", content: "Quest Library — Learning Realm" },
      {
        property: "og:description",
        content: "Complete study quests across all skills to earn XP and Gold.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: QuestLibraryPage,
});

export interface Quest {
  id: string;
  skillTitle: string;
  text: string;
  difficulty: "Easy" | "Medium" | "Epic";
  xp: number;
  gold: number;
  done: boolean;
}

const MENU = [
  { icon: Map, label: "Journey", to: "/journey" as const },
  { icon: Swords, label: "Practice", to: "/hub" as const },
  { icon: Sparkles, label: "Quests", to: "/quests" as const },
  { icon: Flame, label: "Streak Club", to: "/hub" as const },
  { icon: Trophy, label: "Leaderboard", to: "/hub" as const },
  { icon: Store, label: "Store", to: "/hub" as const },
  { icon: User, label: "Character", to: "/character" as const },
];

function QuestLibraryPage() {
  const { containers, quests, addQuest, toggleQuestDone, deleteQuest } = useStudyStore();
  const [search, setSearch] = useState("");
  const [collapsedSkills, setCollapsedSkills] = useState<Record<string, boolean>>({});

  // Quest Edit / Add Modal state
  const [editingQuest, setEditingQuest] = useState<QuestItem | null>(null);
  const [isNewQuest, setIsNewQuest] = useState(false);
  const [formSkillTitle, setFormSkillTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [formDifficulty, setFormDifficulty] = useState<"Easy" | "Medium" | "Epic">("Medium");
  const [formXp, setFormXp] = useState(25);
  const [formGold, setFormGold] = useState(10);

  // Extract all existing character skills dynamically from containers
  const availableSkills = useMemo(() => {
    return containers.map((c) => c.title);
  }, [containers]);

  // Dynamically group custom quests by active containers in useStudyStore
  const skillsGrouped = useMemo(() => {
    const map: Record<string, { containerId: string; skillTitle: string; quests: QuestItem[] }> = {};

    containers.forEach((c) => {
      const skillTitle = c.title;
      const skillQuests = quests.filter(
        (q) => q.containerId === c.id || q.skillTitle.toLowerCase() === c.title.toLowerCase(),
      );

      const filtered = skillQuests.filter(
        (q) =>
          q.text.toLowerCase().includes(search.toLowerCase()) ||
          q.skillTitle.toLowerCase().includes(search.toLowerCase()),
      );

      map[skillTitle] = {
        containerId: c.id,
        skillTitle,
        quests: filtered,
      };
    });

    return map;
  }, [containers, quests, search]);

  const allFlatQuests = useMemo(() => {
    return Object.values(skillsGrouped).flatMap((g) => g.quests);
  }, [skillsGrouped]);

  const totalQuests = allFlatQuests.length;
  const completedCount = allFlatQuests.filter((q) => q.done).length;

  const toggleSkillCollapse = (skillTitle: string) => {
    setCollapsedSkills((prev) => ({
      ...prev,
      [skillTitle]: !prev[skillTitle],
    }));
  };

  const collapseAll = () => {
    const allSkills = Object.keys(skillsGrouped);
    const newMap: Record<string, boolean> = {};
    allSkills.forEach((s) => (newMap[s] = true));
    setCollapsedSkills(newMap);
  };

  const expandAll = () => {
    setCollapsedSkills({});
  };

  const toggleQuestCompletion = (questId: string) => {
    toggleQuestDone(questId);
  };

  const openAddQuestModal = (defaultSkill?: string) => {
    const targetSkill = defaultSkill || availableSkills[0] || "General Skill";
    setIsNewQuest(true);
    setFormSkillTitle(targetSkill);
    setFormText("");
    setFormDifficulty("Medium");
    setFormXp(25);
    setFormGold(10);
    setEditingQuest({
      id: Math.random().toString(36).slice(2, 10),
      containerId: containers.find((c) => c.title === targetSkill)?.id || containers[0]?.id || "c-1",
      skillTitle: targetSkill,
      text: "",
      difficulty: "Medium",
      xp: 25,
      gold: 10,
      done: false,
    });
  };

  const openEditQuestModal = (quest: QuestItem) => {
    setIsNewQuest(false);
    setFormSkillTitle(quest.skillTitle);
    setFormText(quest.text);
    setFormDifficulty(quest.difficulty);
    setFormXp(quest.xp);
    setFormGold(quest.gold);
    setEditingQuest(quest);
  };

  const handleSaveQuest = () => {
    if (!formText.trim()) return;

    const targetContainer = containers.find((c) => c.title === formSkillTitle) || containers[0];
    if (targetContainer) {
      addQuest(
        targetContainer.id,
        targetContainer.title,
        formText.trim(),
        formDifficulty,
        Number(formXp) || 25,
        Number(formGold) || 10,
      );
    }
    setEditingQuest(null);
  };

  const handleDeleteQuest = (questId: string) => {
    deleteQuest(questId);
  };

  return (
    <div className="realm-dark relative min-h-screen bg-[#06120b] text-foreground select-none">
      {/* Backdrop */}
      <div className="pointer-events-none fixed inset-0">
        <img
          src={backdrop}
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[radial-gradient(1100px_650px_at_50%_25%,transparent,color-mix(in_oklab,var(--background)_90%,transparent))]" />
        <ArcaneOverlay />
      </div>

      {/* Top Nav matching Photo 1 */}
      <TopNav active="quests" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-8">
        {/* Full Quest Database Page */}
        <main className="min-w-0 flex-1">
          {/* Header Banner */}
          <div className="rune-frame rounded-2xl border border-primary/40 p-6 mb-6 bg-card/70 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/80">
                  Quest Library & Daily Challenges
                </div>
                <h1 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-[0.18em] text-primary drop-shadow-md">
                  Quests & Missions
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => openAddQuestModal()}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/50 bg-primary/20 px-4 py-2 font-mono text-xs font-semibold text-primary shadow-sm hover:bg-primary/30 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Quest</span>
                </button>

                <div className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 font-mono text-xs text-gold">
                  <Award className="h-4 w-4" />
                  <span className="font-semibold">
                    {completedCount}/{totalQuests} Completed
                  </span>
                </div>
              </div>
            </div>

            {/* Search & Actions Bar */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-4">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search quests by text or skill..."
                  className="w-full rounded-xl border border-border/70 bg-background/80 px-10 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={expandAll}
                  className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/80 px-3.5 py-2 font-mono text-xs text-muted-foreground hover:border-primary hover:text-primary transition"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Expand All</span>
                </button>
                <button
                  onClick={collapseAll}
                  className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/80 px-3.5 py-2 font-mono text-xs text-muted-foreground hover:border-primary hover:text-primary transition"
                >
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span>Collapse All</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quest Skills Groups */}
          <div className="flex flex-col gap-6 pb-16">
            {Object.keys(skillsGrouped).length === 0 ? (
              <div className="rune-frame rounded-2xl p-12 text-center text-sm text-muted-foreground">
                No quests found matching your filter.
              </div>
            ) : (
              Object.entries(skillsGrouped).map(([skillTitle, group]) => {
                const skillQuests = group.quests;
                const isCollapsed = Boolean(collapsedSkills[skillTitle]);
                const doneSkillCount = skillQuests.filter((q) => q.done).length;

                return (
                  <div
                    key={skillTitle}
                    className="rune-frame rounded-2xl bg-card/70 backdrop-blur-md overflow-hidden shadow-lg transition"
                  >
                    {/* Skill Toggle Header */}
                    <div
                      onClick={() => toggleSkillCollapse(skillTitle)}
                      className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer hover:bg-primary/5 transition select-none"
                    >
                      <div className="flex items-center gap-3.5">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary">
                          {isCollapsed ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronUp className="h-4 w-4" />
                          )}
                        </button>
                        <h2 className="font-display text-lg font-semibold uppercase tracking-wider text-primary">
                          {skillTitle}
                        </h2>
                        <span className="rounded-full bg-primary/10 border border-primary/30 px-3 py-0.5 font-mono text-[10px] text-primary font-medium">
                          {skillQuests.length} quests
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddQuestModal(skillTitle);
                          }}
                          className="flex items-center gap-1 font-mono text-xs text-primary hover:underline px-2 py-1 rounded hover:bg-primary/10 transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Quest</span>
                        </button>

                        <span className="font-mono text-xs text-muted-foreground">
                          {doneSkillCount}/{skillQuests.length} done
                        </span>
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-background/80 border border-border/40">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--primary))] transition-all"
                            style={{
                              width: skillQuests.length > 0 ? `${(doneSkillCount / skillQuests.length) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quests List under Skill - Unified Single Line cards */}
                    {!isCollapsed && (
                      <div className="p-4 flex flex-col gap-3 border-t border-border/40 bg-background/30">
                        {skillQuests.length === 0 ? (
                          <div className="py-6 px-4 text-center text-xs font-mono text-muted-foreground flex flex-col items-center justify-center gap-2.5">
                            <span>No quests created yet for <strong className="text-primary uppercase tracking-wider">{skillTitle}</strong>.</span>
                            <button
                              onClick={() => openAddQuestModal(skillTitle)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-primary/50 bg-primary/15 px-3.5 py-1.5 text-primary hover:bg-primary/30 transition text-xs font-mono uppercase tracking-wider"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              <span>Add First Quest</span>
                            </button>
                          </div>
                        ) : (
                          skillQuests.map((quest) => (
                          <div
                            key={quest.id}
                            className={cn(
                              "group flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition shadow-sm",
                              quest.done
                                ? "border-xp/40 bg-xp/5 opacity-85"
                                : "border-border/70 bg-background/60 hover:border-primary/50 hover:bg-background/90",
                            )}
                          >
                            {/* Single Line Text Content */}
                            <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              <button
                                onClick={() => toggleQuestCompletion(quest.id)}
                                className={cn(
                                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition",
                                  quest.done
                                    ? "border-xp bg-xp text-background"
                                    : "border-border hover:border-primary",
                                )}
                              >
                                {quest.done && <Check className="h-3.5 w-3.5" />}
                              </button>

                              <div className="min-w-0 flex-1">
                                <span
                                  className={cn(
                                    "font-sans text-sm leading-tight font-medium text-foreground block truncate",
                                    quest.done && "line-through text-muted-foreground",
                                  )}
                                  title={quest.text}
                                >
                                  {quest.text}
                                </span>
                              </div>
                            </div>

                            {/* Difficulty, Rewards & Actions */}
                            <div className="flex items-center gap-3 shrink-0">
                              <span
                                className={cn(
                                  "rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider font-medium",
                                  quest.difficulty === "Easy" &&
                                    "bg-cyan/15 text-cyan border border-cyan/30",
                                  quest.difficulty === "Medium" &&
                                    "bg-gold/15 text-gold border border-gold/30",
                                  quest.difficulty === "Epic" &&
                                    "bg-magenta/15 text-magenta border border-magenta/30",
                                )}
                              >
                                {quest.difficulty}
                              </span>

                              <div className="flex items-center gap-2 font-mono text-xs text-gold">
                                <Zap className="h-3.5 w-3.5" />
                                <span>+{quest.xp} XP</span>
                                <span>•</span>
                                <Coins className="h-3.5 w-3.5" />
                                <span>+{quest.gold}g</span>
                              </div>

                              {/* Edit & Delete controls */}
                              <div className="flex items-center gap-1 border-l border-border/50 pl-2">
                                <button
                                  onClick={() => openEditQuestModal(quest)}
                                  className="p-1 text-muted-foreground hover:text-primary transition rounded hover:bg-primary/10"
                                  title="Edit quest"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteQuest(quest.id)}
                                  className="p-1 text-muted-foreground hover:text-destructive transition rounded hover:bg-destructive/10"
                                  title="Delete quest"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>

                              <button
                                onClick={() => toggleQuestCompletion(quest.id)}
                                className={cn(
                                  "rounded-lg px-3.5 py-1.5 font-mono text-xs font-semibold transition shadow-sm",
                                  quest.done
                                    ? "bg-xp/20 text-xp border border-xp/40 hover:bg-xp/30"
                                    : "bg-primary/15 text-primary border border-primary/40 hover:bg-primary/25",
                                )}
                              >
                                {quest.done ? "Completed ✓" : "Complete"}
                              </button>
                            </div>
                          </div>
                        )))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>

      {/* Quest Editor Modal (Add / Edit) */}
      {editingQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md p-4">
          <div className="rune-frame w-full max-w-lg rounded-2xl bg-card p-6 border border-primary/50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
              <h3 className="font-display text-lg uppercase tracking-wider text-primary">
                {isNewQuest ? "NEW QUEST" : "EDIT QUEST"}
              </h3>
              <button
                onClick={() => setEditingQuest(null)}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                  SKILL
                </label>
                <select
                  value={formSkillTitle}
                  onChange={(e) => setFormSkillTitle(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  {availableSkills.map((sk) => (
                    <option key={sk} value={sk}>
                      {sk}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                  QUEST TEXT (SINGLE LINE)
                </label>
                <textarea
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  placeholder="Enter quest description..."
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                    DIFFICULTY
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) =>
                      setFormDifficulty(e.target.value as "Easy" | "Medium" | "Epic")
                    }
                    className="w-full rounded-lg border border-border bg-background px-2 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Epic">Epic</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                    XP REWARD
                  </label>
                  <input
                    type="number"
                    value={formXp}
                    onChange={(e) => setFormXp(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                    GOLD REWARD
                  </label>
                  <input
                    type="number"
                    value={formGold}
                    onChange={(e) => setFormGold(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-border/40 pt-4">
              <button
                onClick={() => setEditingQuest(null)}
                className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuest}
                className="rounded-lg bg-primary px-5 py-2 text-xs font-semibold text-background hover:brightness-110 shadow-md"
              >
                Save Quest
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
