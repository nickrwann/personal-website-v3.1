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
    const charsPerInterval = 3;
    const intervalMs = 50;

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

    setTimeout(() => {
      const mockAnswer = `Based on Nick's background, ${message.toLowerCase().includes("hire") ? "you should hire Nick because of his 5+ years of experience building production AI systems, his track record of 20+ patents, and his expertise in RAG pipelines and multi-agent systems. He excels at moving from prototype to product without losing clarity." : message.toLowerCase().includes("best") ? "Nick is best at building reliable, scalable AI systems. His expertise includes retrieval-augmented generation pipelines, multi-agent platforms, and MLOps optimization. He has a proven track record of shipping production AI features." : message.toLowerCase().includes("free time") ? "In his free time, Nick enjoys exploring the city, traveling to new places, lifting weights, and hunting down the best latte in town. He values staying active and experiencing new things." : "Nick is an experienced AI engineer with expertise in RAG systems, multi-agent platforms, and production AI development. He has contributed to 20+ patents and focuses on building systems that solve real problems."}`;

      setShowTyping(true);
      setTimeout(() => {
        setShowTyping(false);
        streamText(mockAnswer, () => {
          setAssistantAnswer(mockAnswer);
          setState("idle");
        });
      }, 800);
    }, 300);
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
