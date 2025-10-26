import { useState, useRef, useEffect } from "react";
import { RefreshCw, Plus, Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSend: (message: string) => void;
  onRefresh: () => void;
  disabled?: boolean;
}

const MAX_CHARS = 250;

export function ChatInput({ onSend, onRefresh, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (input.trim() && input.length <= MAX_CHARS && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !disabled) {
      handleSend();
    }
  };

  const handleFocus = () => {
    // On mobile, ensure input scrolls into view above keyboard
    // Multiple strategies for cross-browser compatibility
    
    // Strategy 1: Immediate scroll with delay for keyboard animation
    setTimeout(() => {
      if (inputRef.current) {
        // Scroll the input to the top of the viewport with extra space
        inputRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 100);

    // Strategy 2: Second attempt after keyboard animation
    setTimeout(() => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        inputRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 400);

    // Strategy 3: Final attempt after keyboard is fully shown
    setTimeout(() => {
      if (inputRef.current && document.activeElement === inputRef.current) {
        inputRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }
    }, 700);
  };

  // Handle viewport changes when keyboard appears (Visual Viewport API)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'visualViewport' in window) {
      const handleViewportResize = () => {
        // If input is focused and viewport resized (keyboard appeared/disappeared)
        if (document.activeElement === inputRef.current) {
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start',
                inline: 'nearest'
              });
            }
          }, 150);
        }
      };

      window.visualViewport?.addEventListener('resize', handleViewportResize);
      return () => window.visualViewport?.removeEventListener('resize', handleViewportResize);
    }
  }, []);
  
  // Additional safeguard: handle window resize events (for older browsers)
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;
    
    const handleWindowResize = () => {
      // Debounce resize events
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (document.activeElement === inputRef.current && inputRef.current) {
          inputRef.current.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start',
            inline: 'nearest'
          });
        }
      }, 200);
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div data-testid="container-chat-input">
      <div className="bg-card border border-card-border rounded-lg p-2.5">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={onRefresh}
            disabled={disabled}
            data-testid="button-refresh"
            className="flex-shrink-0 hover-elevate"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            disabled={disabled}
            data-testid="button-plus"
            className="flex-shrink-0 hover-elevate"
            onClick={() => console.log("Plus button clicked")}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) {
                  setInput(e.target.value);
                }
              }}
              onKeyPress={handleKeyPress}
              onFocus={handleFocus}
              placeholder="Ask anything about Nick..."
              disabled={disabled}
              data-testid="input-question"
              className="pr-16 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" data-testid="text-char-counter">
              {input.length} / {MAX_CHARS}
            </div>
          </div>

          <Button
            size="icon"
            variant="ghost"
            disabled={disabled}
            data-testid="button-mic"
            className="flex-shrink-0 hover-elevate"
            onClick={() => console.log("Mic button clicked")}
          >
            <Mic className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            onClick={handleSend}
            disabled={disabled || !input.trim() || input.length > MAX_CHARS}
            data-testid="button-send"
            className="flex-shrink-0 bg-send-button hover:bg-send-button/90 text-send-button-foreground rounded-full"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
