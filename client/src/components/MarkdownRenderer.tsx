import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none
        prose-headings:font-semibold prose-headings:mb-3 prose-headings:mt-6
        prose-h1:text-2xl prose-h1:mt-8 first:prose-h1:mt-0
        prose-h2:text-xl prose-h2:mt-8 first:prose-h2:mt-0
        prose-h3:text-lg prose-h3:mt-6
        prose-h4:text-base prose-h4:mt-4
        prose-p:mb-4 prose-p:leading-relaxed prose-p:text-foreground
        prose-strong:font-semibold prose-strong:text-foreground
        prose-em:italic prose-em:text-foreground
        prose-a:text-primary prose-a:underline hover:prose-a:no-underline
        prose-code:text-foreground prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
        prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:text-sm
        prose-ul:my-3 prose-ul:list-disc prose-ul:pl-6
        prose-ol:my-3 prose-ol:list-decimal prose-ol:pl-6
        prose-li:my-1 prose-li:text-foreground
        prose-blockquote:border-l-4 prose-blockquote:border-border prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-muted-foreground
        prose-hr:border-border prose-hr:my-6
        text-foreground"
      data-testid="markdown-content">
      <ReactMarkdown
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
