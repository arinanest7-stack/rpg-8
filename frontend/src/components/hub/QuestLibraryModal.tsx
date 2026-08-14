import { useState, useMemo } from "react";
import {
  X,
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
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";
import { useStudyStore } from "@/hooks/useStudyStore";
import { cn } from "@/lib/utils";

export interface Quest {
  id: string;
  skillTitle: string;
  text: string;
  difficulty: "Easy" | "Medium" | "Epic";
  xp: number;
  gold: number;
  done: boolean;
}

const DEFAULT_QUEST_DATABASE: Quest[] = [
  {
    id: "q-1",
    skillTitle: "Lectura i Comprensió",
    text: "Anàlisi de Textos Argumentatius — Identifica la tesi central i 3 arguments secundaris en un text d'opinió.",
    difficulty: "Medium",
    xp: 25,
    gold: 10,
    done: false,
  },
  {
    id: "q-2",
    skillTitle: "Lectura i Comprensió",
    text: "Vocabulari en Context — Dedueix el significat de 5 paraules desconegudes segons el context de la lectura.",
    difficulty: "Easy",
    xp: 15,
    gold: 5,
    done: true,
  },
  {
    id: "q-3",
    skillTitle: "Lectura i Comprensió",
    text: "Síntesi de Capítol — Escriu un resum de 4 línies del primer capítol de lectura.",
    difficulty: "Medium",
    xp: 20,
    gold: 10,
    done: false,
  },
  {
    id: "q-4",
    skillTitle: "Gramàtica Avançada",
    text: "Domini del Subjuntiu — Completa 10 frases utilitzant correctament les formes del subjuntiu.",
    difficulty: "Medium",
    xp: 30,
    gold: 15,
    done: false,
  },
  {
    id: "q-5",
    skillTitle: "Gramàtica Avançada",
    text: "Pronoms Febles Complexes — Resol 5 exercicis de combinació de dos pronoms febles sense errors.",
    difficulty: "Epic",
    xp: 50,
    gold: 25,
    done: false,
  },
  {
    id: "q-6",
    skillTitle: "Vocabulari & Ortoepia",
    text: "Accentuar Dialectes — Revisa les regles d'accentuació oberta i tancada en el vocabulari central.",
    difficulty: "Easy",
    xp: 15,
    gold: 5,
    done: true,
  },
  {
    id: "q-7",
    skillTitle: "Vocabulari & Ortoepia",
    text: "Connectors Textuals — Classifica 15 connectors segons la seua funció (oposició, causa, conseqüència).",
    difficulty: "Medium",
    xp: 25,
    gold: 10,
    done: false,
  },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function QuestLibraryModal({ isOpen, onClose }: Props) {
  const { containers, setStats } = useStudyStore();
  const [quests, setQuests] = useState<Quest[]>(DEFAULT_QUEST_DATABASE);
  const [search, setSearch] = useState("");
  const [collapsedSkills, setCollapsedSkills] = useState<Record<string, boolean>>({});

  // Quest Edit / Add Modal state
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);
  const [isNewQuest, setIsNewQuest] = useState(false);
  const [formSkillTitle, setFormSkillTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [formDifficulty, setFormDifficulty] = useState<"Easy" | "Medium" | "Epic">("Medium");
  const [formXp, setFormXp] = useState(25);
  const [formGold, setFormGold] = useState(10);

  const availableSkills = useMemo(() => {
    const skillsSet = new Set<string>();
    containers.forEach((c) => {
      c.topics.forEach((t) => skillsSet.add(t.title));
      c.sections.forEach((s) => {
        skillsSet.add(s.title);
        s.topics.forEach((t) => skillsSet.add(t.title));
      });
    });
    quests.forEach((q) => skillsSet.add(q.skillTitle));
    if (skillsSet.size === 0) {
      skillsSet.add("Lectura i Comprensió");
      skillsSet.add("Gramàtica Avançada");
      skillsSet.add("Vocabulari & Ortoepia");
    }
    return Array.from(skillsSet);
  }, [containers, quests]);

  if (!isOpen) return null;

  const filteredQuests = quests.filter(
    (q) =>
      q.text.toLowerCase().includes(search.toLowerCase()) ||
      q.skillTitle.toLowerCase().includes(search.toLowerCase()),
  );

  const skillsGrouped = filteredQuests.reduce<Record<string, Quest[]>>((acc, quest) => {
    if (!acc[quest.skillTitle]) acc[quest.skillTitle] = [];
    acc[quest.skillTitle].push(quest);
    return acc;
  }, {});

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
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const nextDone = !q.done;
          if (nextDone) {
            setStats((st) => {
              const nextXp = st.xp + q.xp;
              const leveledUp = nextXp >= st.xpMax;
              return {
                ...st,
                xp: leveledUp ? nextXp - st.xpMax : nextXp,
                level: leveledUp ? st.level + 1 : st.level,
                gold: st.gold + q.gold,
              };
            });
          }
          return { ...q, done: nextDone };
        }
        return q;
      }),
    );
  };

  const openAddQuestModal = (defaultSkill?: string) => {
    const targetSkill = defaultSkill || availableSkills[0] || "Lectura i Comprensió";
    setIsNewQuest(true);
    setFormSkillTitle(targetSkill);
    setFormText("");
    setFormDifficulty("Medium");
    setFormXp(25);
    setFormGold(10);
    setEditingQuest({
      id: Math.random().toString(36).slice(2, 10),
      skillTitle: targetSkill,
      text: "",
      difficulty: "Medium",
      xp: 25,
      gold: 10,
      done: false,
    });
  };

  const openEditQuestModal = (quest: Quest) => {
    setIsNewQuest(false);
    setFormSkillTitle(quest.skillTitle);
    setFormText(quest.text);
    setFormDifficulty(quest.difficulty);
    setFormXp(quest.xp);
    setFormGold(quest.gold);
    setEditingQuest(quest);
  };

  const handleSaveQuest = () => {
    if (!editingQuest || !formText.trim()) return;

    const updated: Quest = {
      ...editingQuest,
      skillTitle: formSkillTitle.trim() || "General",
      text: formText.trim(),
      difficulty: formDifficulty,
      xp: Number(formXp) || 25,
      gold: Number(formGold) || 10,
    };

    if (isNewQuest) {
      setQuests((prev) => [updated, ...prev]);
    } else {
      setQuests((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    }

    setEditingQuest(null);
  };

  const handleDeleteQuest = (questId: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== questId));
  };

  const totalQuests = quests.length;
  const completedCount = quests.filter((q) => q.done).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-3 md:p-6 overflow-hidden">
      <div className="rune-frame relative flex w-full max-w-7xl h-[94vh] flex-col rounded-2xl bg-card border border-primary/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-6 py-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-magenta/40 bg-magenta/15 text-magenta shadow-inner">
              <Library className="h-6 w-6" />
            </div>
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-magenta">
                Quest Database • Modal View
              </div>
              <h2 className="font-display text-2xl uppercase tracking-[0.14em] text-foreground">
                Quest Library & Skill Database
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => openAddQuestModal()}
              className="flex items-center gap-1.5 rounded-xl border border-primary/50 bg-primary/20 px-4 py-2 font-mono text-xs font-semibold text-primary shadow-sm hover:bg-primary/30 transition"
            >
              <Plus className="h-4 w-4" />
              <span>New Quest</span>
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 font-mono text-xs text-gold shadow-sm">
              <Award className="h-4 w-4" />
              <span className="font-semibold">{completedCount}/{totalQuests} Completed</span>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl border border-border p-2.5 text-muted-foreground transition hover:border-destructive hover:bg-destructive/10 hover:text-destructive"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Toolbar Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/40 bg-background/50 px-6 py-3.5">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quests by text or skill..."
              className="w-full rounded-xl border border-border/70 bg-background/90 px-10 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={expandAll}
              className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/70 px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-primary hover:text-primary transition"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>Expand All</span>
            </button>
            <button
              onClick={collapseAll}
              className="flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/70 px-3 py-1.5 font-mono text-xs text-muted-foreground hover:border-primary hover:text-primary transition"
            >
              <Minimize2 className="h-3.5 w-3.5" />
              <span>Collapse All</span>
            </button>
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col gap-6">
          {Object.keys(skillsGrouped).length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 p-12 text-center text-sm text-muted-foreground">
              No quests found matching your filter.
            </div>
          ) : (
            Object.entries(skillsGrouped).map(([skillTitle, skillQuests]) => {
              const isCollapsed = Boolean(collapsedSkills[skillTitle]);
              const doneSkillCount = skillQuests.filter((q) => q.done).length;

              return (
                <div
                  key={skillTitle}
                  className="rounded-2xl border border-border/70 bg-background/40 overflow-hidden shadow-md transition"
                >
                  {/* Skill Group Header Toggle */}
                  <div
                    onClick={() => toggleSkillCollapse(skillTitle)}
                    className="flex items-center justify-between gap-4 bg-background/70 px-6 py-4 cursor-pointer hover:bg-background/90 transition select-none"
                  >
                    <div className="flex items-center gap-3.5">
                      <button className="flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary">
                        {isCollapsed ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronUp className="h-4 w-4" />
                        )}
                      </button>
                      <h3 className="font-display text-lg font-semibold uppercase tracking-wider text-primary">
                        {skillTitle}
                      </h3>
                      <span className="rounded-full bg-primary/10 border border-primary/30 px-2.5 py-0.5 font-mono text-[10px] text-primary">
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
                      <div className="h-2 w-28 overflow-hidden rounded-full bg-background/80 border border-border/40">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,var(--accent),var(--primary))] transition-all"
                          style={{
                            width: `${(doneSkillCount / skillQuests.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Quests List under Skill - Unified Single Line */}
                  {!isCollapsed && (
                    <div className="p-4 flex flex-col gap-3 border-t border-border/40 bg-background/20">
                      {skillQuests.map((quest) => (
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
                                quest.difficulty === "Easy" && "bg-cyan/15 text-cyan border border-cyan/30",
                                quest.difficulty === "Medium" && "bg-gold/15 text-gold border border-gold/30",
                                quest.difficulty === "Epic" && "bg-magenta/15 text-magenta border border-magenta/30",
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
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quest Editor Modal */}
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
                  placeholder="Enter quest text..."
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
