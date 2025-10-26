export function AboutSection() {
  return (
    <section className="mb-12" data-testid="section-about">
      <h2 className="text-2xl font-semibold text-foreground mb-4">About Me</h2>
      <div className="text-sm leading-relaxed text-foreground space-y-3">
        <p>
          I'm an AI engineer with 5+ years of experience building production systems and 20+ patents. 
          Currently at Dell Technologies in the OCTO Engineering team, I focus on RAG pipelines, 
          multi-agent systems, and MLOps optimization.
        </p>
        <p>
          I love solving complex problems by breaking them down into simple, elegant solutions. 
          Whether it's optimizing ML inference with ONNX Runtime or designing agent-based platforms, 
          I thrive on turning prototypes into reliable, scalable products.
        </p>
        <p>
          Outside of work, you'll find me exploring Austin, traveling to new places, lifting at the gym, 
          or hunting down the perfect latte.
        </p>
      </div>
    </section>
  );
}
