export type SectionBlockType = "theory" | "exercise_description" | "exercise_solution" | "custom";

export type ContentElementType =
  | "text"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "bullet_list"
  | "numbered_list"
  | "todolist"
  | "image"
  | "file";

export interface ContentElement {
  id: string;
  type: ContentElementType;
  content: string;
  checked?: boolean;
  caption?: string;
  fileUrl?: string;
}

export interface SectionBlock {
  id: string;
  title: string;
  type: SectionBlockType;
  elements: ContentElement[];
}

export interface StepData {
  id: string;
  title: string;
  desc: string;
  done: boolean;
  xpReward: number;
  goldReward: number;
  blocks: SectionBlock[];
  studentNotes?: string;
}

export interface StepTemplate {
  id: string;
  name: string;
  description: string;
  blocks: SectionBlock[];
  isBuiltIn?: boolean;
}

export const uid = () => Math.random().toString(36).slice(2, 10);

export const BUILT_IN_TEMPLATES: StepTemplate[] = [
  {
    id: "tpl-theory",
    name: "Theory & Synthesis",
    description: "Structure key concepts, formulas, and fundamental study rules.",
    isBuiltIn: true,
    blocks: [
      {
        id: uid(),
        title: "Theory Notes & Synthesis",
        type: "theory",
        elements: [
          { id: uid(), type: "h1", content: "Core Rules & Principles" },
          {
            id: uid(),
            type: "text",
            content: "Synthesize the main grammar rules, formulas, and essential conditions for this topic.",
          },
          {
            id: uid(),
            type: "bullet_list",
            content: "Rule 1: Always verify grammatical agreements and accentuation rules.",
          },
          {
            id: uid(),
            type: "bullet_list",
            content: "Rule 2: Review irregular forms and special exception cases.",
          },
        ],
      },
      {
        id: uid(),
        title: "Key Takeaways Checklist",
        type: "theory",
        elements: [
          { id: uid(), type: "todolist", content: "Memorized core rules", checked: false },
          { id: uid(), type: "todolist", content: "Understood key formula steps", checked: false },
        ],
      },
    ],
  },
  {
    id: "tpl-breakdown",
    name: "Exercise Breakdown",
    description: "Detailed problem statement, step-by-step resolution, and key takeaways.",
    isBuiltIn: true,
    blocks: [
      {
        id: uid(),
        title: "Exercise Statement",
        type: "exercise_description",
        elements: [
          { id: uid(), type: "h2", content: "Problem Statement" },
          {
            id: uid(),
            type: "text",
            content: "Read the provided passage carefully and extract the main argument.",
          },
          { id: uid(), type: "todolist", content: "Highlight 3 central thesis points", checked: false },
          { id: uid(), type: "todolist", content: "Draft a concise 2-sentence summary", checked: false },
        ],
      },
      {
        id: uid(),
        title: "Step-by-Step Resolution Key",
        type: "exercise_solution",
        elements: [
          { id: uid(), type: "h3", content: "Guided Resolution Steps" },
          {
            id: uid(),
            type: "numbered_list",
            content: "Step 1: Identify the context and topic sentence in paragraph 1.",
          },
          {
            id: uid(),
            type: "numbered_list",
            content: "Step 2: Note supporting evidence and key transition words.",
          },
        ],
      },
    ],
  },
  {
    id: "tpl-self-check",
    name: "Self-Assessment Checklist",
    description: "Comprehensive verification checklist with student reflection space.",
    isBuiltIn: true,
    blocks: [
      {
        id: uid(),
        title: "Self-Verification Checklist",
        type: "exercise_description",
        elements: [
          { id: uid(), type: "h2", content: "Mastery Verification" },
          { id: uid(), type: "todolist", content: "Solved exercises without looking at solution keys", checked: false },
          { id: uid(), type: "todolist", content: "Time taken under 15 minutes", checked: false },
          { id: uid(), type: "todolist", content: "Reviewed and corrected mistakes cleanly", checked: false },
        ],
      },
    ],
  },
];
