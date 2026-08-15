import { useState } from "react";
import { ContainerData, SectionData } from "@/hooks/useStudyStore";
import { parseTopicsInput } from "@/lib/promptPipeline";
import { CheckCircle2, ChevronDown, Layers } from "lucide-react";

interface TopicsTabProps {
  containers: ContainerData[];
  selectedContainerId: string;
  setSelectedContainerId: (id: string) => void;
  selectedSectionId: string;
  setSelectedSectionId: (id: string) => void;
  onBulkTopics: (containerId: string, sectionId: string, topicsInput: string) => boolean;
}

export function TopicsTab({
  containers,
  selectedContainerId,
  setSelectedContainerId,
  selectedSectionId,
  setSelectedSectionId,
  onBulkTopics,
}: TopicsTabProps) {
  const [pasteText, setPasteText] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const currentContainer = containers.find((c) => c.id === selectedContainerId) || containers[0];
  const sectionsList: SectionData[] = currentContainer?.sections || [];

  const handleBulk = () => {
    if (!selectedContainerId || !selectedSectionId || !pasteText.trim()) {
      setStatusMsg("Please choose a section and paste topics content.");
      return;
    }

    const success = onBulkTopics(selectedContainerId, selectedSectionId, pasteText);
    if (success) {
      const parsedCount = parseTopicsInput(pasteText).length;
      setStatusMsg(`Successfully bulk added ${parsedCount} topic(s)!`);
      setPasteText("");
      setTimeout(() => setStatusMsg(null), 3000);
    } else {
      setStatusMsg("Failed to add topics. Please check your selection.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Selector Bar (Matching Wireframe 1) */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Container / Skill Dropdown */}
        {containers.length > 1 && (
          <div className="relative">
            <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Skill Container
            </label>
            <select
              value={selectedContainerId}
              onChange={(e) => {
                setSelectedContainerId(e.target.value);
                const nextC = containers.find((c) => c.id === e.target.value);
                if (nextC && nextC.sections.length > 0) {
                  setSelectedSectionId(nextC.sections[0].id);
                }
              }}
              className="appearance-none rounded-xl border border-primary/40 bg-[#16251d] px-4 py-2.5 pr-10 font-display text-xs uppercase tracking-wider text-primary shadow-md focus:border-primary focus:outline-none cursor-pointer"
            >
              {containers.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#0b1811] text-foreground">
                  {c.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 text-primary" />
          </div>
        )}

        {/* CHOOSE SECTION Dropdown (Matching Wireframe 1) */}
        <div className="relative">
          <label className="block font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Choose Section
          </label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="appearance-none rounded-xl border border-primary/40 bg-[#c8aa6e]/20 px-5 py-2.5 pr-10 font-display text-xs uppercase tracking-[0.2em] text-primary shadow-[0_0_12px_rgba(200,170,110,0.2)] focus:border-primary focus:outline-none cursor-pointer"
          >
            {sectionsList.length === 0 ? (
              <option value="">No Sections Available</option>
            ) : (
              sectionsList.map((sec, idx) => (
                <option key={sec.id} value={sec.id} className="bg-[#0b1811] text-foreground">
                  SECTION {idx + 1}: {sec.title.toUpperCase()}
                </option>
              ))
            )}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 bottom-3 h-4 w-4 text-primary" />
        </div>
      </div>

      {/* Main Textarea: PAST HERE (Matching Wireframe 1) */}
      <div className="relative rounded-2xl border border-primary/30 bg-[#121c17] p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-accent" />
            PAST HERE (Paste Generated Topics JSON or Line-by-Line Titles)
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            Capped at &lt; 10 short titles (1–4 words each)
          </span>
        </div>

        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder={`PAST HERE

Example JSON:
{
  "topics": [
    { "title": "Text Analysis" },
    { "title": "Verb Conjugations" }
  ]
}

Or raw text titles line by line:
1. Text Analysis
2. Verb Conjugations`}
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

      {/* Action Button: BULK (Matching Wireframe 1) */}
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
