/**
 * BackgroundGrid — Subtle futuristic grid overlay for depth.
 * Renders a CSS-only radial gradient + grid pattern behind the main content.
 */
const BackgroundGrid = () => (
  <div className="fixed inset-0 pointer-events-none z-0">
    {/* Radial vignette */}
    <div
      className="absolute inset-0"
      style={{
        background: "radial-gradient(ellipse at center, transparent 0%, hsl(220 20% 2%) 70%)",
      }}
    />
    {/* Subtle grid */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "linear-gradient(hsl(225 100% 55% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(225 100% 55% / 0.3) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
      }}
    />
  </div>
);

export default BackgroundGrid;
