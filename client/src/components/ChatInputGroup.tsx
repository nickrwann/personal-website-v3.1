import { useState, useRef, useEffect } from "react";
import { RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpandingTextarea } from "./ExpandingTextarea";

interface ChatInputGroupProps {
  onSend: (message: string) => void;
  onRefresh?: () => void;
  onSuggestionClick: (text: string) => void;
  disabled?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  hasSentMessage: boolean;
}

const MAX_CHARS = 250;

const SUGGESTIONS = [
  "Why should I hire Nick?",
  "What is Nick best at?",
  "What is Nick's coolest project?",
];

export function ChatInputGroup({ 
  onSend, 
  onRefresh, 
  onSuggestionClick,
  disabled,
  inputValue,
  onInputChange,
  hasSentMessage
}: ChatInputGroupProps) {
  const [input, setInput] = useState("");
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const keyboardOffsetRef = useRef(0);

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

  const handlePillClick = (text: string) => {
    // Populate textarea and focus it
    setValue(text);
    // Notify parent component
    onSuggestionClick(text);
    // Focus textarea after a brief delay to ensure value is set
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 10);
  };

  const handleRefresh = () => {
    // Reset local input state
    setValue("");
    // Call parent refresh handler if provided
    onRefresh?.();
  };

  // Keep ref in sync with state
  useEffect(() => {
    keyboardOffsetRef.current = keyboardOffset;
  }, [keyboardOffset]);

  // Visual Viewport API for mobile keyboard handling
  useEffect(() => {
    if (typeof window === 'undefined' || !('visualViewport' in window)) {
      return;
    }

    let rafId: number | null = null;
    let scrollStartY = window.scrollY;

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

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Use ref to get current keyboard offset (not stale closure value)
      const currentKeyboardOffset = keyboardOffsetRef.current;
      
      // Only check for upward scroll while keyboard is open
      if (currentKeyboardOffset > 0) {
        const scrollDistance = scrollStartY - currentScrollY;
        
        // If user scrolled up at all, dismiss keyboard
        // Any intentional upward scroll while typing is a signal to dismiss
        if (scrollDistance > 0) {
          textareaRef.current?.blur();
        }
        
        scrollStartY = currentScrollY;
      }
    };

    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('scroll', handleViewportChange);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Empty deps - listeners stay registered, use ref for latest value

  // Show pills if no message has been sent
  const showSuggestions = !hasSentMessage;

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{
        paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
        transform: keyboardOffset > 0 ? `translateY(-${keyboardOffset}px)` : 'translateY(0)',
        transition: keyboardOffset > 0 ? 'none' : 'transform 0.2s ease-out',
      }}
      data-testid="container-chat-input-group"
    >
      {/* Single rounded card containing both pills and input row */}
      <div className="bg-card border border-card-border rounded-3xl shadow-sm overflow-hidden">
        {/* Suggestion pills - vertical stack */}
        {showSuggestions && (
          <div className="px-4 pt-4 pb-3 space-y-2" data-testid="container-suggestions-wrapper">
            {SUGGESTIONS.map((suggestion, index) => (
              <Button
                key={index}
                variant="secondary"
                onClick={() => handlePillClick(suggestion)}
                disabled={disabled}
                data-testid={`button-suggestion-${index}`}
                className="w-full px-4 py-3 h-auto text-sm text-left justify-start rounded-2xl hover-elevate active-elevate-2 whitespace-normal"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        )}

        {/* Input row - separator line when pills are visible */}
        {showSuggestions && (
          <div className="border-t border-border mx-4" />
        )}

        {/* Input row */}
        <div className="flex items-center gap-2 p-3">
          {/* Refresh icon - far left */}
          <Button
            size="icon"
            variant="ghost"
            onClick={handleRefresh}
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
