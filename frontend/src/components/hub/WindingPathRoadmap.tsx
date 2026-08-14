import { Check, Star, Lock } from "lucide-react";
import { StepData } from "@/lib/templates";

type Props = {
  steps: StepData[];
  onNodeClick?: (step: StepData) => void;
};

export function WindingPathRoadmap({ steps, onNodeClick }: Props) {
  // Fallback demo nodes matching Photo 1 if steps array is empty
  const defaultNodes: Array<{ id: string; title: string; completed: boolean; active?: boolean; locked?: boolean }> = [
    { id: "1", title: "THEORY NOTES", completed: true },
    { id: "2", title: "BREAKDOWN SOLUTIONS", completed: true },
    { id: "3", title: "GUIDED EXERCISES", completed: false, active: true },
    { id: "4", title: "SOLO EXERCISES", completed: false, locked: true },
    { id: "5", title: "ALL-IN-ONE NOTE", completed: false, locked: true },
  ];

  const displayNodes = steps.length > 0 ? steps.map((s, idx) => {
    // Determine active vs locked status
    const isDone = Boolean(s.done);
    const isPrevDone = idx === 0 || Boolean(steps[idx - 1].done);
    const isActive = !isDone && isPrevDone;
    const isLocked = !isDone && !isPrevDone;
    return {
      id: s.id,
      title: s.title.toUpperCase(),
      completed: isDone,
      active: isActive,
      locked: isLocked,
      rawStep: s,
    };
  }) : defaultNodes.map(n => ({ ...n, rawStep: undefined }));

  // Node positions along an S-curve roadmap (x, y percentages or px)
  // Matching Photo 1: top center -> curving slightly left/right -> descending
  const nodePositions = [
    { x: 48, y: 130 },
    { x: 53, y: 230 },
    { x: 60, y: 340 },
    { x: 56, y: 440 },
    { x: 50, y: 530 },
  ];

  // Secondary section nodes (e.g. Gramàtica Avançada)
  const secondaryNodes = [
    { id: "g1", title: "THEORY NOTES", x: 48, y: 690 },
    { id: "g2", title: "GUIDED EXERCISES", x: 53, y: 780 },
    { id: "g3", title: "SOLO EXERCISES", x: 58, y: 860 },
  ];

  return (
    <div className="relative min-h-[920px] w-full select-none overflow-hidden py-6">
      {/* Curved SVG Winding Path Background */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 800 950"
        preserveAspectRatio="xMidYMin meet"
      >
        <defs>
          <linearGradient id="gold-path-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0b5" stopOpacity="0.8" />
            <stop offset="40%" stopColor="#dfb86c" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#334155" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Winding curved line through nodes */}
        <path
          d="M 384 130 C 420 180, 424 190, 424 230 C 424 280, 480 300, 480 340 C 480 390, 448 410, 448 440 C 448 480, 400 500, 400 530 M 400 620 L 400 690 C 400 730, 424 750, 424 780 C 424 820, 464 835, 464 860"
          fill="none"
          stroke="url(#gold-path-grad)"
          strokeWidth="2"
          strokeDasharray="6 4"
        />

        {/* Background glow arcs */}
        <path
          d="M 384 130 Q 550 200 480 340 T 400 530"
          fill="none"
          stroke="#dfb86c"
          strokeWidth="0.5"
          opacity="0.25"
        />
      </svg>

      {/* Primary Section Header */}
      <div className="relative z-10 text-center mb-8">
        <h2 className="font-display text-xl uppercase tracking-[0.26em] text-primary/90 shadow-sm drop-shadow-[0_2px_8px_rgba(200,170,110,0.3)]">
          Lectura i Comprensió
        </h2>
      </div>

      {/* Primary Winding Path Hex Nodes */}
      <div className="relative z-10 h-[580px] w-full">
        {displayNodes.map((node, i) => {
          const pos = nodePositions[i] || { x: 50, y: 100 + i * 90 };

          return (
            <div
              key={node.id}
              style={{ left: `${pos.x}%`, top: `${pos.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 group cursor-pointer"
              onClick={() => node.rawStep && onNodeClick?.(node.rawStep)}
            >
              {/* Hexagon Shape Container */}
              <div className="relative flex items-center justify-center">
                {/* Active Glow Ring */}
                {node.active && (
                  <div className="absolute -inset-2 animate-pulse rounded-full bg-primary/30 blur-md" />
                )}

                {/* Hexagon Outer Frame */}
                <div
                  className={`hex-clip flex h-14 w-12 items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    node.completed
                      ? "bg-[linear-gradient(135deg,#00f0b5,#059669)] p-0.5 shadow-[0_0_20px_rgba(0,240,181,0.5)]"
                      : node.active
                        ? "bg-[linear-gradient(135deg,#dfb86c,#c89b3c)] p-0.5 shadow-[0_0_25px_rgba(223,184,108,0.7)]"
                        : "bg-[linear-gradient(135deg,#1e293b,#0f172a)] p-0.5 opacity-85"
                  }`}
                >
                  {/* Hexagon Inner Content */}
                  <div
                    className={`hex-clip flex h-[52px] w-[44px] items-center justify-center ${
                      node.completed
                        ? "bg-[#062c20] text-[#00f0b5]"
                        : node.active
                          ? "bg-[#2a220e] text-[#dfb86c]"
                          : "bg-[#0b1612] text-slate-500"
                    }`}
                  >
                    {node.completed ? (
                      <Check className="h-6 w-6 stroke-[3]" />
                    ) : node.active ? (
                      <Star className="h-5 w-5 fill-[#dfb86c] text-[#dfb86c]" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </div>

              {/* Node Title Label */}
              <div className="whitespace-nowrap font-display text-xs font-bold uppercase tracking-[0.2em] transition group-hover:text-primary">
                <span
                  className={
                    node.completed
                      ? "text-slate-300"
                      : node.active
                        ? "text-[#dfb86c] drop-shadow-[0_0_8px_rgba(223,184,108,0.4)]"
                        : "text-slate-500"
                  }
                >
                  {node.title}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Section Header (Gramàtica Avançada) */}
      <div className="relative z-10 mt-12 text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-24 bg-[linear-gradient(90deg,transparent,rgba(200,170,110,0.5))]" />
          <h3 className="font-display text-base uppercase tracking-[0.24em] text-primary/80">
            Gramàtica Avançada
          </h3>
          <div className="h-px w-24 bg-[linear-gradient(90deg,rgba(200,170,110,0.5),transparent)]" />
        </div>
      </div>

      {/* Secondary Winding Path Locked Nodes */}
      <div className="relative z-10 h-[240px] w-full">
        {secondaryNodes.map((sec) => (
          <div
            key={sec.id}
            style={{ left: `${sec.x}%`, top: `${sec.y - 650}px` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 opacity-60"
          >
            <div className="hex-clip flex h-12 w-10 items-center justify-center bg-slate-800/80 p-0.5">
              <div className="hex-clip flex h-[44px] w-[36px] items-center justify-center bg-[#0b1612] text-slate-500">
                <Lock className="h-3.5 w-3.5" />
              </div>
            </div>
            <span className="whitespace-nowrap font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {sec.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

