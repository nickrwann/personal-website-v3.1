interface AboutSectionProps {
  content: string;
}

export function AboutSection({ content }: AboutSectionProps) {
  if (!content) return null;
  
  return (
    <section data-testid="section-about">
      <h2 className="text-2xl font-semibold text-foreground mb-4">About Me</h2>
      <div className="text-sm leading-relaxed text-foreground whitespace-pre-line">
        {content}
      </div>
    </section>
  );
}
