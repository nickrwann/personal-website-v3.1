import { Button } from "@/components/ui/button";

interface SuggestionPillsProps {
  onSuggestionClick: (text: string) => void;
  disabled?: boolean;
}

const SUGGESTIONS = [
  "Why should I hire Nick?",
  "What is Nick best at?",
  "What is Nick's coolest project?",
];

export function SuggestionPills({ onSuggestionClick, disabled }: SuggestionPillsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center px-2 sm:px-0" data-testid="container-suggestions">
      {SUGGESTIONS.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSuggestionClick(suggestion)}
          disabled={disabled}
          data-testid={`button-suggestion-${index}`}
          className="text-sm px-3 py-2 hover-elevate whitespace-normal text-center max-w-full break-words"
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}
