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
  topics: TopicData[];
}

export interface ContainerData {
  id: string;
  title: string;
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
}

const STORAGE_KEY_CONTAINERS = "study_realm_containers_v4";
const STORAGE_KEY_TEMPLATES = "study_realm_custom_templates_v4";
const STORAGE_KEY_STATS = "study_realm_character_stats_v4";

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
    mode: "with_sections",
    sections: [
      {
        id: "sec-1",
        title: "Reading & Comprehension",
        topics: [
          {
            id: "top-1",
            title: "Text Analysis",
            status: "sent",
            steps: createDefaultSteps(),
          },
        ],
      },
      {
        id: "sec-2",
        title: "Advanced Grammar",
        topics: [
          {
            id: "top-2",
            title: "Verb Conjugations",
            status: "not_sent",
            steps: [
              {
                id: uid(),
                title: "Theory Notes",
                desc: "Subjunctive vs Indicative rules",
                done: false,
                xpReward: 25,
                goldReward: 5,
                blocks: [],
              },
              {
                id: uid(),
                title: "Guided Exercises",
                desc: "Verb conjugation practice",
                done: false,
                xpReward: 25,
                goldReward: 5,
                blocks: [],
              },
            ],
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
    stats,
    setStats,
    updateStep,
    completeStep,
    saveCustomTemplate,
    deleteCustomTemplate,
    allTemplates,
    customTemplates,
  };
}
