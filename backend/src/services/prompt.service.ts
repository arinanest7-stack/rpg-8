import { Command1RequestDto, Command2RequestDto, Command3RequestDto } from '../dtos/prompt.dto';

export class PromptService {
  /**
   * Generates Command 1 System Prompt for Skill & 3 Sections
   */
  public generateCommand1Prompt(dto: Command1RequestDto): string {
    const mastered = dto.masteredSkills?.trim() || 'None specified';
    const skill = dto.skillName.trim();
    const desc = dto.skillDescription.trim();

    return `You are a master curriculum strategist and skill path designer.

USER INPUT:
- Mastered Skills: ${mastered}
- Current Skill to Learn: ${skill}
- Skill Description & Purpose: ${desc}

INSTRUCTIONS:
1. Simulate researching professional training materials — including books, online courses, university syllabi, industry job role expectations, and professional learning roadmaps for this skill.
2. Assume the user takes this skill seriously — they want to deeply understand, practice, and eventually achieve mastery.
3. Analyze the user's previously mastered skills to build upon known concepts without duplication.
4. Divide "${skill}" into EXACTLY 3 progressive, high-impact Sections.
5. Keep in mind that all downstream milestones will be bite-sized (~5 minutes each).

For each Section, provide:
- title: Short, impactful title (3–5 words).
- target: Inspiring target outcome (visible in the user's Journey).
- detailedOverviewAndScope: Deep scope breakdown (used internally for topic & milestone generation).

OUTPUT FORMAT (Strict JSON):
{
  "skillName": "${skill}",
  "skillDescription": "${desc}",
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
   * Generates Command 2 System Prompt for Bulk Topics Generator
   */
  public generateCommand2Prompt(dto: Command2RequestDto): string {
    return `You are a curriculum editor generating topic titles.

SECTION CONTEXT:
- Skill: ${dto.skillName.trim()}
- Section Title: ${dto.sectionTitle.trim()}
- Target: ${dto.sectionTarget.trim()}
- Scope: ${dto.sectionScope.trim()}

INSTRUCTIONS:
1. Divide this Section into a dynamic list of topics (between 4 and 9 topics max).
2. Each topic title must be short and punchy (1 to 4 words max).
3. Note: Each topic will eventually consist of 4 to 7 short, ~5-minute achievable milestones.

OUTPUT FORMAT (Strict JSON):
{
  "sectionTitle": "${dto.sectionTitle.trim()}",
  "topics": [
    { "id": "topic-1", "title": "Short Topic Title" },
    { "id": "topic-2", "title": "Short Topic Title" }
  ]
}`;
  }

  /**
   * Generates Command 3 System Prompt for Sequential Milestone Generator
   */
  public generateCommand3Prompt(dto: Command3RequestDto): string {
    const total = dto.totalMilestones || 5;
    const context = dto.currentMilestoneContext?.trim() || 'Initial milestone in this topic';

    return `You are an interactive tutor generating a single, bite-sized milestone.

CONTEXT:
- Skill: ${dto.skillName.trim()}
- Section Scope: ${dto.sectionScope.trim()}
- Topic: ${dto.topicTitle.trim()}
- Currently Created Milestone Context: ${context}
- Target Milestone Index: Milestone ${dto.milestoneIndex} of ${total}

REQUIREMENTS:
1. The milestone MUST be achievable in ~5 minutes (concise, focused).
2. Structure the milestone content with:
   - 📚 Theory: In-Depth Theory & Real-World Analogy
   - 🛠️ Exercise: Step-by-Step Practical Exercise

OUTPUT FORMAT (Strict JSON):
{
  "topicTitle": "${dto.topicTitle.trim()}",
  "milestoneIndex": ${dto.milestoneIndex},
  "title": "Milestone Action Title",
  "reward": { "xp": 10, "gold": 2 },
  "theory": "📚 **In-Depth Theory & Real-World Analogy**\\n\\nConcise theory with real-world analogy...",
  "exercise": "🛠️ **Step-by-Step Practical Exercise**\\n\\n1. Step one...\\n2. Step two..."
}`;
  }
}
