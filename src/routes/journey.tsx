import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Map,
  Swords,
  Sparkles,
  Flame,
  Trophy,
  Store,
  User,
  Shield,
  Zap,
  Coins,
  Edit,
} from "lucide-react";
import backdrop from "@/assets/realm-backdrop.jpg";
import { ArcaneOverlay } from "@/components/character/ArcaneOverlay";
import { WindingPathRoadmap } from "@/components/hub/WindingPathRoadmap";
import { DailyMissions } from "@/components/hub/DailyMissions";
import { StepViewerModal } from "@/components/journey/StepViewerModal";
import { useStudyStore } from "@/hooks/useStudyStore";
import { StepData } from "@/lib/templates";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Journey — Learning Path Roadmap" },
      {
        name: "description",
        content:
          "Navigate your interactive study map, unlock methodology steps, complete tasks, and earn rewards.",
      },
      { property: "og:title", content: "Journey — Learning Path Roadmap" },
      {
        property: "og:description",
        content: "Navigate your interactive study map and earn rewards.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JourneyPage,
});

const MENU = [
  { icon: Map, label: "JOURNEY", to: "/journey" as const },
  { icon: Swords, label: "PRACTICE", to: "/quests" as const },
  { icon: Sparkles, label: "MISSIONS", to: "/hub" as const },
  { icon: Flame, label: "STREAK CLUB", to: "/hub" as const },
  { icon: Trophy, label: "LEADERBOARD", to: "/hub" as const },
  { icon: Store, label: "STORE", to: "/hub" as const },
  { icon: User, label: "CHARACTER", to: "/character" as const },
];

function JourneyPage() {
  const { containers, stats, completeStep } = useStudyStore();

  const [activeStep, setActiveStep] = useState<{
    step: StepData;
    skillTitle: string;
    sectionTitle: string;
    topicTitle: string;
  } | null>(null);

  const firstContainer = containers[0];
  const firstSection = firstContainer?.sections[0];
  const firstTopic = firstSection?.topics[0] || firstContainer?.topics[0];

  const currentSkillTitle = firstContainer?.title || "VALENCIANO";
  const currentSectionTitle = firstSection?.title || "LECTURA I COMPRENSIÓ";
  const currentTopicTitle = firstTopic?.title || "LECTURA I COMPRENSIÓ";

  const pathSteps = firstTopic?.steps || [];
  const completedCount = pathSteps.filter((s) => s.done).length;
  const totalCount = pathSteps.length > 0 ? pathSteps.length : 5;

  return (
    <div className="realm-dark relative min-h-screen bg-[#06120b] text-foreground select-none">
      {/* Background layer */}
      <div className="pointer-events-none fixed inset-0">
        <img
          src={backdrop}
          alt=""
          width={1920}
          height={1280}
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-[radial-gradient(1100px_650px_at_50%_25%,transparent,color-mix(in_oklab,var(--background)_90%,transparent))]" />
        <ArcaneOverlay />
      </div>

      {/* App frame layout */}
      <div className="relative z-10 mx-auto flex max-w-[1560px] gap-6 px-4 py-6 md:px-6">
        {/* Left Sidebar matching Photo 1 */}
        <aside className="sticky top-6 hidden h-fit w-60 shrink-0 lg:block">
          <div className="rune-frame rounded-2xl border border-primary/40 bg-card/60 p-4 backdrop-blur-md">
            <Link
              to="/"
              className="block px-2 pb-3 font-display text-xl uppercase tracking-[0.25em] text-primary drop-shadow-[0_2px_8px_rgba(200,170,110,0.4)]"
            >
              Realm
            </Link>
            <div className="mb-4 h-px w-full gold-rule" />
            <nav className="flex flex-col gap-1.5">
              {MENU.map(({ icon: Icon, label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 transition ${
                    label === "JOURNEY"
                      ? "border border-primary/70 bg-primary/20 text-primary shadow-[0_0_16px_rgba(200,170,110,0.25)]"
                      : "border border-transparent text-muted-foreground hover:bg-card/70 hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-display text-xs font-bold uppercase tracking-[0.16em]">
                    {label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Center Main Area */}
        <main className="min-w-0 flex-1">
          {/* Header Card matching Photo 1 */}
          <div className="rune-frame mb-6 rounded-2xl border border-primary/40 bg-card/70 p-5 backdrop-blur-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                {/* IDENTITY ➔ AREA ➔ SKILL ➔ TOPIC Breadcrumb */}
                <div className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-primary/70">
                  <span>IDENTITY</span>
                  <span>➔</span>
                  <span>AREA</span>
                  <span>➔</span>
                  <span>SKILL</span>
                  <span>➔</span>
                  <span className="text-primary">{currentTopicTitle}</span>
                </div>
                <h1 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-[0.22em] text-primary drop-shadow-md">
                  {currentTopicTitle}
                </h1>
              </div>

              {/* Progress counter bar matching Photo 1 (e.g. 2/5) */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-2.5 w-48 overflow-hidden rounded-full bg-black/80 p-0.5 border border-primary/30">
                    <div className="flex h-full w-full rounded-full overflow-hidden">
                      <div className="h-full bg-accent transition-all duration-500" style={{ width: "40%" }} />
                      <div className="h-full bg-primary transition-all duration-500" style={{ width: "20%" }} />
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    {completedCount || 2}/{totalCount}
                  </span>
                </div>

                <Link
                  to="/hub"
                  className="flex items-center gap-1.5 rounded-lg border border-primary/40 bg-primary/15 px-3 py-1.5 text-primary hover:bg-primary/30 transition"
                  title="Modelate path in hub"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span className="font-display uppercase tracking-wider text-[10px]">Model</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Winding Path Roadmap */}
          <div className="rune-frame rounded-2xl border border-primary/30 bg-card/40 backdrop-blur-md min-h-[640px]">
            <WindingPathRoadmap
              steps={pathSteps}
              onNodeClick={(step) => {
                setActiveStep({
                  step,
                  skillTitle: currentSkillTitle,
                  sectionTitle: currentSectionTitle,
                  topicTitle: currentTopicTitle,
                });
              }}
            />
          </div>
        </main>

        {/* Right Rail: Daily Missions & Quest Board */}
        <aside className="hidden w-80 shrink-0 flex-col gap-6 xl:flex">
          <DailyMissions />
        </aside>
      </div>

      {/* Step Interactive Viewer Modal */}
      {activeStep && (
        <StepViewerModal
          isOpen={Boolean(activeStep)}
          step={activeStep.step}
          skillTitle={activeStep.skillTitle}
          sectionTitle={activeStep.sectionTitle}
          topicTitle={activeStep.topicTitle}
          onClose={() => setActiveStep(null)}
          onCompleteStep={(stepId) => completeStep(stepId)}
        />
      )}
    </div>
  );
}

