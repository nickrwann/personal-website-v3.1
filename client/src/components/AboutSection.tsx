interface AboutSectionProps {
  content: string;
  isStreaming?: boolean;
}

export function AboutSection({ content, isStreaming = false }: AboutSectionProps) {
  if (!content) return null;
  
  return (
    <section data-testid="section-about">
      <h2 className="text-2xl font-semibold text-foreground mb-4">About Me</h2>
      <div className="text-sm leading-relaxed text-foreground whitespace-pre-line">
        {content}
        {isStreaming && (
          <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </section>
  );
}
