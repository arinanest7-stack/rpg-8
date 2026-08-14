import { useState } from "react";
import { FolderGit2, Trash2, Plus, Edit2 } from "lucide-react";
import { SectionData, StepData } from "@/hooks/useStudyStore";
import { TopicCard } from "./TopicCard";

interface Props {
  section: SectionData;
  onUpdate: (updated: SectionData) => void;
  onDelete: () => void;
  onEditStep: (step: StepData, topicTitle: string) => void;
}

export function SectionCard({
  section,
  onUpdate,
  onDelete,
  onEditStep,
}: Props) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(section.title);

  const handleTitleSubmit = () => {
    setEditingTitle(false);
    if (titleInput.trim()) {
      onUpdate({ ...section, title: titleInput.trim() });
    } else {
      setTitleInput(section.title);
    }
  };

  const handleAddTopic = () => {
    const newTopic = {
      id: Math.random().toString(36).substring(2, 9),
      title: `New Topic ${section.topics.length + 1}`,
      status: "not_sent" as const,
      steps: [],
    };
    onUpdate({
      ...section,
      topics: [...section.topics, newTopic],
    });
  };

  return (
    <div className="rounded-xl border border-border/70 bg-background/40 p-4 transition-all">
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between border-b border-border/40 pb-3">
        <div className="flex items-center gap-2">
          <div className="rounded bg-accent/15 p-1.5 text-accent">
            <FolderGit2 className="h-4 w-4" />
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
              SECTION
            </span>
            {editingTitle ? (
              <input
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                autoFocus
                className="font-display text-base font-semibold text-foreground bg-background border border-primary/50 px-2 py-0.5 rounded focus:outline-none"
              />
            ) : (
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold text-foreground">
                  {section.title}
                </h3>
                <button
                  onClick={() => setEditingTitle(true)}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  <Edit2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onDelete}
          className="rounded p-1 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
          title="Delete Section"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {section.topics.map((topic, topIdx) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            onUpdate={(updatedTopic) => {
              const nextTopics = [...section.topics];
              nextTopics[topIdx] = updatedTopic;
              onUpdate({ ...section, topics: nextTopics });
            }}
            onDelete={() => {
              const nextTopics = section.topics.filter((_, i) => i !== topIdx);
              onUpdate({ ...section, topics: nextTopics });
            }}
            onEditStep={(step) => onEditStep(step, topic.title)}
          />
        ))}
      </div>

      <button
        onClick={handleAddTopic}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border/80 bg-card/40 p-2.5 font-mono text-xs font-medium text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Add Topic</span>
      </button>
    </div>
  );
}
