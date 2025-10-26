export function ExperienceSection() {
  const experiences = [
    {
      title: "Software Engineer II",
      company: "Dell Technologies",
      period: "2023 - Present",
      team: "OCTO Engineering",
      description: "Building RAG pipelines, multi-agent platforms, and MLOps systems. Focus on production AI deployment and optimization."
    },
    {
      title: "Software Engineer I",
      company: "Dell Technologies",
      period: "2021 - 2023",
      team: "Client CTO Engineering",
      description: "Developed AI-powered features and connected device concepts. Early work on NYX controller and touchpad innovations."
    },
    {
      title: "Electrical Engineering Graduate",
      company: "Texas A&M University",
      period: "Graduated",
      team: "Electrical Engineering",
      description: "Built foundation in systems design and engineering principles."
    }
  ];

  return (
    <section className="mb-12" data-testid="section-experience">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div key={index} className="border-l-2 border-border pl-4" data-testid={`experience-${index}`}>
            <h3 className="text-lg font-semibold text-foreground">{exp.title}</h3>
            <div className="text-sm text-muted-foreground mb-2">
              {exp.company} · {exp.team}
            </div>
            <div className="text-xs text-muted-foreground mb-2">{exp.period}</div>
            <p className="text-sm text-foreground">{exp.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
