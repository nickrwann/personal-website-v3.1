export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 mb-4" data-testid="container-typing">
      <div className="bg-card px-4 py-3 rounded-lg shadow-sm flex gap-1.5">
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
