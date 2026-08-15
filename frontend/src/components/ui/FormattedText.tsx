import React from "react";

interface FormattedTextProps {
  content: string;
  className?: string;
}

/**
 * Cleans and converts LaTeX math syntax into readable math expressions
 */
function cleanMathSyntax(text: string): string {
  if (!text) return "";

  return (
    text
      // Standard LaTeX replacements
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1 / $2)")
      .replace(/\\ln\\left\(/g, "ln(")
      .replace(/\\right\)/g, ")")
      .replace(/\\approx/g, "≈")
      .replace(/\\le/g, "≤")
      .replace(/\\ge/g, "≥")
      .replace(/\\times/g, "×")
      .replace(/\\cdot/g, "·")
      .replace(/\\to/g, "→")
      .replace(/\\Delta/g, "Δ")
      .replace(/\\sigma/g, "σ")
      .replace(/\\mu/g, "μ")
      .replace(/\\alpha/g, "α")
      .replace(/\\beta/g, "β")
      .replace(/\\gamma/g, "γ")
      .replace(/\\lambda/g, "λ")
      .replace(/\\theta/g, "θ")
  );
}

/**
 * Renders inline text with bold (**text**), math ($expr$), and italic (*text*)
 */
function renderInlineFormatting(text: string): React.ReactNode[] {
  const cleaned = cleanMathSyntax(text);

  // Split by inline math ($...$) or bold (**...**) or italic (*...*)
  const tokens = cleaned.split(/(\$\$[\s\S]+?\$\$|\$[^\$]+?\$|\*\*[^*]+?\*\*|\*[^*]+?\*)/g);

  return tokens.map((token, idx) => {
    if (!token) return null;

    // Display / Inline Math
    if (token.startsWith("$") && token.endsWith("$")) {
      const mathBody = token.replace(/^\$+|\$+$/g, "").trim();
      return (
        <span
          key={idx}
          className="inline-block mx-0.5 rounded bg-[#102a1e] px-1.5 py-0.5 font-mono text-xs font-semibold text-[#6ee7b7] border border-[#059669]/40 shadow-sm"
        >
          {mathBody}
        </span>
      );
    }

    // Bold text (**bold**)
    if (token.startsWith("**") && token.endsWith("**")) {
      const boldBody = token.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-primary drop-shadow-[0_0_8px_rgba(200,170,110,0.3)]">
          {boldBody}
        </strong>
      );
    }

    // Italic text (*italic*)
    if (token.startsWith("*") && token.endsWith("*")) {
      const italicBody = token.slice(1, -1);
      return (
        <em key={idx} className="italic text-emerald-200">
          {italicBody}
        </em>
      );
    }

    return <React.Fragment key={idx}>{token}</React.Fragment>;
  });
}

export function FormattedText({ content, className = "" }: FormattedTextProps) {
  if (!content) return null;

  // Strip redundant title headers if present (e.g. 📚 **In-Depth Theory...**)
  let cleanContent = content
    .replace(/^(\s*📚|\s*🛠️)?\s*\*\*(In-Depth Theory|Step-by-Step Practical Exercise)[^*]*\*\*\s*/i, "")
    .trim();

  // Split into paragraphs / lines
  const paragraphs = cleanContent
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className={`space-y-3.5 text-sm text-[#e2e8f0] leading-relaxed font-sans ${className}`}>
      {paragraphs.map((paragraph, pIdx) => {
        // Numbered item (e.g. "1. **Title:** ...")
        const numberedMatch = paragraph.match(/^(\d+)[\.\)]\s*(.+)$/);
        if (numberedMatch) {
          const num = numberedMatch[1];
          const body = numberedMatch[2];
          return (
            <div
              key={pIdx}
              className="flex items-start gap-3 rounded-xl border border-primary/25 bg-black/40 p-3.5 shadow-sm transition hover:border-primary/50"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-primary/50 bg-primary/20 font-mono text-xs font-bold text-primary shadow-[0_0_8px_rgba(200,170,110,0.3)]">
                {num}
              </span>
              <div className="flex-1 text-sm leading-relaxed text-foreground">
                {renderInlineFormatting(body)}
              </div>
            </div>
          );
        }

        // Bullet item (e.g. "* **Simple Return:** ...")
        const bulletMatch = paragraph.match(/^[\*\•\-]\s*(.+)$/);
        if (bulletMatch) {
          const body = bulletMatch[1];
          return (
            <div key={pIdx} className="flex items-start gap-2.5 pl-2 my-1.5">
              <span className="text-primary font-bold text-base leading-none mt-0.5">•</span>
              <div className="flex-1 text-sm leading-relaxed text-foreground">
                {renderInlineFormatting(body)}
              </div>
            </div>
          );
        }

        // Standard Paragraph
        return (
          <p key={pIdx} className="text-sm leading-relaxed text-[#e2e8f0]">
            {renderInlineFormatting(paragraph)}
          </p>
        );
      })}
    </div>
  );
}
