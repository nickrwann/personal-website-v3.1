interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string | React.ReactNode;
  streamedDescription?: string | null;
  isStreaming?: boolean;
}

interface ExperienceSectionProps {
  experiences: Experience[];
  showTitle?: boolean;
}

export function ExperienceSection({ experiences, showTitle = true }: ExperienceSectionProps) {
  if (experiences.length === 0) return null;
  
  return (
    <section data-testid="section-experience">
      {showTitle && <h2 className="text-2xl font-semibold text-foreground mb-6">Experience</h2>}
      <div className="space-y-6">
        {experiences.map((exp, index) => {
          // Use streamed text if streamedDescription is not null (even if empty string during streaming)
          // Use original description only when streamedDescription is explicitly null
          const displayDescription = exp.streamedDescription !== null
            ? exp.streamedDescription
            : exp.description;
          
          return (
            <div 
              key={exp.id} 
              className="border-l-2 border-border pl-4 animate-in fade-in slide-in-from-left-2 duration-300" 
              style={{ animationDelay: `${index * 50}ms` }}
              data-testid={`experience-${index}`}
            >
              <h3 className="text-base font-semibold text-foreground">{exp.role}</h3>
              <div className="text-sm text-muted-foreground mb-2">
                {exp.company} · {exp.period}
              </div>
              <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
                {displayDescription}
                {exp.isStreaming && (
                  <span className="inline-block w-1 h-4 bg-primary animate-pulse ml-0.5 align-middle" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
