import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none
        prose-headings:font-semibold prose-headings:mb-3 prose-headings:mt-6
        prose-h2:text-xl prose-h2:mt-8 first:prose-h2:mt-0
        prose-h3:text-base prose-h3:mt-4
        prose-p:mb-4 prose-p:leading-relaxed
        prose-strong:font-semibold prose-strong:text-foreground
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-ul:my-3 prose-li:my-1
        text-foreground">
      <ReactMarkdown>
        {content}
      </ReactMarkdown>
    </div>
  );
}
