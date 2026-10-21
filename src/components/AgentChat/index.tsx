import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
  LuTrash2,
  LuSparkles,
  LuPenLine,
  LuCompass,
} from "react-icons/lu";
import {
  agentService,
  AGENT_MESSAGE_MAX_LENGTH,
} from "../../services/agent.service";
import { SEASONAL_THEME } from "../../constants/seasonalTheme";
import clsx from "clsx";

const seasonalAgent =
  SEASONAL_THEME === "halloween" || SEASONAL_THEME === "christmas"
    ? SEASONAL_THEME
    : null;
const launcherAnimation = seasonalAgent
  ? `agent-launcher-${seasonalAgent}.png`
  : "agent-launcher.png";
const launcherStill = seasonalAgent
  ? `agent-launcher-${seasonalAgent}-still.png`
  : "agent-launcher-still.png";
const thinkingAnimation = seasonalAgent
  ? `agent-thinking-${seasonalAgent}.png`
  : "agent-thinking.png";
const thinkingStill = seasonalAgent
  ? `agent-thinking-${seasonalAgent}-still.png`
  : "agent-thinking-still.png";
const agentMascot = `${import.meta.env.BASE_URL || "/"}images/${seasonalAgent ? launcherStill : "agent-robot-variant-a.png"}`;
const canAutoFocus = () =>
  window.matchMedia("(min-width: 769px) and (pointer: fine)").matches;

export type AgentMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
type Props = {
  userId: string;
  onSend?: (messages: AgentMessage[]) => Promise<string>;
};

const sendToAgent = (messages: AgentMessage[]) =>
  agentService.chat(
    messages[messages.length - 1].content,
    messages.slice(0, -1),
  );

