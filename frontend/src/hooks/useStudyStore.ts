import { useState, useEffect, useCallback } from "react";
import {
  StepData,
  StepTemplate,
  BUILT_IN_TEMPLATES,
  SectionBlock,
  uid,
} from "@/lib/templates";

export type { StepData, StepTemplate, SectionBlock } from "@/lib/templates";


export interface TopicData {
  id: string;
  title: string;
  status: "not_sent" | "sent" | "done";
  steps: StepData[];
}

export interface SectionData {
  id: string;
  title: string;
  target?: string;
  detailedOverviewAndScope?: string;
  topics: TopicData[];
}

export interface ContainerData {
  id: string;
  title: string;
  description?: string;
  mode: "with_sections" | "simple";
  sections: SectionData[];
  topics: TopicData[];
}

export interface CharacterStats {
  level: number;
  xp: number;
  xpMax: number;
  gold: number;
  streak: number;
  avatarUrl?: string;
}

export interface CharacterAppearanceTraits {
  gender?: string;
  age?: string;
  hair?: string;
  hairColour?: string;
  eyeColour?: string;
  clothStyle?: string;
  clothColour?: string;
}

export interface CharacterPersonalityTraits {
  temperament?: string;
  voice?: string;
  motivation?: string;
  flaw?: string;
  companion?: string;
  aura?: string;
}

export interface QuestItem {
  id: string;
  containerId: string;
  skillTitle: string;
  text: string;
  difficulty: "Easy" | "Medium" | "Epic";
  xp: number;
  gold: number;
  done: boolean;
}

const STORAGE_KEY_CONTAINERS = "study_realm_containers_v4";
const STORAGE_KEY_TEMPLATES = "study_realm_custom_templates_v4";
const STORAGE_KEY_STATS = "study_realm_character_stats_v4";
const STORAGE_KEY_AVATAR = "study_realm_character_avatar_v1";
const STORAGE_KEY_APPEARANCE = "study_realm_character_appearance_v1";
const STORAGE_KEY_PERSONALITY = "study_realm_character_personality_v1";
const STORAGE_KEY_QUESTS = "study_realm_user_quests_v1";

export const defaultAppearance: CharacterAppearanceTraits = {
  gender: "Female",
  age: "Young adult",
  hair: "Long & flowing",
  hairColour: "Silver",
  eyeColour: "Emerald",
  clothStyle: "Ranger cloak",
  clothColour: "Forest green",
};

export const defaultPersonality: CharacterPersonalityTraits = {
  temperament: "Calm",
  voice: "Warm",
  motivation: "Curiosity",
  flaw: "Secretive",
  companion: "Owl",
  aura: "Moonlit",
};

function safeParseJSON<T>(val: string | null, fallback: T): T {
  if (!val) return fallback;
  try {
    const parsed = JSON.parse(val);
    if (parsed && typeof parsed === "object") {
      return { ...fallback, ...parsed };
    }
    return fallback;
  } catch {
    return fallback;
  }
}

const createDefaultSteps = (): StepData[] => [
  {
    id: "step-1",
    title: "Theory Notes",
    desc: "Synthesize key formulas & conditions",
    done: true,
    xpReward: 25,
    goldReward: 5,
    blocks: BUILT_IN_TEMPLATES[0].blocks,
  },
  {
    id: "step-2",
    title: "Breakdown Solutions",
    desc: "Deconstruct 2–3 past exam keys step-by-step",
    done: true,
    xpReward: 25,
    goldReward: 5,
    blocks: BUILT_IN_TEMPLATES[1].blocks,
  },
  {
    id: "step-3",
    title: "Guided Exercises",
    desc: "Solve exercises while reviewing reference notes",
    done: false,
    xpReward: 25,
    goldReward: 5,
    blocks: [
      {
        id: uid(),
        title: "Guided Practice Session",
        type: "exercise_description",
        elements: [
          { id: uid(), type: "h1", content: "Guided Practice: Text Analysis" },
          { id: uid(), type: "text", content: "Complete the exercises below using your theory notes for guidance." },
          { id: uid(), type: "todolist", content: "Identify author main thesis in Passage A", checked: true },
          { id: uid(), type: "todolist", content: "Analyze tone and rhetorical figures in Passage B", checked: false },
        ],
      },
    ],
  },
  {
    id: "step-4",
    title: "Solo Exercises",
    desc: "Solve exercises independently without looking at solutions",
    done: false,
    xpReward: 25,
    goldReward: 5,
    blocks: [],
  },
  {
    id: "step-5",
    title: "All-In-One Note",
    desc: "Create a 1-page summary with theory + algorithm",
    done: false,
    xpReward: 35,
    goldReward: 10,
    blocks: [],
  },
];

