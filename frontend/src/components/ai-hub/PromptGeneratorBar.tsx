import { useState } from "react";
import { Copy, Check, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import {
  generateCommand1Prompt,
  generateCommand2Prompt,
  generateCommand3Prompt,
} from "@/lib/promptPipeline";

interface PromptGeneratorBarProps {
  skillName: string;
  setSkillName: (val: string) => void;
  skillDescription: string;
  setSkillDescription: (val: string) => void;
  masteredSkills: string;
  setMasteredSkills: (val: string) => void;
  selectedSectionTitle?: string;
  selectedSectionTarget?: string;
  selectedSectionScope?: string;
  selectedTopicTitle?: string;
}

export function PromptGeneratorBar({
  skillName,
  setSkillName,
  skillDescription,
  setSkillDescription,
  masteredSkills,
  setMasteredSkills,
  selectedSectionTitle = "Section 1: Foundations",
  selectedSectionTarget = "Master foundational concepts",
  selectedSectionScope = "Core mechanics and initial exercises",
  selectedTopicTitle = "Topic 1",
}: PromptGeneratorBarProps) {
  const [copiedCmd, setCopiedCmd] = useState<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeCommandTab, setActiveCommandTab] = useState<1 | 2 | 3>(1);

  const cmd1Text = generateCommand1Prompt(masteredSkills, skillName, skillDescription);
  const cmd2Text = generateCommand2Prompt(
    skillName,
    selectedSectionTitle,
    selectedSectionTarget,
    selectedSectionScope
  );
  const cmd3Text = generateCommand3Prompt(
    skillName,
    selectedSectionScope,
    selectedTopicTitle,
    1,
    5,
    ""
  );

  const handleCopy = (cmdNum: 1 | 2 | 3, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(cmdNum);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const currentPromptText =
    activeCommandTab === 1 ? cmd1Text : activeCommandTab === 2 ? cmd2Text : cmd3Text;

  return (
    <div className="rune-frame mb-6 rounded-2xl border border-primary/40 bg-card/80 p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/50 bg-primary/20 text-primary shadow-[0_0_12px_rgba(200,170,110,0.4)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary">
              AI Command Prompt Studio
            </h2>
            <p className="text-[11px] text-muted-foreground">
              Generate & copy 3-step prompts for ChatGPT, Gemini, or Claude
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-xl border border-primary/30 bg-black/60 px-4 py-2 font-mono text-xs uppercase tracking-wider text-foreground hover:border-primary/60 transition"
        >
          <span>{isOpen ? "Hide Generator Settings" : "Open Generator Settings"}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-5 border-t border-primary/20 pt-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Current Skill Name
              </label>
              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                placeholder="e.g. Valenciano Grammar"
                className="w-full rounded-xl border border-primary/30 bg-black/80 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Skill Description (Goal / Settings)
              </label>
              <input
                type="text"
                value={skillDescription}
                onChange={(e) => setSkillDescription(e.target.value)}
                placeholder="e.g. Master subjunctive verbs and comprehension"
                className="w-full rounded-xl border border-primary/30 bg-black/80 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Previously Mastered Skills
              </label>
              <input
                type="text"
                value={masteredSkills}
                onChange={(e) => setMasteredSkills(e.target.value)}
                placeholder="e.g. Basic Spanish, Vocabulary 1"
                className="w-full rounded-xl border border-primary/30 bg-black/80 px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Command Prompt Selector & Copy Preview */}
          <div className="rounded-xl border border-primary/30 bg-black/90 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/20 pb-3 mb-3">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveCommandTab(1)}
                  className={`rounded-lg px-3 py-1.5 font-display text-[11px] uppercase tracking-wider transition ${
                    activeCommandTab === 1
                      ? "bg-primary text-background font-bold"
                      : "bg-black/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Command 1 (3 Sections)
                </button>
                <button
                  onClick={() => setActiveCommandTab(2)}
                  className={`rounded-lg px-3 py-1.5 font-display text-[11px] uppercase tracking-wider transition ${
                    activeCommandTab === 2
                      ? "bg-primary text-background font-bold"
                      : "bg-black/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Command 2 (Topics)
                </button>
                <button
                  onClick={() => setActiveCommandTab(3)}
                  className={`rounded-lg px-3 py-1.5 font-display text-[11px] uppercase tracking-wider transition ${
                    activeCommandTab === 3
                      ? "bg-primary text-background font-bold"
                      : "bg-black/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Command 3 (Milestones)
                </button>
              </div>

              <button
                onClick={() => handleCopy(activeCommandTab, currentPromptText)}
                className="flex items-center gap-1.5 rounded-lg border border-primary/50 bg-primary/20 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-primary hover:bg-primary/30 transition shadow-[0_0_10px_rgba(200,170,110,0.3)]"
              >
                {copiedCmd === activeCommandTab ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-accent" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Prompt {activeCommandTab}</span>
                  </>
                )}
              </button>
            </div>

            <pre className="max-h-48 overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-300 whitespace-pre-wrap select-all">
              {currentPromptText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
