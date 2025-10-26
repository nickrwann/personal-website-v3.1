import { useState, useEffect, useRef } from "react";
import { Send, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandingTextarea } from "./ExpandingTextarea";

interface FixedChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
}

const MAX_CHARS = 250;

export function FixedChatInput({ onSend, disabled, onFocusChange }: FixedChatInputProps) {
  const [input, setInput] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && input.length <= MAX_CHARS && !disabled) {
      onSend(input.trim());
      setInput("");
      // Keep focus after sending
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocusChange?.(false);
  };

  // Visual Viewport API for mobile keyboard handling
  useEffect(() => {
    if (typeof window === 'undefined' || !('visualViewport' in window)) {
      return;
    }

    const handleViewportChange = () => {
      const viewport = window.visualViewport;
      if (!viewport) return;

      // Calculate keyboard height
      const keyboardHeight = window.innerHeight - viewport.height;
      
      // Apply offset when keyboard is visible
      if (keyboardHeight > 0) {
        setKeyboardOffset(keyboardHeight);
      } else {
        setKeyboardOffset(0);
      }
    };

    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('scroll', handleViewportChange);

    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed left-0 right-0 z-50 bg-background border-t border-border"
      style={{
        bottom: keyboardOffset > 0 ? `${keyboardOffset}px` : 'env(safe-area-inset-bottom, 0px)',
        transition: 'bottom 0.2s ease-out',
      }}
      data-testid="container-fixed-chat-input"
    >
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="bg-card border border-card-border rounded-lg p-2.5">
          <div className="flex items-end gap-2">
            <Button
              size="icon"
              variant="ghost"
              disabled={disabled}
              data-testid="button-plus"
              className="flex-shrink-0 hover-elevate self-end"
              onClick={() => console.log("Plus button clicked")}
            >
              <Plus className="h-4 w-4" />
            </Button>

            <div className="flex-1 relative min-h-[40px]">
              <div className="pr-12">
                <ExpandingTextarea
                  value={input}
                  onChange={(val) => {
                    if (val.length <= MAX_CHARS) {
                      setInput(val);
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholder="Ask anything about Nick..."
                  disabled={disabled}
                  maxLength={MAX_CHARS}
                  maxHeight={200}
                />
              </div>
              <div 
                className="absolute right-0 bottom-1 text-xs text-muted-foreground pointer-events-none" 
                data-testid="text-char-counter"
              >
                {input.length} / {MAX_CHARS}
              </div>
            </div>

            <Button
              size="icon"
              onClick={handleSend}
              disabled={disabled || !input.trim() || input.length > MAX_CHARS}
              data-testid="button-send"
              className="flex-shrink-0 bg-send-button hover:bg-send-button/90 text-send-button-foreground rounded-full self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
