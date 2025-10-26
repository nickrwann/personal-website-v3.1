import { useState, useRef } from "react";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInput } from "./ChatInput";
import { ContextualSuggestions } from "./ContextualSuggestions";
import { MarkdownRenderer } from "./MarkdownRenderer";

export function QASection() {
  const [userQuestion, setUserQuestion] = useState("");
  const [rawAnswer, setRawAnswer] = useState("");
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRefreshTrigger = useRef(0);

  // User is typing if there's text in the input
  const isTyping = inputValue.length > 0;

  const streamText = (text: string) => {
    setStreamedText("");
    setIsStreaming(true);
    let index = 0;
    const charsPerInterval = 1; // 1 character at a time
    const intervalMs = 25; // Human-readable speed: 25ms per character (40 chars/sec)

    const interval = setInterval(() => {
      if (index < text.length) {
        const charsToAdd = Math.min(charsPerInterval, text.length - index);
        setStreamedText(text.slice(0, index + charsToAdd));
        index += charsToAdd;
      } else {
        clearInterval(interval);
        setStreamedText(text);
        setIsStreaming(false);
        setIsAsking(false);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  };

  const handleSend = async (message: string) => {
    setUserQuestion(message);
    setRawAnswer("");
    setStreamedText("");
    setIsAsking(true);
    setShowTyping(true);
    setInputValue(""); // Clear input after sending

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

      setRawAnswer(answer);
      setShowTyping(false);
      streamText(answer);
    } catch (error) {
      console.error("Error asking question:", error);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      setRawAnswer(errorMessage);
      setShowTyping(false);
      streamText(errorMessage);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    handleSend(text);
  };

  return (
    <>
      <section className="mb-6" data-testid="section-qa">
        {userQuestion && (
          <div className="space-y-6">
            <div className="flex justify-end" data-testid="bubble-user">
              <div className="bg-secondary text-secondary-foreground px-4 py-2.5 rounded-lg max-w-[85%] md:max-w-[600px]">
                <p className="text-sm leading-relaxed">{userQuestion}</p>
              </div>
            </div>

            {showTyping && <TypingIndicator />}
            
            {streamedText && (
              <div className="w-full overflow-x-auto" data-testid="bubble-assistant">
                {isStreaming ? (
                  <div className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {streamedText}
                    <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
                  </div>
                ) : (
                  <MarkdownRenderer content={streamedText} />
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Sentinel element for IntersectionObserver - marks end of content stream */}
      <div id="qa-sentinel" className="h-4" data-testid="sentinel-qa" />

      {/* Contextual suggestions - visibility controlled by internal logic */}
      <ContextualSuggestions
        onSuggestionClick={handleSuggestionClick}
        disabled={isAsking}
        isInputFocused={isInputFocused}
        isTyping={isTyping}
        sentinelId="qa-sentinel"
      />

      {/* Chat input bar */}
      <ChatInput
        onSend={handleSend}
        disabled={isAsking}
        onFocusChange={setIsInputFocused}
        inputValue={inputValue}
        onInputChange={setInputValue}
      />
    </>
  );
}
