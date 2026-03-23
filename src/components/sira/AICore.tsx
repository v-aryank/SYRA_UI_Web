/**
 * AICore — The glowing organic blob at the center of the SIRA interface.
 * Contains 3 morphing blob layers that animate independently.
 * Accepts `state` prop: "idle" | "listening" | "thinking" | "speaking"
 * The parent wraps this with the appropriate sira-state-* class.
 */

interface AICoreProps {
  state?: "idle" | "listening" | "thinking" | "speaking";
}

const AICore = ({ state = "idle" }: AICoreProps) => {
  return (
    <div
      className={`sira-state-${state} relative flex items-center justify-center`}
      style={{ width: "var(--sira-core-size)", height: "var(--sira-core-size)" }}
    >
      {/* Ambient glow behind the core */}
      <div
        className="absolute inset-0 rounded-full opacity-30 blur-3xl"
        style={{
          background: "radial-gradient(circle, hsl(225 100% 55% / 0.5) 0%, transparent 70%)",
        }}
      />

      {/* Blob layer 1 */}
      <span
        className="sira-core-blob absolute inset-0"
        style={{
          background: "radial-gradient(circle at 35% 35%, hsl(225 100% 65% / 0.08) 0%, hsl(225 100% 55% / 0.03) 50%, transparent 70%)",
          boxShadow: "0 0 50px hsl(225 100% 55% / 0.4), inset 0 0 50px hsl(225 100% 55% / 0.2)",
          animation: "sira-blob-morph1 6s infinite linear, sira-pulse-idle 4s ease-in-out infinite",
          borderRadius: "30% 60% 63% 37% / 40% 45% 58% 60%",
        }}
      />

      {/* Blob layer 2 */}
      <span
        className="sira-core-blob absolute inset-0"
        style={{
          background: "radial-gradient(circle at 65% 65%, hsl(260 80% 55% / 0.06) 0%, transparent 60%)",
          boxShadow: "0 0 40px hsl(225 100% 55% / 0.3), inset 0 0 40px hsl(260 80% 55% / 0.15)",
          animation: "sira-blob-morph2 4s infinite linear, sira-pulse-idle 4s ease-in-out infinite",
          borderRadius: "35% 55% 58% 45% / 48% 50% 60% 50%",
        }}
      />

      {/* Blob layer 3 */}
      <span
        className="sira-core-blob absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, hsl(225 100% 55% / 0.04) 0%, transparent 50%)",
          boxShadow: "0 0 60px hsl(225 100% 55% / 0.2), inset 0 0 60px hsl(225 100% 55% / 0.1)",
          animation: "sira-blob-morph3 8s infinite linear, sira-pulse-idle 4s ease-in-out infinite",
          borderRadius: "40% 44% 47% 37% / 40% 45% 43% 45%",
        }}
      />

      {/* Center bright point */}
      <div
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: "hsl(225 100% 80%)",
          boxShadow: "0 0 20px hsl(225 100% 70% / 0.8), 0 0 60px hsl(225 100% 55% / 0.4)",
        }}
      />

      {/* SIRA label */}
      <span
        className="absolute font-display text-sm tracking-[0.3em] uppercase sira-neon-text"
        style={{ bottom: "-2rem" }}
      >
        SIRA
      </span>
    </div>
  );
};

export default AICore;
