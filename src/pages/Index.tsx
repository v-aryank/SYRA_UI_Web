/**
 * SYRA — Main AI Assistant Dashboard
 * Layout: Full viewport flex column
 *   - Center: AI Core with particle sphere overlay
 *   - Bottom: Wave visualizer + Input bar
 * All elements use flexbox for perfect centering and responsiveness.
 */
import { useState } from "react";
import BackgroundGrid from "@/components/syra/BackgroundGrid";
import AICore from "@/components/syra/AICore";
import ParticleCanvas from "@/components/syra/ParticleCanvas";
import WaveVisualizer from "@/components/syra/WaveVisualizer";
import InputBar from "@/components/syra/InputBar";

type SYRAState = "idle" | "listening" | "thinking" | "speaking";

const Index = () => {
  const [state, setState] = useState<SYRAState>("idle");
  const [isListening, setIsListening] = useState(false);

  const handleMicToggle = (listening: boolean) => {
    setIsListening(listening);
    setState(listening ? "listening" : "idle");
  };

  const handleSend = (message: string) => {
    // Simulate thinking → speaking flow for demo
    console.log("User message:", message);
    setState("thinking");
    setTimeout(() => {
      setState("speaking");
      setTimeout(() => setState("idle"), 3000);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden">
      {/* Background effects */}
      <BackgroundGrid />

      {/* Top bar — minimal branding */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <h1 className="font-display text-xs tracking-[0.4em] uppercase SYRA-neon-text">
          SYRA 3.0
        </h1>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">
            {state === "idle" ? "Online" : state}
          </span>
        </div>
      </header>

      {/* Main content — AI Core centered */}
      <main className="relative z-10 flex-1 flex items-center justify-center">
        {/* Particle sphere behind the core */}
        <ParticleCanvas />
        {/* Glowing AI blob core */}
        <AICore state={state} />
      </main>

      {/* Bottom section — Wave + Input */}
      <footer className="relative z-10 flex flex-col items-center pb-6">
        <WaveVisualizer state={state} />
        <div className="mt-2 w-full">
          <InputBar
            onSend={handleSend}
            onMicToggle={handleMicToggle}
            isListening={isListening}
          />
        </div>
      </footer>
    </div>
  );
};

export default Index;
