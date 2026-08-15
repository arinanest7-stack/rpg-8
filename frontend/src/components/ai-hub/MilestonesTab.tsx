import { useState } from "react";
import { ContainerData, TopicData, StepData } from "@/hooks/useStudyStore";
import { generateCommand3Prompt, parseMilestoneInput } from "@/lib/promptPipeline";
import { CheckCircle2, ChevronDown, Copy, Coins, Zap, Sparkles, BookOpen } from "lucide-react";

interface MilestonesTabProps {
  containers: ContainerData[];
  selectedContainerId: string;
  selectedTopicId: string;
  setSelectedTopicId: (id: string) => void;
  onBulkMilestone: (
    containerId: string,
    topicId: string,
    milestoneData: {
      title: string;
      theory: string;
      exercise: string;
      xpReward: number;
      goldReward: number;
    }
  ) => boolean;
  skillName: string;
  skillDescription: string;
}

export function MilestonesTab({
  containers,
  selectedContainerId,
  selectedTopicId,
  setSelectedTopicId,
  onBulkMilestone,
  skillName,
  skillDescription,
}: MilestonesTabProps) {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(1);
  const [pasteText, setPasteText] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copiedPromptMsg, setCopiedPromptMsg] = useState<string | null>(null);

  const currentContainer = containers.find((c) => c.id === selectedContainerId) || containers[0];

  // Flatten all topics across sections for topic picker
  const allTopics: { topic: TopicData; sectionTitle: string }[] = [];
  if (currentContainer) {
    currentContainer.sections.forEach((sec) => {
      sec.topics.forEach((t) => {
        allTopics.push({ topic: t, sectionTitle: sec.title });
      });
    });
  }

  const activeTopicObj = allTopics.find((t) => t.topic.id === selectedTopicId)?.topic || allTopics[0]?.topic;
  const currentTopicSteps: StepData[] = activeTopicObj?.steps || [];

  // Determine current created milestone context (last created milestone title/theory summary)
  const currentCreatedMilestoneContext =
    currentTopicSteps.length > 0
      ? currentTopicSteps.map((s, idx) => `Milestone ${idx + 1}: ${s.title}`).join(" -> ")
      : "No previous milestones created yet for this topic.";

  const handleGenerateNextOne = () => {
    if (!activeTopicObj) {
      setCopiedPromptMsg("Please select a topic first.");
      return;
    }

    const nextIndex = currentTopicSteps.length + 1;
    const promptText = generateCommand3Prompt(
      skillName || currentContainer?.title || "Current Skill",
      skillDescription || "Pedagogical skill scope",
      activeTopicObj.title,
      nextIndex,
      5,
      currentCreatedMilestoneContext
    );

    navigator.clipboard.writeText(promptText);
    setSelectedMilestoneIndex(nextIndex);
    setCopiedPromptMsg(`Prompt for Milestone ${nextIndex} copied to clipboard!`);
    setTimeout(() => setCopiedPromptMsg(null), 3500);
  };

  const handleBulk = () => {
    if (!selectedTopicId || !pasteText.trim()) {
      setStatusMsg("Please choose a topic and paste milestone content.");
      return;
    }

    const parsed = parseMilestoneInput(pasteText);
    // Explicitly enforce 10 XP and 2 Gold rewards per user instruction!
    parsed.xpReward = 10;
    parsed.goldReward = 2;

    const success = onBulkMilestone(selectedContainerId, selectedTopicId, parsed);
    if (success) {
      setStatusMsg(`Successfully added milestone "${parsed.title}" (+10 XP, +2 Gold)!`);
      setPasteText("");
      setTimeout(() => setStatusMsg(null), 3000);
    } else {
      setStatusMsg("Failed to add milestone. Please check your topic selection.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Selector Toolbar (Matching Wireframe 2) */}
      <div className="flex flex-wrap items-center gap-4">
        {/* CHOOSE TOPIC Dropdown */}
        <div className="relative">
          <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Choose Topic
          </label>
          <select
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            className="appearance-none rounded-xl border border-primary/40 bg-[#c8aa6e]/20 px-5 py-2.5 pr-10 font-display text-xs uppercase tracking-[0.2em] text-primary shadow-[0_0_12px_rgba(200,170,110,0.2)] focus:border-primary focus:outline-none cursor-pointer"
          >
            {allTopics.length === 0 ? (
              <option value="">No Topics Created</option>
            ) : (
              allTopics.map((t) => (
                <option key={t.topic.id} value={t.topic.id} className="bg-[#0b1811] text-foreground">
                  {t.sectionTitle.toUpperCase()} • {t.topic.title.toUpperCase()}
                </option>
              ))
            )}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 text-primary" />
        </div>

        {/* CHOOSE MILESTONE Dropdown */}
        <div className="relative">
          <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Choose Milestone Index
          </label>
          <select
            value={selectedMilestoneIndex}
            onChange={(e) => setSelectedMilestoneIndex(Number(e.target.value))}
            className="appearance-none rounded-xl border border-primary/40 bg-[#c8aa6e]/20 px-5 py-2.5 pr-10 font-display text-xs uppercase tracking-[0.2em] text-primary shadow-[0_0_12px_rgba(200,170,110,0.2)] focus:border-primary focus:outline-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <option key={num} value={num} className="bg-[#0b1811] text-foreground">
                MILESTONE {num} {num <= currentTopicSteps.length ? "(Already Created)" : "(Next)"}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 text-primary" />
        </div>

        {/* GENERATE NEXT ONE Button (Matching Wireframe 2) */}
        <div className="flex flex-col justify-end">
          <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-transparent mb-1">
            Action
          </label>
          <button
            onClick={handleGenerateNextOne}
            className="flex items-center gap-2 rounded-xl border border-primary/60 bg-[linear-gradient(180deg,rgba(200,170,110,0.3)_0%,rgba(200,170,110,0.1)_100%)] px-5 py-2.5 font-display text-xs font-bold uppercase tracking-[0.2em] text-primary shadow-[0_0_15px_rgba(200,170,110,0.25)] transition hover:scale-105 hover:bg-primary/25"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span>GENERATE NEXT ONE</span>
          </button>
        </div>
      </div>

      {copiedPromptMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-2 text-xs font-mono text-accent shadow-md">
          <Copy className="h-4 w-4" />
          <span>{copiedPromptMsg}</span>
        </div>
      )}

      {/* Main Textarea: PAST HERE (Matching Wireframe 2) */}
      <div className="relative rounded-2xl border border-primary/30 bg-[#121c17] p-4 shadow-2xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 border-b border-primary/20 pb-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            PAST HERE (Paste Milestone Theory & Practical Exercise JSON / Markdown)
          </span>

          {/* Reward Tag Indicator (10 XP | 2 Gold) */}
          <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-black/60 px-3 py-1 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-accent font-semibold">
              <Zap className="h-3 w-3 text-accent" /> +10 XP
            </span>
            <span className="flex items-center gap-1 text-primary font-semibold">
              <Coins className="h-3 w-3 text-primary" /> +2 Gold
            </span>
          </div>
        </div>

        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder={`PAST HERE

Example JSON:
{
  "title": "Subjunctive Verb Stems",
  "theory": "📚 **In-Depth Theory & Real-World Analogy**\\n\\nThink of verb stems as musical notes...",
  "exercise": "🛠️ **Step-by-Step Practical Exercise**\\n\\n1. Write 3 sentences in the present subjunctive.\\n2. Conjugate irregular verbs."
}

Or raw text:
Title: Subjunctive Verb Stems
📚 In-Depth Theory & Real-World Analogy:
(Theory content...)

🛠️ Step-by-Step Practical Exercise:
(Exercise steps...)`}
          rows={10}
          className="w-full rounded-xl border border-primary/20 bg-black/80 p-4 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
        />

        {statusMsg && (
          <div className="mt-3 flex items-center gap-2 text-xs font-mono text-accent">
            <CheckCircle2 className="h-4 w-4" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Action Button: BULK (Matching Wireframe 2) */}
      <div>
        <button
          onClick={handleBulk}
          className="rounded-xl border border-primary/60 bg-[linear-gradient(180deg,rgba(200,170,110,0.35)_0%,rgba(200,170,110,0.15)_100%)] px-8 py-3 font-display text-sm font-bold uppercase tracking-[0.25em] text-primary shadow-[0_0_20px_rgba(200,170,110,0.3)] transition hover:scale-105 hover:bg-primary/30"
        >
          BULK
        </button>
      </div>
    </div>
  );
}
