import { useState, useRef, useEffect } from "react";
import { RefreshCw, Plus, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandingTextarea } from "./ExpandingTextarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  onRefresh?: () => void;
  disabled?: boolean;
  onFocusChange?: (isFocused: boolean) => void;
  inputValue?: string;
  onInputChange?: (value: string) => void;
}

const MAX_CHARS = 250;

export function ChatInput({ 
  onSend, 
  onRefresh, 
  disabled,
  onFocusChange,
  inputValue,
  onInputChange 
}: ChatInputProps) {
  const [input, setInput] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use controlled value if provided, otherwise use internal state
  const value = inputValue !== undefined ? inputValue : input;
  const setValue = inputValue !== undefined ? (onInputChange || (() => {})) : setInput;

  const handleSend = () => {
    if (value.trim() && value.length <= MAX_CHARS && !disabled) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFocus = () => {
    onFocusChange?.(true);
  };

  const handleBlur = () => {
    onFocusChange?.(false);
  };

  // Visual Viewport API for mobile keyboard handling
  useEffect(() => {
    if (typeof window === 'undefined' || !('visualViewport' in window)) {
      return;
    }

    let rafId: number | null = null;

    const handleViewportChange = () => {
      // Cancel any pending animation frame
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }

      // Use requestAnimationFrame to batch updates and prevent jumps
      rafId = requestAnimationFrame(() => {
        const viewport = window.visualViewport;
        if (!viewport) return;

        // Calculate keyboard height
        const keyboardHeight = Math.max(0, window.innerHeight - viewport.height);
        
        // Only update if keyboard is actually visible (height > threshold)
        // This prevents unnecessary updates during normal scrolling
        if (keyboardHeight > 50) {
          setKeyboardOffset(keyboardHeight);
        } else {
          setKeyboardOffset(0);
        }
        
        rafId = null;
      });
    };

    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('scroll', handleViewportChange);

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{
        transform: keyboardOffset > 0 ? `translateY(-${keyboardOffset}px)` : 'translateY(0)',
        transition: 'transform 0.2s ease-out',
      }}
      data-testid="container-chat-input"
    >
      <div className="bg-card border border-card-border rounded-lg shadow-sm">
        <div className="flex items-end gap-1.5 p-2">
          {/* Refresh icon - far left */}
          <Button
            size="icon"
            variant="ghost"
            onClick={onRefresh || (() => window.location.reload())}
            disabled={disabled}
            data-testid="button-refresh"
            className="flex-shrink-0 hover-elevate self-end h-9 w-9"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Plus button */}
          <Button
            size="icon"
            variant="ghost"
            disabled={disabled}
            data-testid="button-plus"
            className="flex-shrink-0 hover-elevate self-end h-9 w-9"
            onClick={() => console.log("Plus button clicked")}
          >
            <Plus className="h-4 w-4" />
          </Button>

          {/* Expanding textarea with character counter */}
          <div className="flex-1 relative min-w-0">
            <div className="pr-14">
              <ExpandingTextarea
                ref={textareaRef}
                value={value}
                onChange={(val) => {
                  if (val.length <= MAX_CHARS) {
                    setValue(val);
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
              className="absolute right-0 bottom-1 text-xs text-muted-foreground pointer-events-none select-none whitespace-nowrap" 
              data-testid="text-char-counter"
            >
              {value.length}/{MAX_CHARS}
            </div>
          </div>

          {/* Mic icon - hidden on narrow screens */}
          <Button
            size="icon"
            variant="ghost"
            disabled={disabled}
            data-testid="button-mic"
            className="flex-shrink-0 hover-elevate self-end h-9 w-9 hidden sm:flex"
            onClick={() => console.log("Mic button clicked")}
          >
            <Mic className="h-4 w-4" />
          </Button>

          {/* Send button - circular pill on far right */}
          <Button
            size="icon"
            onClick={handleSend}
            disabled={disabled || !value.trim() || value.length > MAX_CHARS}
            data-testid="button-send"
            className="flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full self-end h-9 w-9"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
