import { useState, useEffect, useRef } from "react";
import { SuggestionPills } from "./SuggestionPills";

interface ContextualSuggestionsProps {
  onSuggestionClick: (text: string) => void;
  disabled?: boolean;
  isInputFocused: boolean;
  isTyping: boolean;
  sentinelId: string;
}

export function ContextualSuggestions({ 
  onSuggestionClick, 
  disabled, 
  isInputFocused,
  isTyping,
  sentinelId 
}: ContextualSuggestionsProps) {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Determine visibility: at bottom AND not focused AND not typing
  const isVisible = isAtBottom && !isInputFocused && !isTyping;

  useEffect(() => {
    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;

    // Create IntersectionObserver to detect when user is at bottom
    // Use negative rootMargin to require user to be very close to bottom
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsAtBottom(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "-100px 0px 0px 0px", // Require sentinel to be 100px into viewport
        threshold: 0.1,
      }
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [sentinelId]);

  return (
    <div
      className="w-full mb-3 transition-all duration-300 ease-in-out"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
      }}
      data-testid="container-contextual-suggestions"
    >
      <SuggestionPills 
        onSuggestionClick={onSuggestionClick} 
        disabled={disabled} 
      />
    </div>
  );
}
