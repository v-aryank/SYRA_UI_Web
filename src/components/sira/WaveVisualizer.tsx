/**
 * WaveVisualizer — Canvas-based audio wave animation similar to SiriWave.
 * Renders smooth sine waves that respond to the current AI state.
 * Purely visual — no actual audio processing.
 */
import { useEffect, useRef } from "react";

interface WaveVisualizerProps {
  state?: "idle" | "listening" | "thinking" | "speaking";
}

const WaveVisualizer = ({ state = "idle" }: WaveVisualizerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 120;
    };
    resize();
    window.addEventListener("resize", resize);

    let phase = 0;

    // Amplitude and speed vary by state
    const stateConfig = {
      idle: { amp: 12, speed: 0.015, waves: 3 },
      listening: { amp: 25, speed: 0.04, waves: 4 },
      thinking: { amp: 18, speed: 0.03, waves: 5 },
      speaking: { amp: 35, speed: 0.05, waves: 4 },
    };

    const draw = () => {
      const { amp, speed, waves } = stateConfig[state];
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      phase += speed;

      for (let w = 0; w < waves; w++) {
        const alpha = 0.15 + (0.2 / (w + 1));
        ctx.beginPath();
        ctx.strokeStyle = `hsla(225, 100%, 60%, ${alpha})`;
        ctx.lineWidth = 1.5;

        const freq = 0.008 + w * 0.003;
        const phaseOffset = w * 0.8;
        const waveAmp = amp * (1 - w * 0.15);

        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 +
            Math.sin(x * freq + phase + phaseOffset) * waveAmp *
            Math.sin((x / canvas.width) * Math.PI); // envelope
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Center glow line
      ctx.beginPath();
      ctx.strokeStyle = "hsla(225, 100%, 70%, 0.5)";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "hsl(225, 100%, 55%)";
      for (let x = 0; x < canvas.width; x++) {
        const y = canvas.height / 2 +
          Math.sin(x * 0.01 + phase) * amp *
          Math.sin((x / canvas.width) * Math.PI);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [state]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full opacity-80"
      style={{ height: "120px" }}
    />
  );
};

export default WaveVisualizer;
