import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { resolveAgentLink } from "./resolveAgentLink";
import { loadConversation, saveConversation } from "./storage";
import { useTranslation } from "react-i18next";
import {
  LuArrowUp,
  LuCheck,
  LuChevronRight,
  LuCopy,
  LuMinus,
} from "react-icons/lu";
import "./styles.css";
import {
  agentService,
  AGENT_MESSAGE_MAX_LENGTH,
} from "../../services/agent.service";

const agentMascot = `${import.meta.env.BASE_URL || "/"}images/agent-navigator.png`;

export type AgentMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
type Props = { userId: string; onSend?: (messages: AgentMessage[]) => Promise<string> };

const sendToAgent = (messages: AgentMessage[]) =>
  agentService.chat(messages[messages.length - 1].content);

export const AgentChat = ({ userId, onSend = sendToAgent }: Props) => {
  const { t } = useTranslation();
  const [saved] = useState(() => loadConversation(userId));
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(saved.draft);
  const [messages, setMessages] = useState<AgentMessage[]>(saved.messages);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const sending = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    // A reload during a request restores its text as a draft for retrying.
    saveConversation(userId, pending
      ? { messages: messages.slice(0, -1), draft: messages.at(-1)?.content || draft }
      : { messages, draft });
  }, [userId, messages, draft, pending]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    input.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (open && (messages.length > 0 || pending || error))
      end.current?.scrollIntoView?.({ block: "end" });
  }, [messages, pending, error, open]);

  useEffect(() => {
    if (!input.current) return;
    input.current.style.height = "auto";
    input.current.style.height = `${Math.min(input.current.scrollHeight, 140)}px`;
  }, [draft, open]);

  const close = () => {
    setOpen(false);
    launcher.current?.focus();
  };

  const send = async () => {
    const content = draft.trim();
    if (!content || sending.current) return;
    const next: AgentMessage[] = [
      ...messages,
      { id: crypto.randomUUID(), role: "user", content },
    ];
    sending.current = true;
    setPending(true);
    setError("");
    setMessages(next);
    setDraft("");
    try {
      const reply = await onSend(next);
      if (!reply.trim()) throw new Error("Empty agent reply");
      if (mounted.current)
        setMessages([
          ...next,
          { id: crypto.randomUUID(), role: "assistant", content: reply },
        ]);
    } catch {
      if (mounted.current) {
        setMessages(messages);
        setDraft(content);
        setError(t("agent.error"));
      }
    } finally {
      sending.current = false;
      if (mounted.current) {
        setPending(false);
        input.current?.focus();
      }
    }
  };

  return createPortal(
    <div className="agent-chat font-manrope">
      <button
        ref={launcher}
        className="agent-launcher"
        onClick={() => setOpen(true)}
        aria-label={t("agent.open")}
        title={t("agent.open")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="agent-panel"
        hidden={open}
      >
        <span className="agent-launcher-mascot">
          <img src={agentMascot} alt="" />
        </span>
      </button>
      {open && (
        <>
          <div className="agent-backdrop" onClick={close} aria-hidden="true" />
          <section
            ref={panel}
            id="agent-panel"
            className="agent-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="agent-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                close();
              }
              if (event.key === "Tab") {
                const nodes = panel.current?.querySelectorAll<HTMLElement>(
                  "button:not([disabled]), textarea:not([disabled]), a[href]",
                );
                if (!nodes?.length) return;
                const first = nodes[0],
                  last = nodes[nodes.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <header className="agent-header">
              <div className="agent-heading">
                <h2 id="agent-title">
                  Nairo <span>{t("agent.label")}</span>
                </h2>
              </div>
              <button
                className="agent-icon-button"
                onClick={close}
                aria-label={t("agent.minimize")}
                title={t("agent.minimize")}
              >
                <LuMinus aria-hidden="true" />
              </button>
            </header>
            <div className="agent-body">
              {messages.length === 0 && (
                <div className="agent-welcome">
                  <div className="agent-intro">
                    <div className="agent-character-stage" aria-hidden="true">
                      <img
                        className="agent-hero-mascot"
                        src={agentMascot}
                        alt=""
                      />
                    </div>
                    <div className="agent-intro-copy">
                      <span className="agent-intro-kicker">
                        {t("agent.sidekick")}
                      </span>
                      <h3>{t("agent.welcome")}</h3>
                      <p>{t("agent.description")}</p>
                    </div>
                  </div>
                  <div className="agent-prompts">
                    {(["idea", "write", "help"] as const).map((key) => (
                      <button
                        className={`agent-prompt agent-prompt--${key}`}
                        key={key}
                        onClick={() => {
                          setDraft(t(`agent.prompt_${key}`));
                          setError("");
                          input.current?.focus();
                        }}
                      >
                        <span className="agent-prompt-text">
                          {t(`agent.suggestion_${key}`)}
                        </span>
                        <LuChevronRight aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div
                className="agent-messages"
                role="log"
                aria-label={t("agent.history")}
                aria-live="polite"
                aria-relevant="additions text"
              >
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`agent-message agent-message--${message.role}`}
                  >
                    <span className="agent-message-author">
                      {message.role === "assistant" && (
                        <img src={agentMascot} alt="" />
                      )}
                      {message.role === "user" ? t("agent.you") : "Nairo"}
                    </span>
                    <div className="agent-bubble">
                      {message.role === "assistant" ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          skipHtml
                          components={{
                            a: ({ href, children }) => {
                              if (!href) return <span>{children}</span>;
                              const resolvedHref = resolveAgentLink(href);
                              return (
                                <a
                                  href={resolvedHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {children === href ? resolvedHref : children}
                                </a>
                              );
                            },
                            img: ({ alt }) => <span>{alt}</span>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                    {message.role === "assistant" && (
                      <button
                        className="agent-copy"
                        aria-label={t("agent.copy")}
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              message.content,
                            );
                            setCopied(message.id);
                          } catch {
                            setCopied(null);
                          }
                        }}
                      >
                        {copied === message.id ? <LuCheck /> : <LuCopy />}
                        {t(
                          copied === message.id ? "agent.copied" : "agent.copy",
                        )}
                      </button>
                    )}
                  </div>
                ))}
                {pending && (
                  <div className="agent-thinking" role="status">
                    <span />
                    <span />
                    <span />
                    <span className="sr-only">{t("agent.thinking")}</span>
                  </div>
                )}
              </div>
              <div ref={end} />
            </div>
            <footer className="agent-footer">
              {error && (
                <p className="agent-error" role="alert">
                  {error}
                </p>
              )}
              <form
                className="agent-composer"
                onSubmit={(event) => {
                  event.preventDefault();
                  void send();
                }}
              >
                <label htmlFor="agent-message" className="sr-only">
                  {t("agent.message")}
                </label>
                <textarea
                  ref={input}
                  id="agent-message"
                  rows={1}
                  value={draft}
                  maxLength={AGENT_MESSAGE_MAX_LENGTH}
                  disabled={pending}
                  placeholder={t("agent.placeholder")}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    setError("");
                  }}
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" &&
                      !event.shiftKey &&
                      !event.nativeEvent.isComposing &&
                      window.matchMedia("(min-width: 641px)").matches
                    ) {
                      event.preventDefault();
                      void send();
                    }
                  }}
                />
                <button
                  className="agent-send"
                  type="submit"
                  disabled={!draft.trim() || pending}
                  aria-label={t("agent.send")}
                >
                  <LuArrowUp aria-hidden="true" />
                </button>
              </form>
              <p className="agent-composer-hint">{t("agent.hint")}</p>
            </footer>
          </section>
        </>
      )}
    </div>,
    document.body,
  );
};
