interface UserBubbleProps {
  content: string;
}

export function UserBubble({ content }: UserBubbleProps) {
  return (
    <div className="mb-6" data-testid="bubble-user">
      <div className="max-w-full md:max-w-[700px]">
        <p className="text-sm text-muted-foreground font-medium mb-2">You</p>
        <p className="text-sm leading-relaxed text-foreground">{content}</p>
      </div>
    </div>
  );
}
