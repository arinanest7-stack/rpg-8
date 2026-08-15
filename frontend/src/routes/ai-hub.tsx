import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import backdrop from "@/assets/realm-backdrop.jpg";
import { ArcaneOverlay } from "@/components/character/ArcaneOverlay";
import { TopNav } from "@/components/ui/TopNav";
import { PromptGeneratorBar } from "@/components/ai-hub/PromptGeneratorBar";
import { SectionsTab } from "@/components/ai-hub/SectionsTab";
import { TopicsTab } from "@/components/ai-hub/TopicsTab";
import { MilestonesTab } from "@/components/ai-hub/MilestonesTab";
import { useStudyStore, ContainerData } from "@/hooks/useStudyStore";
import { parseTopicsInput, parseMilestoneInput, ParsedSectionInput } from "@/lib/promptPipeline";
import { uid } from "@/lib/templates";

export const Route = createFileRoute("/ai-hub")({
  head: () => ({
    meta: [
      { title: "AI Hub — 3-Step Curriculum Importer" },
      {
        name: "description",
        content:
          "Generate and bulk import curriculum sections, topics, and 5-minute milestones into your study quest realm.",
      },
    ],
  }),
  component: AiHubPage,
});

export function AiHubPage() {
  const { containers, setContainers } = useStudyStore();
  const [activeTab, setActiveTab] = useState<"sections" | "topics" | "milestones">("sections");

  const [selectedContainerId, setSelectedContainerId] = useState<string>(
    containers[0]?.id || ""
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    containers[0]?.sections[0]?.id || ""
  );

  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    containers[0]?.sections[0]?.topics[0]?.id || ""
  );

  const [skillName, setSkillName] = useState<string>(
    containers.find((c) => c.id === selectedContainerId)?.title || "Valenciano — Core"
  );
  const [skillDescription, setSkillDescription] = useState<string>(
    containers.find((c) => c.id === selectedContainerId)?.description ||
      "Master subjunctive verbs and comprehension"
  );
  const [masteredSkills, setMasteredSkills] = useState<string>("Basic Vocabulary, General Grammar");

  const currentContainer = containers.find((c) => c.id === selectedContainerId) || containers[0];
  const currentSection = currentContainer?.sections.find((s) => s.id === selectedSectionId);

  // Bulk Sections Handler (Command 1 Output JSON)
  const handleBulkSections = (parsedData: ParsedSectionInput): boolean => {
    setSkillName(parsedData.skillName);
    setSkillDescription(parsedData.skillDescription);

    const newContainerId = uid();
    const newSections = parsedData.sections.map((sec) => ({
      id: uid(),
      title: sec.title,
      target: sec.target,
      detailedOverviewAndScope: sec.detailedOverviewAndScope,
      topics: [],
    }));

    const newContainer: ContainerData = {
      id: newContainerId,
      title: parsedData.skillName,
      description: parsedData.skillDescription,
      mode: "with_sections" as const,
      sections: newSections,
      topics: [],
    };

    setContainers((prev) => [newContainer, ...prev]);
    setSelectedContainerId(newContainerId);
    if (newSections.length > 0) {
      setSelectedSectionId(newSections[0].id);
    }
    return true;
  };

  // Bulk Topic handler
  const handleBulkTopics = (
    containerId: string,
    sectionId: string,
    rawInput: string
  ): boolean => {
    const parsedTopics = parseTopicsInput(rawInput);
    if (parsedTopics.length === 0) return false;

    setContainers((prev) =>
      prev.map((c) => {
        if (c.id !== containerId) return c;
        return {
          ...c,
          sections: c.sections.map((s) => {
            if (s.id !== sectionId) return s;
            const newTopicObjs = parsedTopics.map((t) => ({
              id: uid(),
              title: t.title,
              status: "not_sent" as const,
              steps: [],
            }));
            return {
              ...s,
              topics: [...s.topics, ...newTopicObjs],
            };
          }),
        };
      })
    );
    return true;
  };

  // Bulk Milestone handler
  const handleBulkMilestone = (
    containerId: string,
    topicId: string,
    milestoneData: {
      title: string;
      theory: string;
      exercise: string;
      xpReward: number;
      goldReward: number;
    }
  ): boolean => {
    const newStep = {
      id: uid(),
      title: milestoneData.title,
      desc: "5-minute milestone challenge",
      done: false,
      xpReward: 10, // Explicitly 10 XP
      goldReward: 2, // Explicitly 2 Gold
      blocks: [
        {
          id: uid(),
          title: "📚 In-Depth Theory & Real-World Analogy",
          type: "theory" as const,
          elements: [
            {
              id: uid(),
              type: "text" as const,
              content: milestoneData.theory,
            },
          ],
        },
        {
          id: uid(),
          title: "🛠️ Step-by-Step Practical Exercise",
          type: "exercise_description" as const,
          elements: [
            {
              id: uid(),
              type: "text" as const,
              content: milestoneData.exercise,
            },
          ],
        },
      ],
    };

    setContainers((prev) =>
      prev.map((c) => {
        if (c.id !== containerId) return c;
        return {
          ...c,
          sections: c.sections.map((s) => ({
            ...s,
            topics: s.topics.map((t) => {
              if (t.id !== topicId) return t;
              return {
                ...t,
                steps: [...t.steps, newStep],
              };
            }),
          })),
        };
      })
    );
    return true;
  };

  return (
    <div className="realm-dark relative min-h-screen bg-[#06120b] text-foreground select-none pb-20">
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

      {/* Navigation */}
      <TopNav active="ai-hub" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-8">
        {/* Header Title Card */}
        <header className="rune-frame mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/40 bg-card/70 p-6 backdrop-blur-md">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/80 block">
              AI Command Engine • 3-Step Pipeline
            </span>
            <h1 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-[0.18em] text-primary drop-shadow-md">
              AI HUB
            </h1>
          </div>
        </header>

        {/* Collapsible Prompt Generator Workbench */}
        <PromptGeneratorBar
          skillName={skillName}
          setSkillName={setSkillName}
          skillDescription={skillDescription}
          setSkillDescription={setSkillDescription}
          masteredSkills={masteredSkills}
          setMasteredSkills={setMasteredSkills}
          selectedSectionTitle={currentSection?.title || "Section 1"}
          selectedSectionTarget={currentSection?.target || "Section Target Outcome"}
          selectedSectionScope={currentSection?.detailedOverviewAndScope || "Section Scope"}
        />

        {/* Top Wireframe Tabs (SECTIONS | TOPICS | MILESTONES) */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-3 border-b border-primary/20 pb-4">
          <button
            onClick={() => setActiveTab("sections")}
            className={`rounded-lg px-8 py-3 font-display text-sm font-bold uppercase tracking-[0.25em] transition shadow-md ${
              activeTab === "sections"
                ? "bg-[#84cc16] text-[#06120b] shadow-[0_0_20px_rgba(132,204,22,0.6)] scale-105"
                : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            1. SECTIONS
          </button>

          <button
            onClick={() => setActiveTab("topics")}
            className={`rounded-lg px-8 py-3 font-display text-sm font-bold uppercase tracking-[0.25em] transition shadow-md ${
              activeTab === "topics"
                ? "bg-[#84cc16] text-[#06120b] shadow-[0_0_20px_rgba(132,204,22,0.6)] scale-105"
                : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            2. TOPICS
          </button>

          <button
            onClick={() => setActiveTab("milestones")}
            className={`rounded-lg px-8 py-3 font-display text-sm font-bold uppercase tracking-[0.25em] transition shadow-md ${
              activeTab === "milestones"
                ? "bg-[#84cc16] text-[#06120b] shadow-[0_0_20px_rgba(132,204,22,0.6)] scale-105"
                : "bg-muted/40 text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            }`}
          >
            3. MILESTONES
          </button>
        </div>

        {/* Tab Content Rendering */}
        <main className="rune-frame rounded-2xl border border-primary/30 bg-card/60 p-6 backdrop-blur-md">
          {activeTab === "sections" ? (
            <SectionsTab onBulkSections={handleBulkSections} />
          ) : activeTab === "topics" ? (
            <TopicsTab
              containers={containers}
              selectedContainerId={selectedContainerId}
              setSelectedContainerId={setSelectedContainerId}
              selectedSectionId={selectedSectionId}
              setSelectedSectionId={setSelectedSectionId}
              onBulkTopics={handleBulkTopics}
            />
          ) : (
            <MilestonesTab
              containers={containers}
              selectedContainerId={selectedContainerId}
              selectedTopicId={selectedTopicId}
              setSelectedTopicId={setSelectedTopicId}
              onBulkMilestone={handleBulkMilestone}
              skillName={skillName}
              skillDescription={skillDescription}
            />
          )}
        </main>
      </div>
    </div>
  );
}
