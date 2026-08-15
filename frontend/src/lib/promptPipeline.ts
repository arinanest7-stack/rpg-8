export interface SkillContextInput {
  masteredSkills: string;
  skillName: string;
  skillDescription: string;
}

export interface GeneratedSectionOutput {
  sectionNumber: number;
  title: string;
  target: string;
  detailedOverviewAndScope: string;
}

export interface GeneratedTopicOutput {
  id: string;
  title: string;
}

export interface GeneratedMilestoneOutput {
  topicTitle: string;
  milestoneIndex: number;
  title: string;
  theory: string;
  exercise: string;
  reward: {
    xp: number;
    gold: number;
  };
}

/**
 * Command 1: Skill & 3 Sections Prompt Generator
 */
export function generateCommand1Prompt(
  masteredSkills: string,
  skillName: string,
  skillDescription: string
): string {
  return `You are a master curriculum strategist and skill path designer.

USER INPUT:
- Mastered Skills: ${masteredSkills.trim() || "None specified"}
- Current Skill to Learn: ${skillName.trim() || "Target Skill"}
- Skill Description & Purpose: ${skillDescription.trim() || "Master core capabilities"}

INSTRUCTIONS:
1. Simulate researching professional training materials — including books, online courses, university syllabi, industry job role expectations, and professional learning roadmaps for this skill.
2. Assume the user takes this skill seriously — they want to deeply understand, practice, and eventually achieve mastery.
3. Analyze the user's previously mastered skills to build upon known concepts without duplication.
4. Divide "${skillName.trim() || "Target Skill"}" into EXACTLY 3 progressive, high-impact Sections.
5. Keep in mind that all downstream milestones will be bite-sized (~5 minutes each).

For each Section, provide:
- title: Short, impactful title (3–5 words).
- target: Inspiring target outcome (visible in the user's Journey).
- detailedOverviewAndScope: Deep scope breakdown (used internally for topic & milestone generation).

OUTPUT FORMAT (Strict JSON):
{
  "skillName": "${skillName.trim() || "Target Skill"}",
  "skillDescription": "${skillDescription.trim() || ""}",
  "sections": [
    {
      "sectionNumber": 1,
      "title": "Section Title (3-5 Words)",
      "target": "Visible journey target outcome",
      "detailedOverviewAndScope": "Pedagogical scope breakdown..."
    },
    {
      "sectionNumber": 2,
      "title": "Section Title (3-5 Words)",
      "target": "Visible journey target outcome",
      "detailedOverviewAndScope": "Pedagogical scope breakdown..."
    },
    {
      "sectionNumber": 3,
      "title": "Section Title (3-5 Words)",
      "target": "Visible journey target outcome",
      "detailedOverviewAndScope": "Pedagogical scope breakdown..."
    }
  ]
}`;
}

/**
 * Command 2: Bulk Topics Generator Prompt
 */
export function generateCommand2Prompt(
  skillName: string,
  sectionTitle: string,
  sectionTarget: string,
  sectionScope: string
): string {
  return `You are a curriculum editor generating topic titles.

SECTION CONTEXT:
- Skill: ${skillName.trim()}
- Section Title: ${sectionTitle.trim()}
- Target: ${sectionTarget.trim()}
- Scope: ${sectionScope.trim()}

INSTRUCTIONS:
1. Divide this Section into a dynamic list of topics (between 4 and 9 topics max).
2. Each topic title must be short and punchy (1 to 4 words max).
3. Note: Each topic will eventually consist of 4 to 7 short, ~5-minute achievable milestones.

OUTPUT FORMAT (Strict JSON):
{
  "sectionTitle": "${sectionTitle.trim()}",
  "topics": [
    { "id": "topic-1", "title": "Short Topic Title" },
    { "id": "topic-2", "title": "Short Topic Title" }
  ]
}`;
}

/**
 * Command 3: Sequential Milestone Generator Prompt
 */
export function generateCommand3Prompt(
  skillName: string,
  sectionScope: string,
  topicTitle: string,
  milestoneIndex: number,
  totalMilestones: number = 5,
  currentMilestoneContext: string = ""
): string {
  return `You are an interactive tutor generating a single, bite-sized milestone.

CONTEXT:
- Skill: ${skillName.trim()}
- Section Scope: ${sectionScope.trim()}
- Topic: ${topicTitle.trim()}
- Currently Created Milestone Context: ${currentMilestoneContext.trim() || "Initial milestone in this topic"}
- Target Milestone Index: Milestone ${milestoneIndex} of ${totalMilestones}

REQUIREMENTS:
1. The milestone MUST be achievable in ~5 minutes (concise, focused).
2. Structure the milestone content with:
   - 📚 Theory: In-Depth Theory & Real-World Analogy
   - 🛠️ Exercise: Step-by-Step Practical Exercise

OUTPUT FORMAT (Strict JSON):
{
  "topicTitle": "${topicTitle.trim()}",
  "milestoneIndex": ${milestoneIndex},
  "title": "Milestone Action Title",
  "reward": { "xp": 10, "gold": 2 },
  "theory": "📚 **In-Depth Theory & Real-World Analogy**\\n\\nConcise theory with real-world analogy...",
  "exercise": "🛠️ **Step-by-Step Practical Exercise**\\n\\n1. Step one...\\n2. Step two..."
}`;
}

export interface ParsedSectionInput {
  skillName: string;
  skillDescription: string;
  sections: {
    sectionNumber: number;
    title: string;
    target: string;
    detailedOverviewAndScope: string;
  }[];
}

