import { useEffect, useRef, useState, Suspense } from "react";
import SectionHeader from "@/components/primitives/SectionHeader";
import BentoCard from "@/components/primitives/BentoCard";
import GlowBadge from "@/components/primitives/GlowBadge";
import DraggableSkills from "@/components/DraggableSkills";
import ChatBubbles, {
  type ChatMessage,
} from "@/components/primitives/ChatBubbles";
import ThreeScene from "@/components/ThreeScene";

const CURRENTLY = [
  {
    label: "Building CygnisAI & Mandat (civic tech)",
    tone: "primary" as const,
  },
  {
    label: "Exploring SaaS ideas via Reddit research",
    tone: "primary" as const,
  },
  {
    label: "Learning advanced LLM orchestration",
    tone: "primary" as const,
  },
  { label: "Open to collabs & freelance", tone: "live" as const },
];

const STEPS = [
  {
    id: "01",
    title: "Ideate",
    body: "Reddit research, user pain-points & rapid wireframes — no idea ships without a 'why now'.",
  },
  {
    id: "02",
    title: "Build",
    body: "Production-grade React, TS, AI orchestration. Tight feedback loops with the design system.",
  },
  {
    id: "03",
    title: "Ship",
    body: "Vercel previews, edge functions, analytics wired in from day one. Public by default.",
  },
];

/** Mini-conversation surfaced inside the About bento — modeled after the
 *  Framer "XChatWindow" template. Recruiter/user side on the left, me on
 *  the right. */
const CHAT_PREVIEW: ChatMessage[] = [
  {
    id: "c1",
    side: "left",
    name: "Recruiter",
    body: "Hey Simon, your portfolio caught my eye — what are you currently shipping?",
  },
  {
    id: "c2",
    side: "right",
    name: "Me",
    body: "Two products live on Vercel: CygnisAI (AI assistant suite) and Mandat (civic-tech workspace).",
  },
  {
    id: "c3",
    side: "left",
    name: "Recruiter",
    body: "Nice. Are you open to a contract?",
  },
  {
    id: "c4",
    side: "right",
    name: "Me",
    body: "Yes — for short, well-scoped AI or full-stack builds. Use the contact form below.",
  },
];

const TONE_CLASS: Record<string, string> = {
  primary: "bg-primary",
  live: "bg-emerald-400",
};

/** Mounts the (heavy) ThreeScene only while the section is in viewport. */
const LazyThreeScene = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {inView && (
        <Suspense fallback={null}>
          <ThreeScene />
        </Suspense>
      )}
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className="py-24 px-4 relative overflow-hidden">
      <div className="container max-w-6xl mx-auto space-y-12">
        <SectionHeader
          index="01 / The Maker"
          title="An indie maker obsessed with shipping."
          description="Self-taught French developer at the intersection of AI, civic-tech and developer tooling. This is how I work, what I'm focused on and the interactive identity card I made for fun."
          eyebrow={<GlowBadge variant="new">About me</GlowBadge>}
        />

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 auto-rows-[minmax(220px,auto)]">
          {/* Currently — 2 cols */}
          <BentoCard
            className="md:col-span-2 row-span-1"
            glow
            ariaLabel="What I'm focused on right now"
          >
            <div className="space-y-4 h-full flex flex-col">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary/80">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Currently
              </div>
              <ul className="space-y-3 font-mono">
                {CURRENTLY.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center gap-3 text-foreground/85"
                  >
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${TONE_CLASS[item.tone]}`}
                    />
                    <span
                      className={
                        item.tone === "live" ? "text-emerald-300" : ""
                      }
                    >
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-auto text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-4">
                &ldquo;The best way to predict the future is to build it.&rdquo;
              </p>
            </div>
          </BentoCard>

          {/* Interactive identity — 3D scene — 1 column but tall */}
          <BentoCard
            className="md:row-span-2 relative overflow-hidden min-h-[400px]"
            glow
            ariaLabel="Interactive 3D identity card"
          >
            <div className="relative h-full flex flex-col">
              <div className="flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-widest text-primary/80 z-10">
                <span>Identity</span>
                <GlowBadge variant="live">Interactive</GlowBadge>
              </div>
              <div className="flex-1 relative">
                <LazyThreeScene />
              </div>
              <p className="text-xs text-muted-foreground z-10">
                <span className="font-mono text-primary">↳</span> Move your
                cursor around — parallax + glow.
              </p>
            </div>
          </BentoCard>

          {/* Process — 2 cols, full row */}
          <BentoCard
            className="md:col-span-2"
            ariaLabel="My indie shipping process"
          >
            <div className="space-y-4">
              <div className="text-xs font-mono uppercase tracking-widest text-primary/80">
                Process
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {STEPS.map((s) => (
                  <div key={s.id} className="space-y-2">
                    <p className="font-mono text-2xl text-gradient">{s.id}</p>
                    <p className="font-display font-semibold text-lg">
                      {s.title}
                    </p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </BentoCard>

          {/* XChatWindow preview — replaces the former step card so the
              right column still balances 3 cards tall. */}
          <BentoCard
            className="md:row-span-2 relative overflow-hidden"
            glow
            ariaLabel="Live conversation preview"
          >
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-widest text-primary/80">
                <span>Live convo</span>
                <GlowBadge variant="live">Interactive</GlowBadge>
              </div>
              <ChatBubbles messages={CHAT_PREVIEW} stagger={0.35} />
              <p className="text-[11px] text-muted-foreground/80 leading-relaxed mt-auto">
                <span className="font-mono text-primary">↳</span> Bubbles
                cascade in once the card scrolls into view.
              </p>
            </div>
          </BentoCard>

          {/* Draggable Skills — full width */}
          <BentoCard
            className="md:col-span-3"
            ariaLabel="Drag to reorder my skill clusters"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2 text-xs font-mono uppercase tracking-widest text-primary/80">
                <span>Skills — drag to reorder</span>
                <GlowBadge variant="new">Interactive</GlowBadge>
              </div>
              <div className="flex justify-center pt-2">
                <DraggableSkills />
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

export default About;
