interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string | React.ReactNode;
}

interface ExperienceSectionProps {
  experiences: Experience[];
  content: string;
}

export function ExperienceSection({ experiences, content }: ExperienceSectionProps) {
  return (
    <section data-testid="section-experience">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Experience</h2>
      <div className="text-sm leading-relaxed text-foreground whitespace-pre-line">
        {content}
      </div>
      <div className="space-y-6 mt-6">
        {experiences.map((exp, index) => (
          <div key={exp.id} className="border-l-2 border-border pl-4" data-testid={`experience-${index}`}>
            <h3 className="text-base font-semibold text-foreground">{exp.role}</h3>
            <div className="text-sm text-muted-foreground mb-2">
              {exp.company} · {exp.period}
            </div>
            <div className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {exp.description}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
