import { useEffect, useRef } from "react";

interface ExpandingTextareaProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  maxHeight?: number;
}

export function ExpandingTextarea({
  value,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
  placeholder = "Message...",
  disabled = false,
  maxLength,
  maxHeight = 200,
}: ExpandingTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";
    
    // Set height to scrollHeight, capped at maxHeight
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
    
    // Add scrollbar if content exceeds maxHeight
    textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
  }, [value, maxHeight]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      data-testid="textarea-message"
      rows={1}
      className="w-full resize-none bg-transparent border-none outline-none focus:outline-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground leading-6"
      style={{ 
        minHeight: '24px',
        maxHeight: `${maxHeight}px`,
      }}
    />
  );
}
