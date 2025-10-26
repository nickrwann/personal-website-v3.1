import { useState } from "react";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestionPills } from "./SuggestionPills";
import { ChatInput } from "./ChatInput";
import { MarkdownRenderer } from "./MarkdownRenderer";

export function QASection() {
  const [userQuestion, setUserQuestion] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const [streamedContent, setStreamedContent] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  const streamText = (text: string, onComplete?: () => void) => {
    setStreamedContent("");
    let index = 0;
    const charsPerInterval = 8;
    const intervalMs = 30;

    const interval = setInterval(() => {
      if (index < text.length) {
        setStreamedContent((prev) => prev + text.slice(index, index + charsPerInterval));
        index += charsPerInterval;
      } else {
        clearInterval(interval);
        setStreamedContent(text);
        if (onComplete) onComplete();
      }
    }, intervalMs);

    return () => clearInterval(interval);
  };

  const handleSend = async (message: string) => {
    setUserQuestion(message);
    setAssistantAnswer("");
    setStreamedContent("");
    setIsAsking(true);
    setShowTyping(true);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: message }),
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

      setShowTyping(false);
      streamText(answer, () => {
        setAssistantAnswer(answer);
        setIsAsking(false);
      });
    } catch (error) {
      console.error("Error asking question:", error);
      setShowTyping(false);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      streamText(errorMessage, () => {
        setAssistantAnswer(errorMessage);
        setIsAsking(false);
      });
    }
  };

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };

  return (
    <div>
      <section className="mb-6" data-testid="section-qa">
        {userQuestion && (
          <div className="space-y-6">
            <div className="flex justify-end" data-testid="bubble-user">
              <div className="bg-secondary text-secondary-foreground px-4 py-2.5 rounded-lg max-w-[85%] md:max-w-[600px]">
                <p className="text-sm leading-relaxed">{userQuestion}</p>
              </div>
            </div>

            {showTyping && <TypingIndicator />}
            
            {streamedContent && (
              <div className="w-full overflow-x-auto" data-testid="bubble-assistant">
                <MarkdownRenderer content={streamedContent} />
              </div>
            )}
          </div>
        )}
      </section>

      {!userQuestion && (
        <div className="mb-4">
          <SuggestionPills onSuggestionClick={handleSuggestionClick} disabled={isAsking} />
        </div>
      )}

      <div className="mb-12">
        <ChatInput
          onSend={handleSend}
          onRefresh={() => {
            setUserQuestion("");
            setAssistantAnswer("");
            setStreamedContent("");
          }}
          disabled={isAsking}
        />
      </div>
    </div>
  );
}