export const AgentChat = ({ userId, onSend = sendToAgent }: Props) => {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [saved] = useState(() => loadConversation(userId));
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(saved.draft);
  const [messages, setMessages] = useState<AgentMessage[]>(saved.messages);
  const [pending, setPending] = useState(false);
  const [clearing, setClearing] = useState(false);
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
    saveConversation(
      userId,
      pending
        ? {
            messages: messages.slice(0, -1),
            draft: messages.at(-1)?.content || draft,
          }
        : { messages, draft },
    );
  }, [userId, messages, draft, pending]);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    if (canAutoFocus()) input.current?.focus({ preventScroll: true });
    else panel.current?.focus({ preventScroll: true });
    const previousOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const viewport = window.visualViewport;
    const updateViewport = () => {
      panel.current?.style.setProperty(
        "--agent-viewport-height",
        `${viewport?.height ?? window.innerHeight}px`,
      );
      panel.current?.style.setProperty(
        "--agent-viewport-top",
        `${viewport?.offsetTop ?? 0}px`,
      );
    };
    updateViewport();
    viewport?.addEventListener("resize", updateViewport);
    viewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      viewport?.removeEventListener("resize", updateViewport);
      viewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
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

  const clearHistory = async () => {
    if (sending.current) return;
    sending.current = true;
    setClearing(true);
    try {
      await agentService.clearHistory();
      if (!mounted.current) return;
      setMessages([]);
      setDraft("");
      setError("");
      setCopied(null);
      saveConversation(userId, { messages: [], draft: "" });
    } catch {
      if (mounted.current) setError(t("agent.clear_error"));
    } finally {
      sending.current = false;
      if (mounted.current) setClearing(false);
    }
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
        if (canAutoFocus()) input.current?.focus({ preventScroll: true });
      }
    }
  };

  return createPortal(
    <div className="font-manrope text-sm text-[var(--agent-ink)] [--agent-surface:#fff] [--agent-muted:#807b8b] [--agent-border:#e9e6ef] [--agent-ink:#292333] [--agent-soft:#f5f3f8] [--agent-accent:#7955bd] [--agent-canvas:#faf9fc] dark:[--agent-surface:#201e26] dark:[--agent-muted:#a6a0b3] dark:[--agent-border:#35303f] dark:[--agent-ink:#f2eef8] dark:[--agent-soft:#2b2734] dark:[--agent-accent:#c6a7ff] dark:[--agent-canvas:#19171e] [&_button]:cursor-pointer [&_button]:[-webkit-tap-highlight-color:transparent] [&_button:disabled]:cursor-default [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-[var(--agent-accent)] [&_button:focus-visible]:outline-offset-3 motion-reduce:[&_*]:transition-none">
      <button
        ref={launcher}
        className="fixed right-6 bottom-[calc(24px+env(safe-area-inset-bottom))] z-60 flex h-[68px] items-center gap-3 rounded-3xl border border-[#e0d2f4] bg-[linear-gradient(120deg,#fff,#f0e8fc)] py-1.5 pr-3 pl-1.5 text-[#39264f] shadow-[0_8px_30px_#43256722,inset_0_1px_0_#fff]  duration-300 hover:-translate-y-[3px] hover:shadow-[0_12px_36px_#43256735] active:translate-y-0 active:scale-[.97] [&[hidden]]:hidden dark:border-[#5a4178] dark:bg-[linear-gradient(120deg,#33273f,#241c30)] dark:text-[#f1e7ff] dark:shadow-[0_8px_30px_#0004] max-768px:right-4 max-768px:bottom-[calc(16px+env(safe-area-inset-bottom))] max-768px:h-[60px] max-768px:gap-[9px] max-768px:rounded-[21px] max-768px:py-[5px] max-768px:pr-2.5 max-768px:pl-[5px]"
        onClick={() => setOpen(true)}
        aria-label={t("agent.open")}
        title={t("agent.open")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="agent-panel"
        hidden={open}
      >
        <span className="size-[57px] shrink-0 [&_img]:size-full [&_img]:object-contain max-768px:size-12">
          <img
            src={`${import.meta.env.BASE_URL || "/"}images/${reducedMotion ? launcherStill : launcherAnimation}`}
            width={120}
            height={144}
            alt=""
          />
        </span>
        <span
          className="flex flex-col items-start gap-0.5 [&_strong]:text-base [&_strong]:font-[750] [&_strong]:tracking-[-.4px] [&>span]:flex [&>span]:items-center [&>span]:gap-1 [&>span]:text-[10px] [&>span]:font-semibold [&>span]:text-[#7955bd] dark:[&>span]:text-[#d2b5ff] [&_svg]:size-[11px]"
          aria-hidden="true"
        >
          <strong>Nairo</strong>
          <span>
            <LuSparkles />
            {t("agent.label")}
          </span>
        </span>
        <span
          className="ml-1 grid size-[26px] place-items-center rounded-full bg-[#e5d7f65e] text-[#7955bd] dark:text-[#d2b5ff] max-768px:hidden"
          aria-hidden="true"
        >
          <LuChevronRight />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            key="agent-overlay"
            className="fixed inset-0 z-[999]"
            initial={{ opacity: reducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <div
              className="fixed inset-0 z-[999] bg-[#1b102a45] backdrop-blur-[5px]"
              onClick={close}
              aria-hidden="true"
            />
            <motion.section
              initial={{
                y: reducedMotion ? 0 : 24,
                scale: reducedMotion ? 1 : 0.97,
              }}
              animate={{ y: 0, scale: 1 }}
              exit={{
                y: reducedMotion ? 0 : 24,
                scale: reducedMotion ? 1 : 0.97,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              ref={panel}
              id="agent-panel"
              className="fixed right-6 bottom-6 z-[1000] flex h-[min(760px,calc(100dvh-48px))] w-[min(460px,calc(100vw-48px))] flex-col overflow-hidden rounded-[28px] border border-[var(--agent-border)] bg-[var(--agent-canvas)] shadow-[0_28px_100px_#1e103650] outline-none max-768px:top-[var(--agent-viewport-top,0px)] max-768px:right-0 max-768px:bottom-auto max-768px:left-0 max-768px:h-[var(--agent-viewport-height,100dvh)] max-768px:max-h-none max-768px:w-full max-768px:rounded-none max-768px:border-0 max-768px:shadow-none"
              role="dialog"
              aria-modal="true"
              aria-labelledby="agent-title"
              tabIndex={-1}
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
                  } else if (
                    !event.shiftKey &&
                    document.activeElement === last
                  ) {
                    event.preventDefault();
                    first.focus();
                  }
                }
              }}
            >
              <header className="flex shrink-0 items-center gap-3 border-b border-[var(--agent-border)] bg-[var(--agent-surface)] px-[22px] py-[18px] max-768px:px-4 max-768px:pt-[calc(12px+env(safe-area-inset-top))] max-768px:pb-3">
                <div
                  className="size-[42px] shrink-0 overflow-hidden rounded-[14px] bg-[var(--agent-soft)] p-[3px] [&_img]:size-full [&_img]:object-contain"
                  aria-hidden="true"
                >
                  <img src={agentMascot} alt="" />
                </div>
                <div className="min-w-0 flex-1 [&_h2]:m-0 [&_h2]:text-lg [&_h2]:font-[750] [&_h2]:tracking-[-.5px] [&_h2_span]:mt-0.5 [&_h2_span]:block [&_h2_span]:text-[11px] [&_h2_span]:font-medium [&_h2_span]:tracking-[.4px] [&_h2_span]:text-[var(--agent-muted)]">
                  <h2 id="agent-title">
                    Nairo <span>{t("agent.label")}</span>
                  </h2>
                </div>
                <button
                  className="grid size-11 shrink-0 place-items-center rounded-[14px] border border-[var(--agent-border)] text-xl text-[var(--agent-muted)] hover:bg-[var(--agent-soft)] hover:text-[var(--agent-ink)]"
                  onClick={() => void clearHistory()}
                  disabled={pending || clearing || (!messages.length && !draft)}
                  aria-label={t("agent.clear_history")}
                  title={t("agent.clear_history")}
                >
                  <LuTrash2 aria-hidden="true" />
                </button>
                <button
                  className="grid size-11 shrink-0 place-items-center rounded-[14px] border border-[var(--agent-border)] text-xl text-[var(--agent-muted)] hover:bg-[var(--agent-soft)] hover:text-[var(--agent-ink)]"
                  onClick={close}
                  aria-label={t("agent.minimize")}
                  title={t("agent.minimize")}
                >
                  <LuMinus aria-hidden="true" />
                </button>
              </header>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 [scrollbar-width:thin] [scrollbar-color:var(--agent-border)_transparent] scroll-p-5 max-768px:px-4 max-768px:py-5">
                {messages.length === 0 && (
                  <div className="pt-1 pb-3">
                    <div className="relative flex flex-col items-center px-3 pb-6 text-center max-768px:pb-[22px]">
                      <div
                        className="mb-[18px] grid h-[114px] w-[104px] place-items-center rounded-[32px] bg-transparent [@media(max-height:650px)]:mb-3 [@media(max-height:650px)]:h-20 [@media(max-height:650px)]:w-[76px]"
                        aria-hidden="true"
                      >
                        <img
                          className="h-[110px] w-[84px] object-contain [@media(max-height:650px)]:h-20 [@media(max-height:650px)]:w-16"
                          src={agentMascot}
                          alt=""
                        />
                      </div>
                      <div className="[&_h3]:mx-auto [&_h3]:mt-3 [&_h3]:mb-2.5 [&_h3]:max-w-[320px] [&_h3]:text-[clamp(26px,4vw,32px)] [&_h3]:font-[650] [&_h3]:leading-[1.17] [&_h3]:tracking-[-1.1px] [&_h3]:text-balance [@media(max-height:650px)]:[&_h3]:text-[25px] [&_p]:mx-auto [&_p]:my-0 [&_p]:max-w-[300px] [&_p]:text-[13px] [&_p]:leading-[1.65] [&_p]:text-[var(--agent-muted)]">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[1.3px] text-[var(--agent-accent)] uppercase before:size-[5px] before:rounded-full before:bg-[var(--agent-accent)] before:content-['']">
                          {t("agent.sidekick")}
                        </span>
                        <h3>{t("agent.welcome")}</h3>
                        <p>{t("agent.description")}</p>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      {(["idea", "write", "help"] as const).map((key) => (
                        <button
                          className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-[var(--agent-border)] bg-[var(--agent-surface)] px-3.5 py-3 text-left transition-[border-color,transform] duration-150 hover:translate-x-0.5 hover:border-[var(--agent-accent)] [&>svg]:w-[15px] [&>svg]:shrink-0 [&>svg]:text-[var(--agent-muted)]"
                          key={key}
                          onClick={() => {
                            setDraft(t(`agent.prompt_${key}`));
                            setError("");
                            if (canAutoFocus())
                              input.current?.focus({ preventScroll: true });
                          }}
                        >
                          <span
                            className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-[var(--agent-soft)] text-base text-[var(--agent-accent)]"
                            aria-hidden="true"
                          >
                            {key === "idea" ? (
                              <LuSparkles />
                            ) : key === "write" ? (
                              <LuPenLine />
                            ) : (
                              <LuCompass />
                            )}
                          </span>
                          <span className="flex-1 text-xs font-[550] leading-normal">
                            {t(`agent.suggestion_${key}`)}
                          </span>
                          <LuChevronRight aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div
                  className="flex flex-col gap-6"
                  role="log"
                  aria-label={t("agent.history")}
                  aria-live="polite"
                  aria-relevant="additions text"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`min-w-0 ${message.role === "user" ? "max-w-[88%] self-end" : "max-w-full"}`}
                    >
                      <span
                        className={`mx-0.5 mt-0 mb-[7px] flex min-h-6 items-center gap-[7px] text-[11px] font-semibold text-[var(--agent-muted)] [&_img]:h-[26px] [&_img]:w-[22px] [&_img]:object-contain ${message.role === "user" ? "justify-end" : ""}`}
                      >
                        {message.role === "assistant" && (
                          <img src={agentMascot} alt="" />
                        )}
                        {message.role === "user" ? t("agent.you") : "Nairo"}
                      </span>
                      <div
                        className={`text-sm leading-[1.75] [overflow-wrap:anywhere] ${message.role === "user" ? "whitespace-pre-wrap rounded-[18px_18px_4px] bg-[#7955bd] px-4 py-3 text-white" : "whitespace-normal rounded-[4px_18px_18px] border border-[var(--agent-border)] bg-[var(--agent-surface)] px-[18px] py-4 [&_p]:mt-0 [&_p]:mb-2.5 [&_p]:whitespace-pre-wrap [&>:last-child]:mb-0 [&_a]:text-[var(--agent-accent)] [&_a]:underline [&_a]:underline-offset-[3px] [&_a:hover]:opacity-80 [&_ul]:mt-2 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-[22px] [&_ol]:mt-2 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-[22px] [&_li]:my-1 [&_strong]:font-bold [&_em]:italic [&_:is(h1,h2,h3,h4,h5,h6)]:mt-3.5 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-2 [&_:is(h1,h2,h3,h4,h5,h6)]:font-bold [&_:is(h1,h2,h3,h4,h5,h6)]:leading-[1.4] [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_blockquote]:my-2.5 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[var(--agent-accent)] [&_blockquote]:pl-3 [&_blockquote]:text-[var(--agent-muted)] [&_code]:rounded [&_code]:bg-[var(--agent-soft)] [&_code]:px-[5px] [&_code]:py-0.5 [&_code]:font-mono [&_pre]:my-2.5 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-[10px] [&_pre]:bg-[var(--agent-soft)] [&_pre]:p-3 [&_pre]:whitespace-pre [&_pre_code]:p-0 [&_table]:my-2.5 [&_table]:block [&_table]:max-w-full [&_table]:border-collapse [&_table]:overflow-x-auto [&_:is(th,td)]:border [&_:is(th,td)]:border-[var(--agent-border)] [&_:is(th,td)]:px-2.5 [&_:is(th,td)]:py-1.5 [&_th]:font-bold [&_hr]:my-3 [&_hr]:border-[var(--agent-border)]"}`}
                      >
                        {message.role === "assistant" ? (
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            skipHtml
                            components={{
                              a: ({ href, children }) => {
                                if (!href) return <span>{children}</span>;
                                const resolvedHref = resolveAgentLink(href);
                                const url = new URL(
                                  resolvedHref,
                                  window.location.origin,
                                );
                                if (
                                  url.origin === window.location.origin &&
                                  url.pathname.startsWith("/post/")
                                ) {
                                  return (
                                    <Link
                                      to={`${url.pathname}${url.search}${url.hash}`}
                                      onClick={close}
                                    >
                                      {children === href
                                        ? resolvedHref
                                        : children}
                                    </Link>
                                  );
                                }
                                return (
                                  <a
                                    href={resolvedHref}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {children === href
                                      ? resolvedHref
                                      : children}
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
                          className="flex min-h-9 items-center gap-1.5 px-[3px] py-1.5 text-[11px] text-[var(--agent-muted)] hover:text-[var(--agent-accent)]"
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
                            copied === message.id
                              ? "agent.copied"
                              : "agent.copy",
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                  {pending && (
                    <div
                      className={clsx(
                        "flex min-h-17 items-center gap-3.5 py-1 text-xs text-[var(--agent-muted)] [&_img]:block [&_img]:h-[150px] [&_img]:shrink-0 [&_img]:object-contain",
                        SEASONAL_THEME === "halloween"
                          ? "[&_img]:w-23"
                          : SEASONAL_THEME === "christmas"
                            ? "[&_img]:w-23"
                            : "[&_img]:w-18",
                      )}
                      role="status"
                    >
                      <img
                        src={`${import.meta.env.BASE_URL || "/"}images/${reducedMotion ? thinkingStill : thinkingAnimation}`}
                        width={80}
                        height={120}
                        alt=""
                      />
                    </div>
                  )}
                </div>
                <div ref={end} />
              </div>
              <footer className="shrink-0 border-t border-[var(--agent-border)] bg-[var(--agent-surface)] px-5 pt-4 pb-3.5 max-768px:px-3 max-768px:pt-3 max-768px:pb-[max(12px,env(safe-area-inset-bottom))]">
                {error && (
                  <p
                    className="mt-0 mb-3 text-xs leading-[1.6] text-[var(--agent-accent)]"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                <form
                  className="flex items-end gap-2.5 rounded-[18px] border border-[var(--agent-border)] bg-[var(--agent-canvas)] p-2 pl-4 transition-[border-color] duration-150 focus-within:border-[var(--agent-accent)] focus-within:shadow-[0_0_0_3px_#a47bce12] [&_textarea]:min-h-11 [&_textarea]:max-h-[120px] [&_textarea]:min-w-0 [&_textarea]:flex-1 [&_textarea]:resize-none [&_textarea]:border-0 [&_textarea]:bg-transparent [&_textarea]:py-[11px] [&_textarea]:text-sm [&_textarea]:leading-[22px] [&_textarea]:text-[var(--agent-ink)] [&_textarea]:outline-none [&_textarea::placeholder]:text-[var(--agent-muted)] max-768px:[&_textarea]:text-base"
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
                    disabled={pending || clearing}
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
                    className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-[#7955bd] text-[21px] text-white transition-opacity duration-150 disabled:opacity-30"
                    type="submit"
                    disabled={!draft.trim() || pending || clearing}
                    aria-label={t("agent.send")}
                  >
                    <LuArrowUp aria-hidden="true" />
                  </button>
                </form>
                <p className="mt-[9px] mb-0 text-center text-[10px] leading-normal text-[var(--agent-muted)]">
                  {t("agent.hint")}
                </p>
              </footer>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
};
