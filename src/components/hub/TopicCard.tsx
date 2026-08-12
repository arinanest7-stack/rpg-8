import { useState } from "react";
import { BookOpen, Trash2, Plus, Edit2, CheckCircle, Clock, Check } from "lucide-react";
import { TopicData, StepData } from "@/hooks/useStudyStore";

interface Props {
  topic: TopicData;
  onUpdate: (updated: TopicData) => void;
  onDelete: () => void;
  onEditStep?: (step: StepData) => void;
}

export function TopicCard({ topic, onUpdate, onDelete, onEditStep }: Props) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(topic.title);

  const handleTitleSubmit = () => {
    setEditingTitle(false);
    if (titleInput.trim()) {
      onUpdate({ ...topic, title: titleInput.trim() });
    } else {
      setTitleInput(topic.title);
    }
  };

  const handleStatusChange = (status: "not_sent" | "sent" | "done") => {
    onUpdate({ ...topic, status });
  };

  const handleAddStep = () => {
    const newStep: StepData = {
      id: Math.random().toString(36).substring(2, 9),
      title: `Step ${topic.steps.length + 1}: Methodology Note`,
      desc: "Define theory notes and exercise breakdown",
      done: false,
      xpReward: 25,
      goldReward: 5,
      blocks: [],
    };
    onUpdate({
      ...topic,
      steps: [...topic.steps, newStep],
    });
  };

  const handleDeleteStep = (stepId: string) => {
    onUpdate({
      ...topic,
      steps: topic.steps.filter((s) => s.id !== stepId),
    });
  };

  return (
    <div className="flex flex-col justify-between rounded-xl border border-border/70 bg-card/70 p-4 transition-all hover:border-primary/50 shadow-sm">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-border/40 pb-3 mb-3">
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 rounded bg-primary/10 p-1.5 text-primary">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground block">
                TOPIC
              </span>
              {editingTitle ? (
                <input
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
                  autoFocus
                  className="font-display text-sm font-semibold text-foreground bg-background border border-primary/50 px-2 py-0.5 rounded focus:outline-none"
                />
              ) : (
                <div className="flex items-center gap-1.5">
                  <h4 className="font-display text-sm font-semibold text-foreground">
                    {topic.title}
                  </h4>
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
            title="Delete Topic"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Status Toggle Row */}
        <div className="mb-3 flex items-center justify-between font-mono text-[10px]">
          <span className="uppercase text-muted-foreground">Status:</span>
          <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-background/50 p-1">
            <button
              onClick={() => handleStatusChange("not_sent")}
              className={`rounded px-2 py-0.5 transition ${
                topic.status === "not_sent"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Not Sent
            </button>
            <button
              onClick={() => handleStatusChange("sent")}
              className={`rounded px-2 py-0.5 transition ${
                topic.status === "sent"
                  ? "bg-gold/20 text-gold font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sent
            </button>
            <button
              onClick={() => handleStatusChange("done")}
              className={`rounded px-2 py-0.5 transition ${
                topic.status === "done"
                  ? "bg-xp/20 text-xp font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Done
            </button>
          </div>
        </div>

        {/* Steps List */}
        <div className="flex flex-col gap-2">
          {topic.steps.map((step) => (
            <div
              key={step.id}
              onClick={() => onEditStep && onEditStep(step)}
              className={`group flex items-center justify-between gap-2 rounded-lg border p-2.5 transition cursor-pointer ${
                step.done
                  ? "border-xp/40 bg-xp/5"
                  : "border-border/60 bg-background/40 hover:border-primary/50 hover:bg-background/80"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                    step.done ? "border-xp bg-xp text-background" : "border-border"
                  }`}
                >
                  {step.done && <Check className="h-3 w-3" />}
                </div>
                <div className="min-w-0 truncate">
                  <div className={`text-xs font-medium ${step.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                    {step.title}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">{step.desc}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStep(step.id);
                  }}
                  className="rounded p-1 text-muted-foreground hover:text-destructive transition"
                  title="Delete step"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleAddStep}
        className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-border/80 bg-background/30 p-2 font-mono text-xs font-medium text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary"
      >
        <Plus className="h-3.5 w-3.5" />
        <span>Add Step</span>
      </button>
    </div>
  );
}
