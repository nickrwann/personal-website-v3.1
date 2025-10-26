import { useState, useRef, useEffect } from "react";
import { RefreshCw, Plus, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
  onRefresh: () => void;
  disabled?: boolean;
}

const MAX_CHARS = 250;

export function ChatInput({ onSend, onRefresh, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (input.trim() && input.length <= MAX_CHARS && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      handleSend();
    }
  };

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      data-testid="container-chat-input"
    >
      <div className="max-w-3xl mx-auto px-4 pb-4">
        <div className="bg-card border border-card-border rounded-xl shadow-lg p-3">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={onRefresh}
              disabled={disabled}
              data-testid="button-refresh"
              className="flex-shrink-0 hover-elevate"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              disabled={disabled}
              data-testid="button-plus"
              className="flex-shrink-0 hover-elevate"
              onClick={() => console.log("Plus button clicked")}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setInput(e.target.value);
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder="Ask anything about Nick..."
                disabled={disabled}
                data-testid="input-question"
                className="pr-16 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" data-testid="text-char-counter">
                {input.length} / {MAX_CHARS}
              </div>
            </div>

            <Button
              size="icon"
              variant="ghost"
              disabled={disabled}
              data-testid="button-mic"
              className="flex-shrink-0 hover-elevate"
              onClick={() => console.log("Mic button clicked")}
            >
              <Mic className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={handleSend}
              disabled={disabled || !input.trim() || input.length > MAX_CHARS}
              data-testid="button-send"
              className="flex-shrink-0 bg-send-button hover:bg-send-button/90 text-send-button-foreground rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
