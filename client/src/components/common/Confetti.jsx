import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Zero-dependency confetti burst powered by framer-motion.
 *
 * Usage — imperative hook:
 *   const { fire, ConfettiPortal } = useConfetti();
 *   <button onClick={fire}>Mark returned</button>
 *   <ConfettiPortal />
 *
 * The burst is small (24 particles) and ephemeral (~1.2s) — delightful, not disruptive.
 * Honours prefers-reduced-motion (no burst is rendered).
 */

const COLORS = ["#8B5CF6", "#22C55E", "#F59E0B", "#EC4899", "#3B82F6", "#FCD34D"];
const PARTICLE_COUNT = 24;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export const useConfetti = () => {
  const [bursts, setBursts] = useState([]);

  const fire = useCallback((opts = {}) => {
    if (prefersReducedMotion()) return;
    const id = Math.random().toString(36).slice(2);
    setBursts((b) => [...b, { id, origin: opts.origin || { x: "50%", y: "30%" } }]);
    window.setTimeout(
      () => setBursts((b) => b.filter((x) => x.id !== id)),
      1400
    );
  }, []);

  const ConfettiPortal = useCallback(
    () => (
      <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden="true">
        <AnimatePresence>
          {bursts.map((burst) => (
            <Burst key={burst.id} origin={burst.origin} />
          ))}
        </AnimatePresence>
      </div>
    ),
    [bursts]
  );

  return { fire, ConfettiPortal };
};

const Burst = ({ origin }) => {
  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
    const velocity = 120 + Math.random() * 120;
    return {
      id: i,
      x: Math.cos(angle) * velocity,
      y: Math.sin(angle) * velocity - 40, // bias upward
      rotate: Math.random() * 540,
      color: COLORS[i % COLORS.length],
      size: 6 + Math.random() * 6,
      shape: i % 3 === 0 ? "circle" : "square",
    };
  });

  return (
    <div
      className="absolute"
      style={{ left: origin.x, top: origin.y, transform: "translate(-50%, -50%)" }}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: p.x,
            y: p.y + 80,       // gravity drift
            opacity: 0,
            rotate: p.rotate,
            scale: 0.7,
          }}
          transition={{ duration: 1.1, ease: [0.2, 0.6, 0.2, 1] }}
          className={p.shape === "circle" ? "absolute rounded-full" : "absolute rounded-[2px]"}
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Declarative fire-on-mount wrapper. Handy for success modals.
 *   {showCheckmark && <ConfettiOnMount />}
 */
export const ConfettiOnMount = ({ origin }) => {
  const { fire, ConfettiPortal } = useConfetti();
  useEffect(() => {
    fire({ origin });
  }, [fire, origin]);
  return <ConfettiPortal />;
};

export default useConfetti;
