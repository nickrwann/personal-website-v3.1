import { useState, useRef, useEffect } from "react";
import { ChatFooter } from "@/components/ChatFooter";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
  isStreaming?: boolean;
};

const SUGGESTIONS = [
  "Why should I hire Nick?",
  "What is Nick best at?",
  "What is Nick's coolest project?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Hi! I'm Nick's AI assistant. Ask me anything about his experience, skills, or projects.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const scrollRegionRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const keyboardOpenRef = useRef(false);

  // Track if keyboard is open
  useEffect(() => {
    function updateKeyboardState() {
      if (!window.visualViewport) return;
      const vv = window.visualViewport;
      const keyboardHeight = window.innerHeight - vv.height;
      keyboardOpenRef.current = keyboardHeight > 50;
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateKeyboardState);
      window.visualViewport.addEventListener("scroll", updateKeyboardState);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateKeyboardState);
        window.visualViewport.removeEventListener("scroll", updateKeyboardState);
      }
    };
  }, []);

  // Blur textarea when user scrolls while keyboard is open
  useEffect(() => {
    const scrollEl = scrollRegionRef.current;
    if (!scrollEl) return;

    function handleScroll() {
      if (keyboardOpenRef.current) {
        // User scrolled while typing - dismiss keyboard
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }

      // Check scroll position for scroll-to-bottom button
      if (scrollEl) {
        const distanceFromBottom =
          scrollEl.scrollHeight - (scrollEl.scrollTop + scrollEl.clientHeight);
        setShowScrollButton(distanceFromBottom > 4);
      }
    }

    scrollEl.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    return () => {
      scrollEl.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Stream text character by character
  const streamText = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      const messageId = crypto.randomUUID();
      
      // Add empty streaming message
      setMessages(prev => [...prev, { 
        id: messageId, 
        role: "assistant", 
        text: "", 
        isStreaming: true 
      }]);

      let index = 0;
      const intervalMs = 10; // 10ms per character (100 chars/sec)

      const interval = setInterval(() => {
        if (index < text.length) {
          const charsToAdd = Math.min(1, text.length - index);
          setMessages(prev => prev.map(msg =>
            msg.id === messageId
              ? { ...msg, text: text.slice(0, index + charsToAdd) }
              : msg
          ));
          index += charsToAdd;
        } else {
          clearInterval(interval);
          setMessages(prev => prev.map(msg =>
            msg.id === messageId
              ? { ...msg, isStreaming: false }
              : msg
          ));
          resolve();
        }
      }, intervalMs);
    });
  };

  const handleSend = async () => {
    const text = draft.trim();
    if (!text || isProcessing) return;

    // Add user message
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
    };
    setMessages(prev => [...prev, userMsg]);
    setDraft("");
    setHasSentMessage(true);
    setIsProcessing(true);

    // Reset textarea height
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = "auto";
    }

    // Blur to dismiss keyboard
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: text }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to get response";
        try {
          const error = await response.json();
          errorMessage = error.message || errorMessage;
        } catch {
          errorMessage = `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const answer = data.answer || "No response received.";

      await streamText(answer);
    } catch (error) {
      console.error("Error asking question:", error);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      await streamText(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        text: "Hi! I'm Nick's AI assistant. Ask me anything about his experience, skills, or projects.",
      },
    ]);
    setDraft("");
    setHasSentMessage(false);
    setIsProcessing(false);

    // Reset textarea height
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = "auto";
    }

    // Blur to dismiss keyboard
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setDraft(text);
  };

  const scrollToBottom = () => {
    const el = scrollRegionRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Messages scroll area */}
      <div
        ref={scrollRegionRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        data-testid="container-messages"
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`
              max-w-[85%] md:max-w-[600px] rounded-lg px-4 py-2.5 text-sm leading-relaxed
              ${
                msg.role === "user"
                  ? "ml-auto bg-secondary text-secondary-foreground"
                  : "mr-auto bg-card border border-card-border text-foreground"
              }
            `}
            data-testid={msg.role === "user" ? "bubble-user" : "bubble-assistant"}
          >
            {msg.isStreaming ? (
              <div className="whitespace-pre-wrap">
                {msg.text}
                <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
              </div>
            ) : (
              <MarkdownRenderer content={msg.text} />
            )}
          </div>
        ))}

        {/* Bottom sentinel */}
        <div id="chat-bottom-sentinel" className="h-1" />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          variant="outline"
          className="absolute bottom-28 left-1/2 z-40 -translate-x-1/2 rounded-full shadow-lg h-10 w-10"
          data-testid="button-scroll-to-bottom"
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      )}

      {/* Footer: suggestions + input bar */}
      <ChatFooter
        draft={draft}
        onDraftChange={setDraft}
        onSend={handleSend}
        onRefresh={handleReset}
        onSuggestionClick={handleSuggestionClick}
        hasSentMessage={hasSentMessage}
        disabled={isProcessing}
        suggestions={SUGGESTIONS}
      />
    </div>
  );
}
