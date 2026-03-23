/**
 * AICore — The glowing organic blob from original SIRA.
 * Faithfully recreates the 3-span rotating blob with the same
 * box-shadows, border-radius values, and rotation animations.
 * Accepts `state` prop for visual state changes.
 */

interface AICoreProps {
  state?: "idle" | "listening" | "thinking" | "speaking";
}

const AICore = ({ state = "idle" }: AICoreProps) => {
  return (
    <div
      className={`sira-state-${state} absolute flex items-center justify-center`}
      style={{
        width: "clamp(200px, 35vmin, 400px)",
        height: "clamp(200px, 35vmin, 400px)",
      }}
    >
      {/* Blob span 1 — original animate1: full 360° rotation in 6s */}
      <span
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#6b72ff00 50%, #000dff05 50%)",
          boxShadow: "0 0 50px #000dff, inset 0 0 50px #1919ff",
          borderRadius: "30% 60% 63% 37% / 40% 45% 58% 60%",
          animation: "sira-blob-rotate1 6s infinite linear",
          cursor: "pointer",
        }}
      />

      {/* Blob span 2 — original animate2: 90° to 270° in 4s */}
      <span
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#6b72ff00 50%, #000dff05 50%)",
          boxShadow: "0 0 50px #000dff, inset 0 0 50px rgb(25, 25, 255)",
          borderRadius: "35% 55% 58% 45% / 48% 50% 60% 50%",
          animation: "sira-blob-rotate2 4s infinite linear",
          cursor: "pointer",
        }}
      />

      {/* Blob span 3 — original animate3: 8s rotation */}
      <span
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(#6b72ff00 50%, #000dff05 50%)",
          boxShadow: "0 0 50px #000dff, inset 0 0 50px rgb(25, 25, 255)",
          borderRadius: "30% 44% 47% 37% / 40% 45% 43% 45%",
          animation: "sira-blob-rotate3 8s infinite linear",
          cursor: "pointer",
        }}
      />

      {/* SIRA label */}
      <span
        className="absolute font-display text-sm tracking-[0.3em] uppercase sira-neon-text z-10"
        style={{ bottom: "-2.5rem" }}
      >
        SIRA
      </span>
    </div>
  );
};

export default AICore;
