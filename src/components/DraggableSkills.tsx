import { useRef, useState, useCallback } from "react";

const SKILLS: [string, string][] = [
  ["Front-End",    "React, Next.js, TanStack, Tailwind CSS"],
  ["Back-End",     "Node.js, Hono, Drizzle ORM, SQLite"],
  ["AI / LLMs",   "Groq, Gemini, LangChain, Vercel AI SDK"],
  ["Languages",   "TypeScript, Python, JavaScript"],
  ["DevOps",      "Vercel, GitHub Actions, Docker, Turso"],
];

const GRADIENTS = [
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  "linear-gradient(135deg, #f5576c 0%, #eebd89 100%)",
  "linear-gradient(135deg, #3beb7b 0%, #3fa1fc 100%)",
  "linear-gradient(135deg, #5ee7df 0%, #7e38e0 100%)",
  "linear-gradient(135deg, #fda085 0%, #f6d365 100%)",
];

const ITEM_H = 80; // px

export default function DraggableSkills() {
  const [order, setOrder] = useState<number[]>(SKILLS.map((_, i) => i));
  const dragging = useRef<{ origIdx: number; startY: number; curOrder: number[] } | null>(null);
  const [livePos, setLivePos] = useState<{ idx: number; dy: number } | null>(null);

  const startDrag = useCallback((origIdx: number, startY: number) => {
    dragging.current = { origIdx, startY, curOrder: [...order] };
    setLivePos({ idx: origIdx, dy: 0 });
  }, [order]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dy = e.clientY - dragging.current.startY;
    const { origIdx, curOrder } = dragging.current;
    const curRank = curOrder.indexOf(origIdx);
    const targetRank = Math.max(0, Math.min(SKILLS.length - 1, Math.round((curRank * ITEM_H + dy) / ITEM_H)));

    if (targetRank !== curRank) {
      const newOrder = [...curOrder];
      newOrder.splice(curRank, 1);
      newOrder.splice(targetRank, 0, origIdx);
      dragging.current.curOrder = newOrder;
      setOrder(newOrder);
    }
    setLivePos({ idx: origIdx, dy });
  }, []);

  const endDrag = useCallback(() => {
    if (!dragging.current) return;
    setOrder(dragging.current.curOrder);
    dragging.current = null;
    setLivePos(null);
  }, []);

  return (
    <section id="skills" className="py-24 px-4">
      <div className="container max-w-5xl mx-auto">
        <p className="text-sm font-mono tracking-widest uppercase text-center mb-3" style={{ color: "hsl(217 91% 60% / 0.7)" }}>
          Variable Skill Set
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center">
          My Skills<strong style={{ color: "orange" }}>.</strong>
        </h2>
        <p className="text-center mb-2" style={{ color: "hsl(215 20% 58%)", fontStyle: "italic" }}>
          PS. My skill set is literally variable — try dragging and rearranging one of the skills :p
        </p>

        <div
          className="relative mx-auto select-none w-full max-w-[480px]"
          style={{ height: SKILLS.length * ITEM_H }}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
        >
          {order.map((skillIdx, rank) => {
            const isDragging = livePos?.idx === skillIdx;
            const dy = isDragging ? livePos!.dy : 0;
            const visualY = rank * ITEM_H + dy;

            return (
              <div
                key={skillIdx}
                translate="no"
                onPointerDown={(e) => {
                  e.currentTarget.setPointerCapture(e.pointerId);
                  startDrag(skillIdx, e.clientY);
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: ITEM_H - 8,
                  transform: `translate3d(0, ${visualY}px, 0) scale(${isDragging ? 1.04 : 1})`,
                  zIndex: isDragging ? 10 : 1,
                  transition: isDragging ? "none" : "transform 0.2s ease",
                  borderRadius: 12,
                  background: GRADIENTS[skillIdx % GRADIENTS.length],
                  boxShadow: isDragging
                    ? "rgba(0,0,0,0.3) 0px 16px 40px 0px"
                    : "rgba(0,0,0,0.12) 0px 4px 12px 0px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 28,
                  cursor: "grab",
                  color: "#fff",
                  fontSize: 16,
                  fontWeight: 600,
                  userSelect: "none",
                }}
              >
                {SKILLS[skillIdx][0]}
                <span style={{ fontWeight: 400, opacity: 0.85, marginLeft: 8, fontSize: 13 }}>
                  — {SKILLS[skillIdx][1]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
