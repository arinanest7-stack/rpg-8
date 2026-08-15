import { useState, useEffect } from "react";
import {
  X,
  Zap,
  Coins,
  CheckCircle,
  FileText,
  HelpCircle,
  CheckCircle2,
  Download,
  Check,
} from "lucide-react";
import { StepData } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { FormattedText } from "@/components/ui/FormattedText";

interface Props {
  isOpen: boolean;
  step: StepData | null;
  skillTitle?: string;
  sectionTitle?: string;
  topicTitle?: string;
  onClose: () => void;
  onCompleteStep: (stepId: string) => void;
}

export function StepViewerModal({
  isOpen,
  step,
  skillTitle = "Valenciano — Core",
  sectionTitle = "Reading & Comprehension",
  topicTitle = "Text Analysis",
  onClose,
  onCompleteStep,
}: Props) {
  const [currentStep, setCurrentStep] = useState<StepData | null>(null);
  const [studentNote, setStudentNote] = useState("");
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  useEffect(() => {
    if (step) {
      setCurrentStep(JSON.parse(JSON.stringify(step)));
      setStudentNote(step.studentNotes || "");
    }
  }, [step]);

  if (!isOpen || !currentStep) return null;

  const toggleChecklist = (blockId: string, elementId: string) => {
    const updated = {
      ...currentStep,
      blocks: currentStep.blocks.map((b) => {
        if (b.id === blockId) {
          return {
            ...b,
            elements: b.elements.map((el) =>
              el.id === elementId ? { ...el, checked: !el.checked } : el,
            ),
          };
        }
        return b;
      }),
    };
    setCurrentStep(updated);
  };

  const handleComplete = () => {
    if (!currentStep.done) {
      onCompleteStep(currentStep.id);
      setCurrentStep({ ...currentStep, done: true });
      setShowSuccessBanner(true);
      setTimeout(() => setShowSuccessBanner(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md p-3 md:p-6 overflow-hidden">
      <div className="rune-frame relative flex w-full max-w-4xl h-[90vh] flex-col rounded-2xl bg-card border border-primary/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="relative flex flex-wrap items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-6 py-4 pr-16">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="font-display text-lg md:text-xl uppercase tracking-wider text-primary leading-snug whitespace-normal break-words">
              {currentStep.title}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-1.5 font-mono text-xs text-gold">
              <span className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" /> +{currentStep.xpReward || 10} XP
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Coins className="h-3.5 w-3.5" /> +{currentStep.goldReward || 2}g
              </span>
            </div>
          </div>

          {/* Absolute Top-Right Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full border border-primary/40 bg-black/60 p-2 text-muted-foreground hover:border-primary hover:text-primary transition shadow-md"
            title="Close viewer"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="bg-[linear-gradient(90deg,var(--xp),color-mix(in_oklab,var(--xp)_40%,transparent))] px-6 py-2.5 text-center font-mono text-xs text-background font-semibold animate-pulse flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <span>Step Completed! +{currentStep.xpReward || 10} XP & +{currentStep.goldReward || 2} Gold earned!</span>
          </div>
        )}

        {/* Content Viewer Body */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {currentStep.desc && (
            <p className="text-xs text-muted-foreground font-mono leading-relaxed border-b border-border/40 pb-3">
              {currentStep.desc}
            </p>
          )}

          {currentStep.blocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/70 p-10 text-center text-sm text-muted-foreground">
              This step has no section blocks configured yet.
            </div>
          ) : (
            currentStep.blocks.map((block) => {
              const iconMap = {
                theory: <FileText className="h-4 w-4 text-cyan" />,
                exercise_description: <HelpCircle className="h-4 w-4 text-gold" />,
                exercise_solution: <CheckCircle2 className="h-4 w-4 text-xp" />,
                custom: <FileText className="h-4 w-4 text-magenta" />,
              };

              return (
                <div
                  key={block.id}
                  className="rounded-xl border border-border/70 bg-background/50 p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2 font-display text-sm font-semibold uppercase tracking-wider text-primary border-b border-border/40 pb-2 mb-3">
                    {iconMap[block.type]}
                    <span>{block.title}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {block.elements.map((el) => {
                      if (el.type === "h1")
                        return <h1 key={el.id} className="font-display text-lg font-bold text-foreground">{el.content}</h1>;
                      if (el.type === "h2")
                        return <h2 key={el.id} className="font-display text-base font-semibold text-foreground">{el.content}</h2>;
                      if (el.type === "h3")
                        return <h3 key={el.id} className="font-display text-sm font-medium text-foreground">{el.content}</h3>;
                      if (el.type === "bullet_list")
                        return (
                          <div key={el.id} className="ml-2 flex items-start gap-2 text-xs text-foreground/90 leading-relaxed">
                            <span className="text-primary">•</span>
                            <FormattedText content={el.content} />
                          </div>
                        );
                      if (el.type === "numbered_list")
                        return (
                          <div key={el.id} className="ml-2 flex items-start gap-2 text-xs text-foreground/90 leading-relaxed">
                            <span className="font-mono text-xs font-semibold text-primary">1.</span>
                            <FormattedText content={el.content} />
                          </div>
                        );
                      if (el.type === "todolist")
                        return (
                          <label
                            key={el.id}
                            onClick={() => toggleChecklist(block.id, el.id)}
                            className="flex items-center gap-2.5 cursor-pointer text-xs text-foreground hover:text-primary transition"
                          >
                            <div
                              className={cn(
                                "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition",
                                el.checked
                                  ? "border-xp bg-xp text-background"
                                  : "border-border hover:border-primary",
                              )}
                            >
                              {el.checked && <Check className="h-3 w-3" />}
                            </div>
                            <span className={cn(el.checked && "line-through text-muted-foreground")}>
                              {el.content}
                            </span>
                          </label>
                        );
                      if (el.type === "file")
                        return (
                          <div
                            key={el.id}
                            className="flex items-center justify-between rounded-lg border border-border/80 bg-card p-3"
                          >
                            <span className="font-mono text-xs text-foreground">{el.content || "Guia_de_Estudio_Final.pdf"}</span>
                            <button className="flex items-center gap-1 rounded bg-primary/10 px-2.5 py-1 font-mono text-[10px] text-primary hover:bg-primary/20">
                              <Download className="h-3 w-3" /> Download
                            </button>
                          </div>
                        );

                      return (
                        <FormattedText key={el.id} content={el.content} />
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}

          {/* Student Study Notes Area */}
          <div className="mt-2 rounded-xl border border-border/70 bg-background/40 p-4">
            <label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-2">
              Your Personal Study Notes
            </label>
            <textarea
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              placeholder="Write personal reflection notes, key doubts, or summaries..."
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </main>

        {/* Footer Action */}
        <footer className="flex items-center justify-between border-t border-border/60 bg-background/80 px-6 py-4">
          <div className="font-mono text-xs text-muted-foreground">
            Status: {currentStep.done ? <span className="text-xp font-semibold">Completed ✓</span> : <span>In Progress</span>}
          </div>

          <button
            onClick={handleComplete}
            disabled={currentStep.done}
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider transition shadow-md",
              currentStep.done
                ? "bg-xp/20 text-xp border border-xp/40 cursor-default"
                : "bg-primary text-background hover:brightness-110 shadow-[0_0_20px_-5px_var(--primary)]",
            )}
          >
            <CheckCircle className="h-4 w-4" />
            <span>{currentStep.done ? "Step Completed" : "Complete Step"}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
