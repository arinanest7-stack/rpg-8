import { useState, useEffect } from "react";
import {
  X,
  Plus,
  BookmarkPlus,
  Layers,
  Save,
  Check,
  FileText,
  HelpCircle,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  StepData,
  SectionBlock,
  SectionBlockType,
  ContentElementType,
  BUILT_IN_TEMPLATES,
  uid,
} from "@/lib/templates";
import { SectionBlockContainer } from "./SectionBlockContainer";
import { useStudyStore } from "@/hooks/useStudyStore";

interface Props {
  isOpen: boolean;
  step: StepData | null;
  skillTitle?: string;
  sectionTitle?: string;
  topicTitle?: string;
  onClose: () => void;
  onSaveStep: (updatedStep: StepData) => void;
}

export function StepEditorModal({
  isOpen,
  step,
  skillTitle = "Valenciano — Core",
  sectionTitle = "Reading & Comprehension",
  topicTitle = "Text Analysis",
  onClose,
  onSaveStep,
}: Props) {
  const { allTemplates, saveCustomTemplate } = useStudyStore();
  const [currentStep, setCurrentStep] = useState<StepData | null>(null);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [showInsertTemplateModal, setShowInsertTemplateModal] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [templateDesc, setTemplateDesc] = useState("");
  const [autoSavedNotice, setAutoSavedNotice] = useState(false);

  useEffect(() => {
    if (step) {
      setCurrentStep(JSON.parse(JSON.stringify(step)));
    }
  }, [step]);

  if (!isOpen || !currentStep) return null;

  const handleUpdateStep = (next: StepData) => {
    setCurrentStep(next);
    onSaveStep(next);
    setAutoSavedNotice(true);
    setTimeout(() => setAutoSavedNotice(false), 1500);
  };

  const addSectionBlock = (type: SectionBlockType, titleOverride?: string) => {
    const titles: Record<SectionBlockType, string> = {
      theory: "Theory Block",
      exercise_description: "Exercise Description",
      exercise_solution: "Exercise Solution",
      custom: "Custom Section Block",
    };

    const newBlock: SectionBlock = {
      id: uid(),
      title: titleOverride || titles[type],
      type,
      elements: [
        {
          id: uid(),
          type: type === "theory" ? "h2" : "h3",
          content: titleOverride || titles[type],
        },
        {
          id: uid(),
          type: "text",
          content: "Enter your study notes or problem description here...",
        },
      ],
    };

    handleUpdateStep({
      ...currentStep,
      blocks: [...currentStep.blocks, newBlock],
    });
  };

  const deleteSectionBlock = (blockId: string) => {
    handleUpdateStep({
      ...currentStep,
      blocks: currentStep.blocks.filter((b) => b.id !== blockId),
    });
  };

  const updateSectionBlock = (blockId: string, nextBlock: SectionBlock) => {
    handleUpdateStep({
      ...currentStep,
      blocks: currentStep.blocks.map((b) => (b.id === blockId ? nextBlock : b)),
    });
  };

  const handleSaveAsTemplate = () => {
    if (!templateName.trim()) return;
    saveCustomTemplate(templateName, templateDesc, currentStep.blocks);
    setTemplateName("");
    setTemplateDesc("");
    setShowSaveTemplateModal(false);
  };

  const handleInsertTemplate = (blocks: SectionBlock[]) => {
    const cloned: SectionBlock[] = JSON.parse(JSON.stringify(blocks)).map(
      (b: SectionBlock) => ({
        ...b,
        id: uid(),
        elements: b.elements.map((el) => ({ ...el, id: uid() })),
      }),
    );
    handleUpdateStep({
      ...currentStep,
      blocks: [...currentStep.blocks, ...cloned],
    });
    setShowInsertTemplateModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md p-3 md:p-6 overflow-hidden">
      <div className="rune-frame relative flex w-full max-w-5xl h-[92vh] flex-col rounded-2xl bg-card border border-primary/50 shadow-2xl overflow-hidden">
        {/* Top Header */}
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-6 py-4">
          <div>
            {/* Unified Breadcrumbs: Skill -> Section -> Topic -> Step */}
            <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              <span className="text-primary font-medium">{skillTitle}</span>
              <span>›</span>
              <span>{sectionTitle}</span>
              <span>›</span>
              <span>{topicTitle}</span>
              <span>›</span>
              <span className="text-foreground font-semibold">{currentStep.title}</span>
            </div>

            <div className="flex items-center gap-3 mt-1">
              <input
                value={currentStep.title}
                onChange={(e) =>
                  handleUpdateStep({ ...currentStep, title: e.target.value })
                }
                className="font-display text-xl uppercase tracking-wider text-foreground bg-transparent border-b border-transparent hover:border-border focus:border-primary focus:outline-none transition px-1 py-0.5"
              />

              {autoSavedNotice && (
                <span className="flex items-center gap-1 font-mono text-[10px] text-xp animate-fade-in">
                  <Check className="h-3 w-3" /> Auto-saved
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInsertTemplateModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-xs text-primary hover:bg-primary/20 transition"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Insert Template</span>
            </button>

            <button
              onClick={() => setShowSaveTemplateModal(true)}
              className="flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 font-mono text-xs text-gold hover:bg-gold/20 transition"
            >
              <BookmarkPlus className="h-3.5 w-3.5" />
              <span>Save as Template</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg border border-border p-2 text-muted-foreground hover:border-destructive hover:text-destructive transition"
              title="Close editor"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Step description sub-header */}
        <div className="border-b border-border/40 bg-background/40 px-6 py-2.5">
          <input
            value={currentStep.desc}
            onChange={(e) =>
              handleUpdateStep({ ...currentStep, desc: e.target.value })
            }
            placeholder="Enter step objective or description..."
            className="w-full bg-transparent font-mono text-xs text-muted-foreground focus:text-foreground focus:outline-none"
          />
        </div>

        {/* Main Scrollable Canvas for Section Blocks */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {currentStep.blocks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center">
              <Sparkles className="mx-auto h-8 w-8 text-primary/60 mb-3" />
              <h3 className="font-display text-base uppercase tracking-wider text-foreground">
                No Section Blocks Added Yet
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                Add flexible blocks for Theory, Exercise Descriptions, or Solution Keys to build this step.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => addSectionBlock("theory")}
                  className="rounded-xl border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-xs text-cyan hover:bg-cyan/20 transition"
                >
                  + Theory Block
                </button>
                <button
                  onClick={() => addSectionBlock("exercise_description")}
                  className="rounded-xl border border-gold/40 bg-gold/10 px-4 py-2 font-mono text-xs text-gold hover:bg-gold/20 transition"
                >
                  + Exercise Description
                </button>
                <button
                  onClick={() => addSectionBlock("exercise_solution")}
                  className="rounded-xl border border-xp/40 bg-xp/10 px-4 py-2 font-mono text-xs text-xp hover:bg-xp/20 transition"
                >
                  + Solution Key
                </button>
              </div>
            </div>
          ) : (
            currentStep.blocks.map((block) => (
              <SectionBlockContainer
                key={block.id}
                block={block}
                onChange={(next: SectionBlock) => updateSectionBlock(block.id, next)}
                onDelete={() => deleteSectionBlock(block.id)}
              />
            ))
          )}

          {/* Add Section Block Action Footer */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border/60 bg-background/50 p-4">
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
              Add Section Block:
            </span>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => addSectionBlock("theory")}
                className="flex items-center gap-1.5 rounded-lg border border-cyan/40 bg-cyan/10 px-3 py-1.5 font-mono text-xs text-cyan hover:bg-cyan/20 transition"
              >
                <FileText className="h-3.5 w-3.5" />
                <span>+ Theory</span>
              </button>

              <button
                onClick={() => addSectionBlock("exercise_description")}
                className="flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3 py-1.5 font-mono text-xs text-gold hover:bg-gold/20 transition"
              >
                <HelpCircle className="h-3.5 w-3.5" />
                <span>+ Exercise</span>
              </button>

              <button
                onClick={() => addSectionBlock("exercise_solution")}
                className="flex items-center gap-1.5 rounded-lg border border-xp/40 bg-xp/10 px-3 py-1.5 font-mono text-xs text-xp hover:bg-xp/20 transition"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>+ Solution</span>
              </button>

              <button
                onClick={() => addSectionBlock("custom")}
                className="flex items-center gap-1.5 rounded-lg border border-magenta/40 bg-magenta/10 px-3 py-1.5 font-mono text-xs text-magenta hover:bg-magenta/20 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Custom</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Save Template Dialog */}
      {showSaveTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
          <div className="rune-frame w-full max-w-md rounded-2xl bg-card p-6 border border-primary/50 shadow-2xl">
            <h3 className="font-display text-lg uppercase tracking-wider text-primary mb-2">
              Save as Custom Template
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Save the section blocks of this step to re-use across other topics in your curriculum.
            </p>
            <div className="flex flex-col gap-3">
              <input
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Template Name (e.g., Exam Breakdown)"
                className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
              <textarea
                value={templateDesc}
                onChange={(e) => setTemplateDesc(e.target.value)}
                placeholder="Description..."
                rows={2}
                className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
              />
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowSaveTemplateModal(false)}
                className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAsTemplate}
                className="rounded-lg bg-gold px-4 py-2 text-xs font-semibold text-background hover:brightness-110"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Insert Template Modal */}
      {showInsertTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
          <div className="rune-frame w-full max-w-lg rounded-2xl bg-card p-6 border border-primary/50 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/50 pb-3 mb-4">
              <h3 className="font-display text-lg uppercase tracking-wider text-primary">
                Insert Step Template
              </h3>
              <button
                onClick={() => setShowInsertTemplateModal(false)}
                className="rounded p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto flex flex-col gap-3 pr-1">
              {allTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-background/50 p-4 transition hover:border-primary/60"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-display text-sm font-semibold text-foreground">
                        {tpl.name}
                      </h4>
                      {tpl.isBuiltIn && (
                        <span className="rounded bg-cyan/15 px-1.5 py-0.5 font-mono text-[9px] text-cyan border border-cyan/30">
                          Built-in
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {tpl.description}
                    </p>
                    <div className="mt-2 font-mono text-[10px] text-primary">
                      {tpl.blocks.length} Section Blocks
                    </div>
                  </div>

                  <button
                    onClick={() => handleInsertTemplate(tpl.blocks)}
                    className="shrink-0 rounded-lg bg-primary/15 border border-primary/40 px-3.5 py-2 font-mono text-xs text-primary hover:bg-primary/25 transition"
                  >
                    Insert
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowInsertTemplateModal(false)}
                className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
