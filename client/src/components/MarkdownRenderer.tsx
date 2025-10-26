import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="text-foreground leading-relaxed" data-testid="markdown-content">
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => (
            <p className="mb-4 leading-relaxed" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong className="font-semibold" {...props} />
          ),
          em: ({ node, ...props }) => (
            <em className="italic" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a className="text-primary underline hover:no-underline" {...props} target="_blank" rel="noopener noreferrer" />
          ),
          code: ({ node, ...props }) => (
            <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="my-3 list-disc pl-6" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="my-3 list-decimal pl-6" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="my-1" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-semibold mb-3 mt-8 first:mt-0" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold mb-3 mt-8 first:mt-0" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-lg font-semibold mb-3 mt-6" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
