import type { ReactNode } from "react";

interface CodeBlockProps {
  label: string;
  language?: string;
  children: ReactNode;
}

export function CodeBlock({ label, language = "typescript", children }: CodeBlockProps) {
  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span className="code-block__dots" aria-hidden="true"><i /><i /><i /></span>
        <span>{label}</span>
        <span className="code-block__language">{language}</span>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}
