import { useState } from "react";
import { parseSectionsInput, ParsedSectionInput } from "@/lib/promptPipeline";
import { CheckCircle2, Layers, Sparkles } from "lucide-react";

interface SectionsTabProps {
  onBulkSections: (parsedData: ParsedSectionInput) => boolean;
}

export function SectionsTab({ onBulkSections }: SectionsTabProps) {
  const [pasteText, setPasteText] = useState("");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleBulk = () => {
    if (!pasteText.trim()) {
      setStatusMsg("Please paste Command 1 output JSON first.");
      return;
    }

    const parsed = parseSectionsInput(pasteText);
    if (!parsed || parsed.sections.length === 0) {
      setStatusMsg("Invalid Command 1 JSON format. Could not extract 3 sections.");
      return;
    }

    const success = onBulkSections(parsed);
    if (success) {
      setStatusMsg(
        `Successfully created/updated Skill "${parsed.skillName}" with ${parsed.sections.length} Sections!`
      );
      setPasteText("");
      setTimeout(() => setStatusMsg(null), 4500);
    } else {
      setStatusMsg("Failed to create sections. Please check your JSON format.");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            Bulk Import Command 1 (Skill & 3 Sections)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Paste Command 1 output JSON to automatically create/update Skill title, description & 3 Sections with their targets and detailed scopes.
          </p>
        </div>
      </div>

      {/* Main Textarea: PAST HERE */}
      <div className="relative rounded-2xl border border-primary/30 bg-[#121c17] p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Layers className="h-4 w-4 text-accent" />
            PAST HERE (Paste Generated Command 1 JSON)
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            Contains skillName, skillDescription & 3 sections
          </span>
        </div>

        <textarea
          value={pasteText}
          onChange={(e) => setPasteText(e.target.value)}
          placeholder={`PAST HERE

Example Command 1 JSON Output:
{
  "skillName": "Covariance Weaving of Latent Correlations",
  "skillDescription": "I want to trade with 1-2% of deposit...",
  "sections": [
    {
      "sectionNumber": 1,
      "title": "Foundations of Latent Covariance Dynamics",
      "target": "Master mathematical and statistical principles...",
      "detailedOverviewAndScope": "Introduces core quantitative concepts..."
    },
    ...
  ]
}`}
          rows={12}
          className="w-full rounded-xl border border-primary/20 bg-black/80 p-4 font-mono text-xs leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none"
        />

        {statusMsg && (
          <div className="mt-3 flex items-center gap-2 text-xs font-mono text-accent">
            <CheckCircle2 className="h-4 w-4" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Action Button: BULK */}
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
