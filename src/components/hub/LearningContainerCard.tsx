import { useState } from "react";
import { Folder, Layers, Trash2, Plus, ChevronDown, ChevronRight, Edit2 } from "lucide-react";
import { ContainerData, StepData } from "@/hooks/useStudyStore";
import { SectionCard } from "./SectionCard";
import { TopicCard } from "./TopicCard";

interface Props {
  container: ContainerData;
  onUpdate: (updated: ContainerData) => void;
  onDelete: () => void;
  onEditStep: (step: StepData, skillTitle: string, sectionTitle: string, topicTitle: string) => void;
}

export function LearningContainerCard({
  container,
  onUpdate,
  onDelete,
  onEditStep,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(container.title);

  const handleTitleSubmit = () => {
    setEditingTitle(false);
    if (titleInput.trim()) {
      onUpdate({ ...container, title: titleInput.trim() });
    } else {
      setTitleInput(container.title);
    }
  };

  const handleToggleMode = () => {
    const nextMode = container.mode === "with_sections" ? "simple" : "with_sections";
    onUpdate({ ...container, mode: nextMode });
  };

  const handleAddSection = () => {
    const newSection = {
      id: Math.random().toString(36).substring(2, 9),
      title: `New Section ${container.sections.length + 1}`,
      topics: [],
    };
    onUpdate({
      ...container,
      sections: [...container.sections, newSection],
    });
  };

  const handleAddSimpleTopic = () => {
    const newTopic = {
      id: Math.random().toString(36).substring(2, 9),
      title: `New Topic ${container.topics.length + 1}`,
      status: "not_sent" as const,
      steps: [],
    };
    onUpdate({
      ...container,
      topics: [...container.topics, newTopic],
    });
  };

  return (
    <div className="rune-frame overflow-hidden rounded-2xl bg-card/60 backdrop-blur-md transition-all border border-border/80">
      {/* Skill Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 bg-background/50 p-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Folder className="h-5 w-5" />
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">
                SKILL
              </span>
              {editingTitle ? (
                <input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                  autoFocus
                  className="font-display text-lg uppercase tracking-wide text-primary bg-background border border-primary/50 px-2 py-0.5 rounded focus:outline-none"
                />
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="font-display text-lg uppercase tracking-wide text-primary">
                    {container.title}
                  </h2>
                  <button
                    onClick={() => setEditingTitle(true)}
                    className="text-muted-foreground hover:text-primary transition"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleMode}
            className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/60 px-3 py-1.5 font-mono text-xs text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
            title="Toggle between Sectioned or Simple layout"
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{container.mode === "with_sections" ? "With Sections" : "Simple"}</span>
          </button>

          <button
            onClick={onDelete}
            className="rounded-lg border border-border/80 p-2 text-muted-foreground transition hover:border-destructive/60 hover:bg-destructive/10 hover:text-destructive"
            title="Delete Skill"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Card Content Body */}
      {!collapsed && (
        <div className="p-4 sm:p-6">
          {container.mode === "with_sections" ? (
            <div className="flex flex-col gap-6">
              {container.sections.map((section, secIdx) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onUpdate={(updatedSection) => {
                    const nextSections = [...container.sections];
                    nextSections[secIdx] = updatedSection;
                    onUpdate({ ...container, sections: nextSections });
                  }}
                  onDelete={() => {
                    const nextSections = container.sections.filter((_, i) => i !== secIdx);
                    onUpdate({ ...container, sections: nextSections });
                  }}
                  onEditStep={(step, topicTitle) =>
                    onEditStep(step, container.title, section.title, topicTitle)
                  }
                />
              ))}

              <button
                onClick={handleAddSection}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-background/30 p-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <Plus className="h-4 w-4" />
                <span>Add Section</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {container.topics.map((topic, topIdx) => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onUpdate={(updatedTopic) => {
                      const nextTopics = [...container.topics];
                      nextTopics[topIdx] = updatedTopic;
                      onUpdate({ ...container, topics: nextTopics });
                    }}
                    onDelete={() => {
                      const nextTopics = container.topics.filter((_, i) => i !== topIdx);
                      onUpdate({ ...container, topics: nextTopics });
                    }}
                    onEditStep={(step) =>
                      onEditStep(step, container.title, "General", topic.title)
                    }
                  />
                ))}
              </div>

              <button
                onClick={handleAddSimpleTopic}
                className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-border/80 bg-background/30 p-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                <Plus className="h-4 w-4" />
                <span>Add Topic</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
