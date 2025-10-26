import { useState, useEffect, useRef } from "react";
import { SuggestionPills } from "./SuggestionPills";

interface ContextualSuggestionsProps {
  onSuggestionClick: (text: string) => void;
  disabled?: boolean;
  isInputFocused: boolean;
  sentinelId: string;
}

export function ContextualSuggestions({ 
  onSuggestionClick, 
  disabled, 
  isInputFocused,
  sentinelId 
}: ContextualSuggestionsProps) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;

    // Create IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Show suggestions only when sentinel is visible AND input is not focused
        setIsVisible(entry.isIntersecting && !isInputFocused);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sentinelId, isInputFocused]);

  // Hide when input is focused or user types
  useEffect(() => {
    if (isInputFocused) {
      setIsVisible(false);
    }
  }, [isInputFocused]);

  return (
    <div
      className="fixed left-0 right-0 z-40 transition-all duration-300 ease-in-out"
      style={{
        bottom: 'calc(80px + env(safe-area-inset-bottom, 0px))',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      }}
      data-testid="container-contextual-suggestions"
    >
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-background/95 backdrop-blur-sm rounded-lg p-2 border border-border">
          <SuggestionPills 
            onSuggestionClick={onSuggestionClick} 
            disabled={disabled} 
          />
        </div>
      </div>
    </div>
  );
}
