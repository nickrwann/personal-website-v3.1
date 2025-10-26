import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScrollToBottomButtonProps {
  onClick: () => void;
  show: boolean;
}

export function ScrollToBottomButton({ onClick, show }: ScrollToBottomButtonProps) {
  return (
    <div 
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-40 transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
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
