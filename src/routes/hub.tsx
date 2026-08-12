import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus } from "lucide-react";
import backdrop from "@/assets/realm-backdrop.jpg";
import { ArcaneOverlay } from "@/components/character/ArcaneOverlay";
import { LearningContainerCard } from "@/components/hub/LearningContainerCard";
import { StepEditorModal } from "@/components/hub/StepEditorModal";
import { useStudyStore } from "@/hooks/useStudyStore";
import { StepData } from "@/lib/templates";
import { TopNav } from "@/components/ui/TopNav";

export const Route = createFileRoute("/hub")({
  head: () => ({
    meta: [
      { title: "Path Modeler — Curriculum Builder" },
      {
        name: "description",
        content:
          "Design and structure your learning path by creating skills, sections, topics, and methodology steps.",
      },
      { property: "og:title", content: "Path Modeler — Curriculum Builder" },
      {
        property: "og:description",
        content: "Structure skills, topics, and steps for your study journey.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PathModelerPage,
});

function PathModelerPage() {
  const { containers, setContainers } = useStudyStore();
  const [editingStep, setEditingStep] = useState<{
    step: StepData;
    skillTitle: string;
    sectionTitle: string;
    topicTitle: string;
  } | null>(null);

  const handleAddSkillContainer = () => {
    const newContainer = {
      id: Math.random().toString(36).substring(2, 9),
      title: `Skill ${containers.length + 1}`,
      mode: "with_sections" as const,
      sections: [
        {
          id: Math.random().toString(36).substring(2, 9),
          title: "Section 1",
          topics: [],
        },
      ],
      topics: [],
    };
    setContainers((prev) => [...prev, newContainer]);
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
      <TopNav active="hub" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-8">
        {/* Header Card */}
        <header className="rune-frame mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/40 bg-card/70 p-6 backdrop-blur-md">
          <div>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-primary/80 block">
              Curriculum Modeler • Path Structure & Steps
            </span>
            <h1 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-[0.18em] text-primary drop-shadow-md">
              Path Modeler
            </h1>
          </div>

          <button
            onClick={handleAddSkillContainer}
            className="flex items-center gap-2 rounded-xl border border-primary/60 bg-[linear-gradient(180deg,rgba(200,170,110,0.3)_0%,rgba(200,170,110,0.1)_100%)] px-5 py-2.5 font-display text-xs uppercase tracking-[0.2em] text-primary shadow-[0_0_20px_rgba(200,170,110,0.3)] transition hover:scale-105 hover:bg-primary/25"
          >
            <Plus className="h-4 w-4" />
            <span>Add Skill</span>
          </button>
        </header>

        {/* Skill Containers Canvas */}
        <main className="flex flex-col gap-8 pb-16">
          {containers.length === 0 ? (
            <div className="rune-frame rounded-2xl p-12 text-center">
              <h3 className="font-display text-lg uppercase tracking-wider text-foreground">
                No Skills Created Yet
              </h3>
              <p className="mt-2 text-xs text-muted-foreground max-w-md mx-auto">
                Click "Add Skill" above to start modeling your curriculum sections, topics, and steps.
              </p>
              <button
                onClick={handleAddSkillContainer}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-background hover:brightness-110"
              >
                <Plus className="h-4 w-4" />
                <span>Add Skill</span>
              </button>
            </div>
          ) : (
            containers.map((container, cIdx) => (
              <LearningContainerCard
                key={container.id}
                container={container}
                onUpdate={(updated) => {
                  setContainers((prev) => {
                    const next = [...prev];
                    next[cIdx] = updated;
                    return next;
                  });
                }}
                onDelete={() => {
                  setContainers((prev) => prev.filter((_, i) => i !== cIdx));
                }}
                onEditStep={(step, skillTitle, sectionTitle, topicTitle) => {
                  setEditingStep({ step, skillTitle, sectionTitle, topicTitle });
                }}
              />
            ))
          )}
        </main>
      </div>

      {/* Step Editor Modal */}
      {editingStep && (
        <StepEditorModal
          isOpen={Boolean(editingStep)}
          step={editingStep.step}
          skillTitle={editingStep.skillTitle}
          sectionTitle={editingStep.sectionTitle}
          topicTitle={editingStep.topicTitle}
          onClose={() => setEditingStep(null)}
          onSaveStep={(updatedStep) => {
            setContainers((prev) =>
              prev.map((c) => ({
                ...c,
                sections: c.sections.map((s) => ({
                  ...s,
                  topics: s.topics.map((t) => ({
                    ...t,
                    steps: t.steps.map((st) =>
                      st.id === updatedStep.id ? updatedStep : st,
                    ),
                  })),
                })),
                topics: c.topics.map((t) => ({
                  ...t,
                  steps: t.steps.map((st) =>
                    st.id === updatedStep.id ? updatedStep : st,
                  ),
                })),
              })),
            );
          }}
        />
      )}
    </div>
  );
}
