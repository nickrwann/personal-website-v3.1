import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  show: boolean;
}

export function ScrollToBottomButton({ onClick, show }: ScrollToBottomButtonProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-24 right-6 z-40 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <Button
        size="icon"
        variant="outline"
        onClick={onClick}
        className="rounded-full shadow-lg bg-background border-border hover-elevate active-elevate-2"
        data-testid="button-scroll-to-bottom"
      >
        <ArrowDown className="w-4 h-4" />
      </Button>
    </div>
  );
}
