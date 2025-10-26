import { useState, useRef } from "react";
import { TypingIndicator } from "./TypingIndicator";
import { ChatInputGroup } from "./ChatInputGroup";
import { MarkdownRenderer } from "./MarkdownRenderer";

export function QASection() {
  const [userQuestion, setUserQuestion] = useState("");
  const [rawAnswer, setRawAnswer] = useState("");
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const inputRefreshTrigger = useRef(0);

  const streamText = (text: string) => {
    setStreamedText("");
    setIsStreaming(true);
    let index = 0;
    const charsPerInterval = 1; // 1 character at a time
    const intervalMs = 10; // Human-readable speed: 10ms per character (100 chars/sec)

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
    setHasSentMessage(true); // Mark that a message has been sent

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
    // Only populate the textarea, don't send immediately
    // User can review and edit before sending
    setInputValue(text);
  };

  const handleReset = () => {
    setUserQuestion("");
    setRawAnswer("");
    setStreamedText("");
    setIsStreaming(false);
    setIsAsking(false);
    setShowTyping(false);
    setInputValue("");
    setHasSentMessage(false); // Reset to show suggestions again
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

      {/* Unified chat input group with suggestions */}
      <ChatInputGroup
        onSend={handleSend}
        onRefresh={handleReset}
        onSuggestionClick={handleSuggestionClick}
        disabled={isAsking}
        inputValue={inputValue}
        onInputChange={setInputValue}
        hasSentMessage={hasSentMessage}
      />
    </>
  );
}
