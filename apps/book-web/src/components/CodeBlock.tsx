import { useMemo, useState, type ReactNode } from "react";

interface CodeBlockProps {
  label: string;
  language?: string;
  caption?: string;
  highlightLines?: number[];
  children: ReactNode;
}

type TokenKind = "plain" | "comment" | "string" | "keyword" | "type" | "fn" | "number";

interface CodeToken {
  kind: TokenKind;
  value: string;
}

const TOKEN_PATTERN =
  /(\/\/.*$)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|\b(async|await|const|let|var|function|return|if|else|for|of|in|while|export|import|from|type|interface|throw|new|try|catch|true|false|null|undefined)\b|\b([A-Z][A-Za-z0-9_]*)\b|\b([a-z_$][A-Za-z0-9_$]*)(?=\s*\()|\b(\d+(?:\.\d+)?)\b/gm;

function tokenizeLine(line: string): CodeToken[] {
  if (!line) return [{ kind: "plain", value: "" }];
  const tokens: CodeToken[] = [];
  let lastIndex = 0;

  for (const match of line.matchAll(TOKEN_PATTERN)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      tokens.push({ kind: "plain", value: line.slice(lastIndex, matchIndex) });
    }

    if (match[1] !== undefined) {
      tokens.push({ kind: "comment", value: match[1] });
    } else if (match[2] !== undefined) {
      tokens.push({ kind: "string", value: match[2] });
    } else if (match[3] !== undefined) {
      tokens.push({ kind: "keyword", value: match[3] });
    } else if (match[4] !== undefined) {
      tokens.push({ kind: "type", value: match[4] });
    } else if (match[5] !== undefined) {
      tokens.push({ kind: "fn", value: match[5] });
    } else if (match[6] !== undefined) {
      tokens.push({ kind: "number", value: match[6] });
    }

    lastIndex = matchIndex + match[0].length;
  }

  if (lastIndex < line.length) {
    tokens.push({ kind: "plain", value: line.slice(lastIndex) });
  }

  return tokens;
}

export function CodeBlock({
  label,
  language = "typescript",
  caption,
  highlightLines = [],
  children
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const code = typeof children === "string" ? children.replace(/\n$/, "") : "";
  const highlightedSet = useMemo(() => new Set(highlightLines), [highlightLines]);
  const tokenizedLines = useMemo(() => code.split("\n").map(tokenizeLine), [code]);

  const copyCode = async () => {
    if (!code) return;
    await navigator.clipboard?.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <figure className="code-block">
      <div className="code-block__bar">
        <span className="code-block__file">
          <span className="code-block__file-dot" aria-hidden="true" />
          <span>{label}</span>
        </span>
        <span className="code-block__language">{language}</span>
        <button
          className={`code-block__copy ${copied ? "is-copied" : ""}`}
          type="button"
          onClick={() => void copyCode()}
          aria-label={`复制 ${label}`}
        >
          {copied ? "已复制" : "复制代码"}
        </button>
      </div>
      <pre>
        <code>
          {tokenizedLines.map((tokens, index) => {
            const lineNumber = index + 1;
            const isHighlighted = highlightedSet.has(lineNumber);
            return (
              <span
                className={`code-line ${isHighlighted ? "code-line--highlight" : ""}`}
                key={lineNumber}
              >
                <span className="code-line__number" aria-hidden="true">
                  {String(lineNumber).padStart(2, "0")}
                </span>
                <span className="code-line__content">
                  {tokens.map((token, tokenIndex) =>
                    token.kind === "plain" ? (
                      token.value
                    ) : (
                      <span className={`tok-${token.kind}`} key={tokenIndex}>
                        {token.value}
                      </span>
                    )
                  )}
                </span>
              </span>
            );
          })}
        </code>
      </pre>
      {caption && <figcaption className="code-block__caption">{caption}</figcaption>}
    </figure>
  );
}