const defaultContainers: ContainerData[] = [
  {
    id: "c-1",
    title: "Valenciano — Core",
    description: "Master language basics and comprehension",
    mode: "with_sections",
    sections: [
      {
        id: "sec-1",
        title: "Reading & Comprehension",
        target: "Understand key texts and grammar",
        detailedOverviewAndScope: "Core reading and syntax rules",
        topics: [
          {
            id: "top-1",
            title: "Text Analysis",
            status: "sent",
            steps: createDefaultSteps(),
          },
        ],
      },
    ],
    topics: [],
  },
];

const defaultStats: CharacterStats = {
  level: 2,
  xp: 45,
  xpMax: 100,
  gold: 50,
  streak: 3,
};

export function useStudyStore() {
  const [containers, setContainers] = useState<ContainerData[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONTAINERS);
      return saved ? JSON.parse(saved) : defaultContainers;
    } catch {
      return defaultContainers;
    }
  });

  const [customTemplates, setCustomTemplates] = useState<StepTemplate[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEMPLATES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState<CharacterStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_STATS);
      return saved ? JSON.parse(saved) : defaultStats;
    } catch {
      return defaultStats;
    }
  });

  const [quests, setQuests] = useState<QuestItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY_QUESTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTAINERS, JSON.stringify(containers));
    } catch (e) {
      console.error(e);
    }
  }, [containers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_TEMPLATES, JSON.stringify(customTemplates));
    } catch (e) {
      console.error(e);
    }
  }, [customTemplates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_QUESTS, JSON.stringify(quests));
    } catch (e) {
      console.error(e);
    }
  }, [quests]);

  const addQuest = useCallback(
    (
      containerId: string,
      skillTitle: string,
      text: string,
      difficulty: "Easy" | "Medium" | "Epic" = "Medium",
      customXp?: number,
      customGold?: number,
    ) => {
      const xpVal = customXp !== undefined ? customXp : difficulty === "Epic" ? 50 : difficulty === "Easy" ? 15 : 25;
      const goldVal = customGold !== undefined ? customGold : difficulty === "Epic" ? 25 : difficulty === "Easy" ? 5 : 10;

      const newQuest: QuestItem = {
        id: uid(),
        containerId,
        skillTitle,
        text,
        difficulty,
        xp: xpVal,
        gold: goldVal,
        done: false,
      };

      setQuests((prev) => [newQuest, ...prev]);
    },
    [],
  );

  const toggleQuestDone = useCallback((questId: string) => {
    let xpDelta = 0;
    let goldDelta = 0;

    setQuests((prev) =>
      prev.map((q) => {
        if (q.id === questId) {
          const newDone = !q.done;
          xpDelta = newDone ? q.xp : -q.xp;
          goldDelta = newDone ? q.gold : -q.gold;
          return { ...q, done: newDone };
        }
        return q;
      }),
    );

    setStats((prev) => {
      const rawXp = prev.xp + xpDelta;
      let nextXp = rawXp;
      let nextLevel = prev.level;
      if (rawXp >= prev.xpMax) {
        nextXp = rawXp - prev.xpMax;
        nextLevel = prev.level + 1;
      } else if (rawXp < 0) {
        nextXp = Math.max(0, prev.xpMax + rawXp);
        nextLevel = Math.max(1, prev.level - 1);
      }
      return {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        gold: Math.max(0, prev.gold + goldDelta),
      };
    });
  }, []);

  const deleteQuest = useCallback((questId: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== questId));
  }, []);

  const updateContainers = useCallback((fn: (prev: ContainerData[]) => ContainerData[]) => {
    setContainers(fn);
  }, []);

  const updateStep = useCallback((stepId: string, newStep: StepData) => {
    setContainers((prev) =>
      prev.map((c) => ({
        ...c,
        sections: c.sections.map((s) => ({
          ...s,
          topics: s.topics.map((t) => ({
            ...t,
            steps: t.steps.map((st) => (st.id === stepId ? newStep : st)),
          })),
        })),
        topics: c.topics.map((t) => ({
          ...t,
          steps: t.steps.map((st) => (st.id === stepId ? newStep : st)),
        })),
      })),
    );
  }, []);

  const completeStep = useCallback((stepId: string) => {
    let rewardedXp = 25;
    let rewardedGold = 5;

    setContainers((prev) =>
      prev.map((c) => ({
        ...c,
        sections: c.sections.map((s) => ({
          ...s,
          topics: s.topics.map((t) => ({
            ...t,
            steps: t.steps.map((st) => {
              if (st.id === stepId) {
                rewardedXp = st.xpReward || 25;
                rewardedGold = st.goldReward || 5;
                return { ...st, done: true };
              }
              return st;
            }),
          })),
        })),
        topics: c.topics.map((t) => ({
          ...t,
          steps: t.steps.map((st) => {
            if (st.id === stepId) {
              rewardedXp = st.xpReward || 25;
              rewardedGold = st.goldReward || 5;
              return { ...st, done: true };
            }
            return st;
          }),
        })),
      })),
    );

    setStats((prev) => {
      const nextXp = prev.xp + rewardedXp;
      const leveledUp = nextXp >= prev.xpMax;
      return {
        ...prev,
        xp: leveledUp ? nextXp - prev.xpMax : nextXp,
        level: leveledUp ? prev.level + 1 : prev.level,
        gold: prev.gold + rewardedGold,
      };
    });
  }, []);

  const toggleStepDone = useCallback((stepId: string) => {
    let xpDelta = 0;
    let goldDelta = 0;

    setContainers((prev) =>
      prev.map((c) => ({
        ...c,
        sections: c.sections.map((s) => ({
          ...s,
          topics: s.topics.map((t) => ({
            ...t,
            steps: t.steps.map((st) => {
              if (st.id === stepId) {
                const newDone = !st.done;
                const xpVal = st.xpReward || 25;
                const goldVal = st.goldReward || 5;
                xpDelta = newDone ? xpVal : -xpVal;
                goldDelta = newDone ? goldVal : -goldVal;
                return { ...st, done: newDone };
              }
              return st;
            }),
          })),
        })),
        topics: c.topics.map((t) => ({
          ...t,
          steps: t.steps.map((st) => {
            if (st.id === stepId) {
              const newDone = !st.done;
              const xpVal = st.xpReward || 25;
              const goldVal = st.goldReward || 5;
              xpDelta = newDone ? xpVal : -xpVal;
              goldDelta = newDone ? goldVal : -goldVal;
              return { ...st, done: newDone };
            }
            return st;
          }),
        })),
      })),
    );

    setStats((prev) => {
      const rawXp = prev.xp + xpDelta;
      let nextXp = rawXp;
      let nextLevel = prev.level;
      if (rawXp >= prev.xpMax) {
        nextXp = rawXp - prev.xpMax;
        nextLevel = prev.level + 1;
      } else if (rawXp < 0) {
        nextXp = Math.max(0, prev.xpMax + rawXp);
        nextLevel = Math.max(1, prev.level - 1);
      }
      return {
        ...prev,
        xp: nextXp,
        level: nextLevel,
        gold: Math.max(0, prev.gold + goldDelta),
      };
    });
  }, []);

  const deleteStep = useCallback((stepId: string) => {
    setContainers((prev) =>
      prev.map((c) => ({
        ...c,
        sections: c.sections.map((s) => ({
          ...s,
          topics: s.topics.map((t) => ({
            ...t,
            steps: t.steps.filter((st) => st.id !== stepId),
          })),
        })),
        topics: c.topics.map((t) => ({
          ...t,
          steps: t.steps.filter((st) => st.id !== stepId),
        })),
      })),
    );
  }, []);

  const addQuestToContainer = useCallback(
    (containerId: string, title: string, desc?: string, difficulty?: "Easy" | "Medium" | "Epic") => {
      const xpVal = difficulty === "Epic" ? 50 : difficulty === "Easy" ? 15 : 25;
      const goldVal = difficulty === "Epic" ? 25 : difficulty === "Easy" ? 5 : 10;

      const newStep: StepData = {
        id: uid(),
        title,
        desc: desc || "Complete step objective",
        done: false,
        xpReward: xpVal,
        goldReward: goldVal,
        blocks: [],
      };

      setContainers((prev) =>
        prev.map((c) => {
          if (c.id !== containerId) return c;

          if (c.mode === "with_sections" && c.sections.length > 0) {
            const firstSec = c.sections[0];
            if (firstSec.topics.length > 0) {
              return {
                ...c,
                sections: c.sections.map((s, idx) =>
                  idx === 0
                    ? {
                        ...s,
                        topics: s.topics.map((t, tIdx) =>
                          tIdx === 0 ? { ...t, steps: [...t.steps, newStep] } : t,
                        ),
                      }
                    : s,
                ),
              };
            }
          }

          if (c.topics.length > 0) {
            return {
              ...c,
              topics: c.topics.map((t, idx) => (idx === 0 ? { ...t, steps: [...t.steps, newStep] } : t)),
            };
          }

          return {
            ...c,
            topics: [{ id: uid(), title: "Main Milestone", status: "not_sent", steps: [newStep] }],
          };
        }),
      );
    },
    [],
  );
  const [avatarUrl, setAvatarUrlState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_AVATAR) || "";
    } catch {
      return "";
    }
  });

  const [appearance, setAppearanceState] = useState<CharacterAppearanceTraits>(() => {
    if (typeof window === "undefined") return defaultAppearance;
    return safeParseJSON(localStorage.getItem(STORAGE_KEY_APPEARANCE), defaultAppearance);
  });

  const [personality, setPersonalityState] = useState<CharacterPersonalityTraits>(() => {
    if (typeof window === "undefined") return defaultPersonality;
    return safeParseJSON(localStorage.getItem(STORAGE_KEY_PERSONALITY), defaultPersonality);
  });

  // Client mount hydration for SSR safety
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedAvatar = localStorage.getItem(STORAGE_KEY_AVATAR);
        if (savedAvatar) {
          setAvatarUrlState(savedAvatar);
          setStats((prev) => ({ ...prev, avatarUrl: savedAvatar }));
        }
        const savedApp = localStorage.getItem(STORAGE_KEY_APPEARANCE);
        if (savedApp) {
          setAppearanceState(safeParseJSON(savedApp, defaultAppearance));
        }
        const savedPers = localStorage.getItem(STORAGE_KEY_PERSONALITY);
        if (savedPers) {
          setPersonalityState(safeParseJSON(savedPers, defaultPersonality));
        }
      } catch (e) {
        console.error("Hydration storage error:", e);
      }
    }
  }, []);

  useEffect(() => {
    try {
      if (avatarUrl) {
        localStorage.setItem(STORAGE_KEY_AVATAR, avatarUrl);
      } else {
        localStorage.removeItem(STORAGE_KEY_AVATAR);
      }
    } catch (e) {
      console.error(e);
    }
  }, [avatarUrl]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPEARANCE, JSON.stringify(appearance));
    } catch (e) {
      console.error(e);
    }
  }, [appearance]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PERSONALITY, JSON.stringify(personality));
    } catch (e) {
      console.error(e);
    }
  }, [personality]);

  const setAvatarUrl = useCallback((url: string) => {
    setAvatarUrlState(url);
    setStats((prev) => ({ ...prev, avatarUrl: url }));
  }, []);

  const updateAppearance = useCallback((traits: Partial<CharacterAppearanceTraits>) => {
    setAppearanceState((prev) => {
      const next = { ...prev, ...traits };
      try {
        localStorage.setItem(STORAGE_KEY_APPEARANCE, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  const updatePersonality = useCallback((traits: Partial<CharacterPersonalityTraits>) => {
    setPersonalityState((prev) => {
      const next = { ...prev, ...traits };
      try {
        localStorage.setItem(STORAGE_KEY_PERSONALITY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  }, []);

  const saveCustomTemplate = useCallback((name: string, description: string, blocks: SectionBlock[]) => {
    const newTpl: StepTemplate = {
      id: uid(),
      name,
      description,
      blocks: JSON.parse(JSON.stringify(blocks)),
      isBuiltIn: false,
    };
    setCustomTemplates((prev) => [newTpl, ...prev]);
    return newTpl;
  }, []);

  const deleteCustomTemplate = useCallback((templateId: string) => {
    setCustomTemplates((prev) => prev.filter((t) => t.id !== templateId));
  }, []);

  const allTemplates = [...BUILT_IN_TEMPLATES, ...customTemplates];

  return {
    containers,
    setContainers: updateContainers,
    quests,
    addQuest,
    toggleQuestDone,
    deleteQuest,
    stats,
    setStats,
    avatarUrl,
    setAvatarUrl,
    appearance,
    updateAppearance,
    personality,
    updatePersonality,
    updateStep,
    completeStep,
    deleteStep,
    addQuestToContainer,
    saveCustomTemplate,
    deleteCustomTemplate,
    allTemplates,
    customTemplates,
  };
}
