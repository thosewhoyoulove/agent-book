import { useState, type ReactNode } from "react";

interface CodeBlockProps {
  label: string;
  language?: string;
  children: ReactNode;
}

export function CodeBlock({ label, language = "typescript", children }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const code = typeof children === "string" ? children : "";

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span className="code-block__file"><span className="code-block__file-dot" />{label}</span>
        <span className="code-block__language">{language}</span>
        <button className="code-block__copy" onClick={() => void copyCode()} aria-label={`复制 ${label}`}>
          {copied ? "已复制" : "复制"}
        </button>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}
