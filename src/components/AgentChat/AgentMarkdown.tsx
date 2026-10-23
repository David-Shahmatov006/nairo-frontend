import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { resolveAgentLink } from "./resolveAgentLink";

export const AgentMarkdown = ({ content, onNavigate }: {
  content: string;
  onNavigate: () => void;
}) => (
  <div className="[&>:last-child]:mb-0 [&_.katex-display]:max-w-full [&_.katex-display]:overflow-x-auto [&_.katex-display]:overflow-y-hidden [&_.katex-display]:py-1">
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[[rehypeKatex, { trust: false, strict: "ignore", throwOnError: false }]]}
      skipHtml
      components={{
        a: ({ href, children }) => {
          if (!href) return <span>{children}</span>;
          const resolvedHref = resolveAgentLink(href);
          const url = new URL(resolvedHref, window.location.origin);
          if (url.origin === window.location.origin && url.pathname.startsWith("/post/")) {
            return <Link to={`${url.pathname}${url.search}${url.hash}`} onClick={onNavigate}>
              {children === href ? resolvedHref : children}
            </Link>;
          }
          return <a href={resolvedHref} target="_blank" rel="noopener noreferrer">
            {children === href ? resolvedHref : children}
          </a>;
        },
        img: ({ alt }) => <span>{alt}</span>,
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