/**
 * Parses Command 1 JSON output containing skillName, skillDescription, and 3 sections
 */
export function parseSectionsInput(rawInput: string): ParsedSectionInput | null {
  const trimmed = rawInput.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") {
      const skillName = parsed.skillName || parsed.title || "New Skill";
      const skillDescription = parsed.skillDescription || parsed.description || "";
      const rawSecs = Array.isArray(parsed.sections) ? parsed.sections : [];

      const sections = rawSecs.map((sec: any, idx: number) => ({
        sectionNumber: sec.sectionNumber || idx + 1,
        title: sec.title || `Section ${idx + 1}`,
        target: sec.target || "",
        detailedOverviewAndScope: sec.detailedOverviewAndScope || sec.scope || "",
      }));

      return {
        skillName,
        skillDescription,
        sections,
      };
    }
  } catch {
    // If not JSON, try extracting titles from markdown headers like "Section 1: ..."
    const sectionMatches = trimmed.match(/(?:Section|\d+[\.:])\s*([^\n]+)/gi);
    if (sectionMatches && sectionMatches.length > 0) {
      return {
        skillName: "New Skill",
        skillDescription: "",
        sections: sectionMatches.slice(0, 3).map((match, idx) => ({
          sectionNumber: idx + 1,
          title: match.replace(/^(?:Section\s*\d*[\:\.-]?|\d+[\.\:]\s*)/i, "").trim(),
          target: "Target outcome for section",
          detailedOverviewAndScope: "Detailed section scope",
        })),
      };
    }
  }

  return null;
}

/**
 * Parses raw text or JSON input into topic titles
 */
export function parseTopicsInput(rawInput: string): { id: string; title: string }[] {
  const trimmed = rawInput.trim();
  if (!trimmed) return [];

  // 1. Try parsing JSON
  try {
    const parsed = JSON.parse(trimmed);

    // If user pasted Command 1 JSON (which has sections instead of topics), extract section titles as topics cleanly
    if (parsed && parsed.sections && Array.isArray(parsed.sections)) {
      return parsed.sections.map((sec: any, idx: number) => ({
        id: `topic-${idx + 1}`,
        title: (sec.title || `Section ${idx + 1}`).slice(0, 50),
      }));
    }

    if (Array.isArray(parsed)) {
      return parsed.map((item, idx) => ({
        id: item.id || `topic-${idx + 1}`,
        title: (typeof item === "string" ? item : item.title || item.name || `Topic ${idx + 1}`).slice(0, 50),
      }));
    }

    if (parsed.topics && Array.isArray(parsed.topics)) {
      return parsed.topics.map((item: any, idx: number) => ({
        id: item.id || `topic-${idx + 1}`,
        title: (typeof item === "string" ? item : item.title || item.name || `Topic ${idx + 1}`).slice(0, 50),
      }));
    }

    // If it is valid JSON but has no topics array, do NOT parse JSON lines line-by-line!
    return [];
  } catch {
    // Not valid JSON, fall back to line-by-line parsing for plain text lists
  }

  // 2. Line-by-line fallback for plain text lists (filters out JSON curly braces & syntax)
  const lines = trimmed
    .split("\n")
    .map((line) => line.replace(/^[\d\.\-\*\•\s]+/, "").trim())
    .filter((line) => line.length > 0 && !line.startsWith("{") && !line.startsWith("}") && !line.startsWith('"'));

  return lines.map((title, idx) => ({
    id: `topic-${idx + 1}`,
    title: title.slice(0, 50),
  }));
}

/**
 * Parses raw text or JSON input into a Milestone / Step structure
 */
export function parseMilestoneInput(rawInput: string): {
  title: string;
  theory: string;
  exercise: string;
  xpReward: number;
  goldReward: number;
} {
  const trimmed = rawInput.trim();
  const fallback = {
    title: "New Milestone Step",
    theory: "📚 **In-Depth Theory & Real-World Analogy**\n\nUnderstand the core concept step-by-step.",
    exercise: "🛠️ **Step-by-Step Practical Exercise**\n\n1. Review the key concept above.\n2. Complete the practical application task.",
    xpReward: 10,
    goldReward: 2,
  };

  if (!trimmed) return fallback;

  // 1. Try parsing JSON
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object") {
      return {
        title: parsed.title || parsed.milestoneTitle || fallback.title,
        theory: parsed.theory || parsed.theoryNotes || fallback.theory,
        exercise: parsed.exercise || parsed.practicalExercise || fallback.exercise,
        xpReward: parsed.reward?.xp || 10,
        goldReward: parsed.reward?.gold || 2,
      };
    }
  } catch {
    // Not JSON
  }

  // 2. Markdown / Text fallback
  const titleMatch = trimmed.match(/^#+\s*(.+)$/m) || trimmed.match(/Title:\s*(.+)$/im);
  const title = titleMatch ? titleMatch[1].trim() : trimmed.split("\n")[0].slice(0, 60);

  let theory = fallback.theory;
  let exercise = fallback.exercise;

  if (trimmed.includes("Theory") || trimmed.includes("Analogy")) {
    const parts = trimmed.split(/Exercise|Practical/i);
    if (parts[0]) theory = parts[0].trim();
    if (parts[1]) exercise = `🛠️ **Step-by-Step Practical Exercise**\n\n${parts[1].trim()}`;
  } else {
    theory = `📚 **In-Depth Theory & Real-World Analogy**\n\n${trimmed}`;
  }

  return {
    title,
    theory,
    exercise,
    xpReward: 10,
    goldReward: 2,
  };
}
