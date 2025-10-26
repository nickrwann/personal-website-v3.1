import { MarkdownRenderer } from "./MarkdownRenderer";

interface AssistantBubbleProps {
  content: string;
}

export function AssistantBubble({ content }: AssistantBubbleProps) {
  return (
    <div className="mb-6" data-testid="bubble-assistant">
      <div className="bg-card border border-card-border px-5 py-4 rounded-lg shadow-sm max-w-full md:max-w-[700px]">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}
