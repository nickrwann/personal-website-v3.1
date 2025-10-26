import { useState, useRef, useEffect } from "react";
import { RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatFooterProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onRefresh: () => void;
  onSuggestionClick: (text: string) => void;
  hasSentMessage: boolean;
  disabled?: boolean;
  suggestions: string[];
}

const MAX_CHARS = 250;

export function ChatFooter({
  draft,
  onDraftChange,
  onSend,
  onRefresh,
  onSuggestionClick,
  hasSentMessage,
  disabled,
  suggestions
}: ChatFooterProps) {
  const footerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keep footer above keyboard on mobile
  useEffect(() => {
    function updateForViewport() {
      if (!footerRef.current || !window.visualViewport) return;

      const vv = window.visualViewport;
      const keyboardHeight = window.innerHeight - vv.height;
      const isOpen = keyboardHeight > 50;

      footerRef.current.style.transform = isOpen
        ? `translateY(-${keyboardHeight}px)`
        : "translateY(0)";
      
      footerRef.current.style.transition = isOpen ? 'none' : 'transform 0.2s ease-out';
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateForViewport);
      window.visualViewport.addEventListener("scroll", updateForViewport);
    }

    updateForViewport();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateForViewport);
        window.visualViewport.removeEventListener("scroll", updateForViewport);
      }
    };
  }, []);

  // Auto-grow textarea up to max height
  const handleDraftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > MAX_CHARS) return;
    onDraftChange(value);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const nextHeight = Math.min(textareaRef.current.scrollHeight, 200);
      textareaRef.current.style.height = nextHeight + "px";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleSuggestionClick = (text: string) => {
    onSuggestionClick(text);
    
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        const nextHeight = Math.min(textareaRef.current.scrollHeight, 200);
        textareaRef.current.style.height = nextHeight + "px";
      }
    });
  };

  const showSuggestions = !hasSentMessage && suggestions.length > 0;

  return (
    <div
      ref={footerRef}
      className="relative z-30 w-full bg-background px-4 pb-safe pt-3"
      data-testid="container-chat-footer"
    >
      {/* Suggestion pills */}
      {showSuggestions && (
        <div className="mb-3 flex flex-wrap items-start justify-center gap-2 sm:justify-start" data-testid="container-suggestions-wrapper">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={disabled}
              data-testid={`button-suggestion-${index}`}
              className="text-sm px-3 py-2 hover-elevate whitespace-normal text-center max-w-full break-words"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div className="bg-card border border-card-border rounded-lg shadow-sm">
        <div className="flex items-end gap-2 p-2.5">
          {/* Refresh icon */}
          <Button
            size="icon"
            variant="ghost"
            onClick={onRefresh}
            disabled={disabled}
            data-testid="button-refresh"
            className="flex-shrink-0 hover-elevate h-9 w-9 mb-0.5"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {/* Textarea and counter wrapper */}
          <div className="flex-1 min-w-0 flex flex-col">
            <textarea
              ref={textareaRef}
              className="w-full resize-none bg-transparent text-base leading-relaxed text-foreground placeholder-muted-foreground outline-none max-h-[200px] overflow-y-auto"
              rows={1}
              value={draft}
              onChange={handleDraftChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about Nick..."
              disabled={disabled}
              data-testid="input-message"
            />
            <div className="flex w-full justify-end text-[11px] leading-none text-muted-foreground select-none" data-testid="text-char-counter">
              {draft.length} / {MAX_CHARS}
            </div>
          </div>

          {/* Send button */}
          <Button
            size="icon"
            onClick={onSend}
            disabled={disabled || !draft.trim() || draft.length > MAX_CHARS}
            data-testid="button-send"
            className="flex-shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-9 w-9 flex items-center justify-center mb-0.5"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
