import { Check, Star, Lock, Sparkles } from "lucide-react";
import { StepData } from "@/lib/templates";

type Props = {
  steps: StepData[];
  sectionTitle?: string;
  onNodeClick?: (step: StepData) => void;
};

export function WindingPathRoadmap({ steps, sectionTitle, onNodeClick }: Props) {
  const displayNodes = steps.map((s, idx) => {
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
  });

  // Dynamic Node positions along an S-curve roadmap
  const nodePositions = [
    { x: 48, y: 130 },
    { x: 53, y: 220 },
    { x: 58, y: 310 },
    { x: 54, y: 400 },
    { x: 49, y: 490 },
    { x: 45, y: 580 },
    { x: 50, y: 670 },

  ];

  return (
    <div className="relative min-h-[680px] w-full select-none overflow-hidden py-6">
      {/* Curved SVG Winding Path Background */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 800 750"
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
        {displayNodes.length > 0 && (
          <path
            d="M 384 130 C 420 170, 424 190, 424 220 C 424 260, 464 280, 464 310 C 464 350, 432 370, 432 400 C 432 440, 392 460, 392 490 C 392 530, 360 550, 360 580 C 360 620, 400 640, 400 670"
            fill="none"
            stroke="url(#gold-path-grad)"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        )}
      </svg>

      {/* Dynamic Section Header */}
      <div className="relative z-10 text-center mb-8">
        <h2 className="font-display text-xl uppercase tracking-[0.26em] text-primary/90 shadow-sm drop-shadow-[0_2px_8px_rgba(200,170,110,0.3)]">
          {sectionTitle || "CURRICULUM ROADMAP"}
        </h2>
      </div>

      {/* Winding Path Hex Nodes */}
      {displayNodes.length === 0 ? (
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-center">
          <Sparkles className="h-8 w-8 text-primary/60 mb-3" />
          <h3 className="font-display text-sm uppercase tracking-wider text-muted-foreground">
            No Milestones Created in this Topic Yet
          </h3>
          <p className="mt-1 text-xs text-muted-foreground/70 max-w-xs">
            Use AI Hub to generate and bulk import 5-minute milestones for your topics.
          </p>
        </div>
      ) : (
        <div className="relative z-10 h-[620px] w-full">
          {displayNodes.map((node, i) => {
            const pos = nodePositions[i % nodePositions.length] || { x: 50, y: 100 + i * 85 };

            return (
              <div
                key={node.id}
                style={{ left: `${pos.x}%`, top: `${pos.y}px` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 group cursor-pointer"
                onClick={() => node.rawStep && onNodeClick?.(node.rawStep)}
              >
                {/* Hexagon Shape Container */}
                <div className="relative flex items-center justify-center">
                  {node.active && (
                    <div className="absolute -inset-2 animate-pulse rounded-full bg-primary/30 blur-md" />
                  )}

                  <div
                    className={`hex-clip flex h-14 w-12 items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                      node.completed
                        ? "bg-[linear-gradient(135deg,#00f0b5,#059669)] p-0.5 shadow-[0_0_20px_rgba(0,240,181,0.5)]"
                        : node.active
                          ? "bg-[linear-gradient(135deg,#dfb86c,#c89b3c)] p-0.5 shadow-[0_0_25px_rgba(223,184,108,0.7)]"
                          : "bg-[linear-gradient(135deg,#1e293b,#0f172a)] p-0.5 opacity-85"
                    }`}
                  >
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
      )}
    </div>
  );
}

