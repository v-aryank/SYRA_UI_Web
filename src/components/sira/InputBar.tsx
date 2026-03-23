/**
 * InputBar — Bottom-center input area with chat box, mic, chat, and settings buttons.
 * Uses glassmorphism styling from the design system.
 * Mic button toggles listening state with animation.
 */
import { useState, type KeyboardEvent } from "react";
import { Mic, MessageSquare, Settings, Send } from "lucide-react";

interface InputBarProps {
  onSend?: (message: string) => void;
  onMicToggle?: (listening: boolean) => void;
  onSettingsClick?: () => void;
  isListening?: boolean;
}

const InputBar = ({
  onSend,
  onMicToggle,
  onSettingsClick,
  isListening = false,
}: InputBarProps) => {
  const [message, setMessage] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSend?.(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 animate-fade-in">
      {/* Input container with glassmorphism */}
      <div
        className={`sira-glass flex items-center gap-2 px-4 py-2 transition-all duration-300 ${
          focused ? "border-primary/40 shadow-[0_0_30px_hsl(225_100%_55%/0.15)]" : ""
        }`}
      >
        {/* Chat input */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask me anything..."
          className="flex-1 bg-transparent border-none outline-none text-foreground font-body text-base placeholder:text-muted-foreground"
        />

        {/* Send button — only visible when there's text */}
        {message.trim() && (
          <button
            onClick={handleSend}
            className="sira-btn-glow p-2 rounded-lg"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        )}

        {/* Mic button */}
        <button
          onClick={() => onMicToggle?.(!isListening)}
          className={`sira-btn-glow p-2 rounded-lg transition-all duration-300 ${
            isListening
              ? "!border-primary/80 shadow-[0_0_20px_hsl(225_100%_55%/0.5)] !bg-primary/20"
              : ""
          }`}
          title="Microphone"
        >
          <Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />
        </button>

        {/* Chat button */}
        <button
          className="sira-btn-glow p-2 rounded-lg"
          title="Chat"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        {/* Settings button */}
        <button
          onClick={onSettingsClick}
          className="sira-btn-glow p-2 rounded-lg"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Status indicator */}
      <p className="text-center text-muted-foreground text-xs mt-3 font-body tracking-wider uppercase">
        {isListening ? "Listening..." : "Ready"}
      </p>
    </div>
  );
};

export default InputBar;
