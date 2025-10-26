import { useState, useEffect } from "react";
import { ProfileImage } from "./ProfileImage";
import { GreetingBubble } from "./GreetingBubble";
import { TypingIndicator } from "./TypingIndicator";
import { AssistantBubble } from "./AssistantBubble";
import { UserBubble } from "./UserBubble";
import { SuggestionPills } from "./SuggestionPills";
import { ChatInput } from "./ChatInput";
import { INTRO_CONTENT } from "@/content/intro";

type ChatState = "intro" | "idle" | "asking";

export function ChatScreen() {
  const [state, setState] = useState<ChatState>("intro");
  const [showTyping, setShowTyping] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [userQuestion, setUserQuestion] = useState("");
  const [assistantAnswer, setAssistantAnswer] = useState("");

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

  useEffect(() => {
    if (state === "intro") {
      setShowTyping(true);
      const timeout = setTimeout(() => {
        setShowTyping(false);
        streamText(INTRO_CONTENT, () => {
          setState("idle");
        });
      }, 600);

      return () => clearTimeout(timeout);
    }
  }, [state]);

  const handleSend = async (message: string) => {
    setUserQuestion(message);
    setAssistantAnswer("");
    setStreamedContent("");
    setState("asking");
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
        setState("idle");
      });
    } catch (error) {
      console.error("Error asking question:", error);
      setShowTyping(false);
      const errorMessage = "Sorry, I encountered an error. Please try again.";
      streamText(errorMessage, () => {
        setAssistantAnswer(errorMessage);
        setState("idle");
      });
    }
  };

  const handleRefresh = () => {
    setUserQuestion("");
    setAssistantAnswer("");
    setStreamedContent("");
    setState("intro");
  };

  const handleSuggestionClick = (text: string) => {
    handleSend(text);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 overflow-y-auto pt-20 pb-48 px-4">
        <div className="max-w-3xl mx-auto">
          {state === "intro" && (
            <>
              <ProfileImage />
              <GreetingBubble />
              {showTyping && <TypingIndicator />}
              {streamedContent && <AssistantBubble content={streamedContent} />}
            </>
          )}

          {state !== "intro" && userQuestion && (
            <>
              <UserBubble content={userQuestion} />
              {showTyping && <TypingIndicator />}
              {streamedContent && <AssistantBubble content={streamedContent} />}
            </>
          )}
        </div>
      </div>

      <div className="fixed bottom-20 left-0 right-0 z-30 px-4">
        <div className="max-w-3xl mx-auto">
          {state === "idle" && <SuggestionPills onSuggestionClick={handleSuggestionClick} disabled={false} />}
        </div>
      </div>

      <ChatInput
        onSend={handleSend}
        onRefresh={handleRefresh}
        disabled={state === "asking"}
      />
    </div>
  );
}
