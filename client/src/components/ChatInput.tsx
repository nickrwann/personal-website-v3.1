import { useState, useRef, useEffect } from "react";
import { RefreshCw, Send } from "lucide-react";
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
    let scrollStartY = window.scrollY;
    let isUserScrolling = false;

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

    const handleScrollStart = () => {
      scrollStartY = window.scrollY;
      isUserScrolling = true;
    };

    const handleScrollEnd = () => {
      const currentScrollY = window.scrollY;
      const scrollDistance = scrollStartY - currentScrollY;
      
      // If user scrolled up significantly (>100px) while keyboard is open, dismiss keyboard
      // This avoids dismissing on small OS-induced scroll adjustments
      if (isUserScrolling && scrollDistance > 100 && keyboardOffset > 0) {
        textareaRef.current?.blur();
      }
      
      isUserScrolling = false;
    };

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (!isUserScrolling) {
        handleScrollStart();
      }
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScrollEnd, 150);
    };

    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('scroll', handleViewportChange);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      clearTimeout(scrollTimeout);
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [keyboardOffset]);

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
        <div className="flex items-center gap-2 p-2.5">
          {/* Refresh icon - far left */}
          <Button
            size="icon"
            variant="ghost"
            onClick={onRefresh || (() => window.location.reload())}
            disabled={disabled}
            data-testid="button-refresh"
            className="flex-shrink-0 hover-elevate h-9 w-9"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Expanding textarea */}
          <div className="flex-1 min-w-0">
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

          {/* Character counter */}
          <div 
            className="flex-shrink-0 text-xs text-muted-foreground select-none whitespace-nowrap" 
            data-testid="text-char-counter"
          >
            {value.length}/{MAX_CHARS}
          </div>

          {/* Send button - circular pill on far right */}
          <Button
            size="icon"
            onClick={handleSend}
            disabled={disabled || !value.trim() || value.length > MAX_CHARS}
            data-testid="button-send"
            className="flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-9 w-9 flex items-center justify-center"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
