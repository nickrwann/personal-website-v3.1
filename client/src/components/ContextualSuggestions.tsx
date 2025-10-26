import { useState, useEffect, useRef } from "react";
import { SuggestionPills } from "./SuggestionPills";

interface ContextualSuggestionsProps {
  onSuggestionClick: (text: string) => void;
  disabled?: boolean;
  hasSentMessage: boolean;
  sentinelId: string;
}

export function ContextualSuggestions({ 
  onSuggestionClick, 
  disabled, 
  hasSentMessage,
  sentinelId 
}: ContextualSuggestionsProps) {
  const [isAtBottom, setIsAtBottom] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Determine visibility: at bottom AND no message sent yet
  const isVisible = isAtBottom && !hasSentMessage;

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
      className="w-full mb-4 transition-all duration-300 ease-in-out"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
        transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
        height: isVisible ? 'auto' : '0',
        overflow: isVisible ? 'visible' : 'hidden',
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
