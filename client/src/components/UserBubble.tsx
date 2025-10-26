interface UserBubbleProps {
  content: string;
}

export function UserBubble({ content }: UserBubbleProps) {
  return (
    <div className="flex justify-end mb-4" data-testid="bubble-user">
      <div className="bg-primary text-primary-foreground px-5 py-3 rounded-lg shadow-sm max-w-[85%] md:max-w-[600px]">
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </div>
  );
}
