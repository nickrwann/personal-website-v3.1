import { AssistantBubble } from "../AssistantBubble";

export default function AssistantBubbleExample() {
  const sampleContent = `## About Nick

I'm an AI engineer with 5+ years of experience and more than 20 patents. I focus on building reliable, scalable systems that move from prototype to product.

**Key Skills:**
- RAG pipelines
- Multi-agent systems
- MLOps optimization`;

  return (
    <div className="min-h-screen bg-background p-8">
      <AssistantBubble content={sampleContent} />
    </div>
  );
}
