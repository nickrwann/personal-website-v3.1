import { useState } from "react";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestionPills } from "./SuggestionPills";
import { ChatInput } from "./ChatInput";
import { MarkdownRenderer } from "./MarkdownRenderer";

export function QASection() {
  const [userQuestion, setUserQuestion] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const [showTyping, setShowTyping] = useState(false);

  const handleSend = async (message: string) => {
    setUserQuestion(message);
    setAssistantAnswer("");
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

      // Small delay for natural feel, then show the complete formatted response
      setTimeout(() => {
        setShowTyping(false);
        setAssistantAnswer(answer);
        setIsAsking(false);
      }, 300);
    } catch (error) {
      console.error("Error asking question:", error);
      setTimeout(() => {
        setShowTyping(false);
        setAssistantAnswer("Sorry, I encountered an error. Please try again.");
        setIsAsking(false);
      }, 300);
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
            
            {assistantAnswer && (
              <div className="w-full overflow-x-auto animate-in fade-in slide-in-from-bottom-2 duration-300" data-testid="bubble-assistant">
                <MarkdownRenderer content={assistantAnswer} />
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

      <div className="mb-4">
        <ChatInput
          onSend={handleSend}
          onRefresh={() => {
            setUserQuestion("");
            setAssistantAnswer("");
          }}
          disabled={isAsking}
        />
      </div>
    </div>
  );
}
