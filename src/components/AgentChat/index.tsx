import { AgentMarkdown } from "./AgentMarkdown";
import { useAgentViewport } from "./useAgentViewport";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useMatch } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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
import halloweenWelcome from "../../assets/images/agent/halloween-pumpkin-welcome-v4.png";
import halloweenWelcomeStill from "../../assets/images/agent/halloween-pumpkin-welcome-v4-still.png";
import christmasWelcome from "../../assets/images/agent/christmas-gift-welcome-v2.png";
import christmasWelcomeStill from "../../assets/images/agent/christmas-gift-welcome-v2-still.png";

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
  const inConversation = !!useMatch("/chats/:chatId");
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
  const messageList = useRef<HTMLDivElement>(null);
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
  }, [open]);

  useAgentViewport(open, panel);

  useEffect(() => {
    const list = messageList.current;
    if (open && list && (messages.length > 0 || pending || error))
      list.scrollTop = list.scrollHeight;
  }, [messages, pending, error, open]);

  useEffect(() => {
    const resizeInput = () => {
      const field = input.current;
      if (!field) return;
      field.style.height = "auto";
      const maxHeight = Number.parseFloat(getComputedStyle(field).maxHeight);
      field.style.height = `${Math.min(field.scrollHeight, Number.isFinite(maxHeight) ? maxHeight : field.scrollHeight)}px`;
    };
    resizeInput();
    window.addEventListener("resize", resizeInput);
    return () => window.removeEventListener("resize", resizeInput);
  }, [draft, open]);

  const close = () => {
    setOpen(false);
    launcher.current?.focus({ preventScroll: true });
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
    <div className="font-manrope text-sm text-[var(--agent-ink)] [--agent-surface:#fff] [--agent-muted:#807b8b] [--agent-border:#e9e6ef] [--agent-ink:#292333] [--agent-soft:#f5f3f8] [--agent-accent:#7955bd] [--agent-canvas:#faf9fc] dark:[--agent-surface:#201e26] dark:[--agent-muted:#a6a0b3] dark:[--agent-border:#35303f] dark:[--agent-ink:#f2eef8] dark:[--agent-soft:#2b2734] dark:[--agent-accent:#c6a7ff] dark:[--agent-canvas:#19171e] [&_button]:cursor-pointer [&_button]:[-webkit-tap-highlight-color:transparent] [&_button:disabled]:cursor-default [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-[var(--agent-accent)] [&_button:focus-visible]:outline-offset-3 motion-reduce:[&_*]:transition-none min-2000px:text-[0.7vw] min-2000px:[&_button:focus-visible]:outline-offset-[0.6vw]">
      <button
        ref={launcher}
        className={clsx(
          "fixed right-6 z-60 flex h-[68px] items-center gap-3 rounded-3xl border border-[#e0d2f4] bg-[linear-gradient(120deg,#fff,#f0e8fc)] py-1.5 pr-3 pl-1.5 text-[#39264f] shadow-[0_8px_30px_#43256722,inset_0_1px_0_#fff]  duration-300 hover:-translate-y-[3px] hover:shadow-[0_12px_36px_#43256735] active:translate-y-0 active:scale-[.97] [&[hidden]]:hidden dark:border-[#5a4178] dark:bg-[linear-gradient(120deg,#33273f,#241c30)] dark:text-[#f1e7ff] dark:shadow-[0_8px_30px_#0004] max-768px:right-4 max-768px:h-[60px] max-768px:gap-[9px] max-768px:rounded-[21px] max-768px:py-[5px] max-768px:pr-2.5 max-768px:pl-[5px] min-2000px:right-[1.2vw] min-2000px:h-[3.4vw] min-2000px:gap-[0.6vw] min-2000px:rounded-[1.2vw] min-2000px:py-[0.3vw] min-2000px:pr-[0.6vw] min-2000px:pl-[0.3vw] min-2000px:shadow-[0_0.4vw_1.5vw_#43256722,inset_0_0.05vw_0_#fff] min-2000px:hover:-translate-y-[0.15vw] min-2000px:hover:shadow-[0_0.6vw_1.8vw_#43256735] min-2000px:active:translate-y-[0vw] min-2000px:dark:shadow-[0_0.4vw_1.5vw_#0004]",
          inConversation
            ? "bottom-[calc(70px+env(safe-area-inset-bottom))] min-2000px:bottom-[calc(4vw+env(safe-area-inset-bottom))]"
            : "bottom-[calc(24px+env(safe-area-inset-bottom))] max-768px:bottom-[calc(16px+env(safe-area-inset-bottom))] min-2000px:bottom-[calc(1.2vw+env(safe-area-inset-bottom))]",
        )}
        onClick={() => setOpen(true)}
        aria-label={t("agent.open")}
        title={t("agent.open")}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="agent-panel"
        hidden={open}
      >
        <span className="size-[57px] shrink-0 [&_img]:size-full [&_img]:object-contain max-768px:size-12 min-2000px:size-[2.85vw]">
          <img
            src={`${import.meta.env.BASE_URL || "/"}images/${reducedMotion ? launcherStill : launcherAnimation}`}
            width={120}
            height={144}
            alt=""
          />
        </span>
        <span
          className="flex flex-col items-start gap-0.5 [&_strong]:text-base [&_strong]:font-[750] [&_strong]:tracking-[-.4px] [&>span]:flex [&>span]:items-center [&>span]:gap-1 [&>span]:text-[10px] [&>span]:font-semibold [&>span]:text-[#7955bd] dark:[&>span]:text-[#d2b5ff] [&_svg]:size-[11px] min-2000px:gap-[0.1vw] min-2000px:[&_strong]:text-[0.8vw] min-2000px:[&_strong]:tracking-[-0.02vw] min-2000px:[&>span]:gap-[0.2vw] min-2000px:[&>span]:text-[0.5vw] min-2000px:[&_svg]:size-[0.55vw]"
          aria-hidden="true"
        >
          <strong>Nairon</strong>
          <span>
            <LuSparkles />
            {t("agent.label")}
          </span>
        </span>
        <span
          className="ml-1 grid size-[26px] place-items-center rounded-full bg-[#e5d7f65e] text-[#7955bd] dark:text-[#d2b5ff] max-768px:hidden min-2000px:ml-[0.2vw] min-2000px:size-[1.3vw]"
          aria-hidden="true"
        >
          <LuChevronRight />
        </span>
      </button>
      <AnimatePresence>
        {open && (
          <div
            key="agent-overlay"
            className="fixed inset-0 z-[999] min-2000px:inset-[0vw]"
          >
            <motion.div
              className="fixed inset-0 z-[999] bg-[#1b102a45] [--agent-blur-unit:1px] [backdrop-filter:blur(calc(var(--agent-blur)*var(--agent-blur-unit)))] [-webkit-backdrop-filter:blur(calc(var(--agent-blur)*var(--agent-blur-unit)))] min-2000px:inset-[0vw] min-2000px:[--agent-blur-unit:0.05vw]"
              initial={{ opacity: reducedMotion ? 1 : 0, "--agent-blur": reducedMotion ? 5 : 0 }}
              animate={{ opacity: 1, "--agent-blur": 5 }}
              exit={{ opacity: 0, "--agent-blur": 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.22, ease: [0.22, 1, 0.36, 1] }}
              onClick={close}
              aria-hidden="true"
            />
            <motion.section
              initial={{
                opacity: reducedMotion ? 1 : 0,
                y: reducedMotion ? 0 : 24,
                scale: reducedMotion ? 1 : 0.97,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: reducedMotion ? 0 : 24,
                scale: reducedMotion ? 1 : 0.97,
              }}
              transition={{
                duration: reducedMotion ? 0 : 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
              ref={panel}
              id="agent-panel"
              className="fixed right-6 bottom-6 z-[1000] flex h-[min(760px,calc(100dvh-48px))] w-[min(460px,calc(100vw-48px))] flex-col overflow-hidden overscroll-none rounded-[28px] border border-[var(--agent-border)] bg-[var(--agent-canvas)] shadow-[0_28px_100px_#1e103650] outline-none max-768px:top-[var(--agent-viewport-top,0px)] max-768px:right-0 max-768px:bottom-auto max-768px:left-0 max-768px:h-[var(--agent-viewport-height,100dvh)] max-768px:max-h-none max-768px:w-full max-768px:rounded-none max-768px:border-0 max-768px:shadow-none min-2000px:right-[1.2vw] min-2000px:bottom-[1.2vw] min-2000px:h-[min(38vw,calc(100dvh-2.4vw))] min-2000px:w-[min(23vw,calc(100vw-2.4vw))] min-2000px:rounded-[1.4vw] min-2000px:shadow-[0_1.4vw_5vw_#1e103650]"
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
              <header className="flex shrink-0 items-center gap-3 border-b border-[var(--agent-border)] bg-[var(--agent-surface)] px-[22px] py-[18px] max-768px:px-4 max-768px:pt-[calc(12px+env(safe-area-inset-top))] max-768px:pb-3 min-2000px:gap-[0.6vw] min-2000px:px-[1.1vw] min-2000px:py-[0.9vw]">
                <div
                  className="size-[42px] shrink-0 overflow-hidden rounded-[14px] bg-[var(--agent-soft)] p-[3px] [&_img]:size-full [&_img]:object-contain min-2000px:size-[2.1vw] min-2000px:rounded-[0.7vw] min-2000px:p-[0.15vw]"
                  aria-hidden="true"
                >
                  <img src={agentMascot} alt="" />
                </div>
                <div className="min-w-0 flex-1 [&_h2]:m-0 [&_h2]:text-lg [&_h2]:font-[750] [&_h2]:tracking-[-.5px] [&_h2_span]:mt-0.5 [&_h2_span]:block [&_h2_span]:text-[11px] [&_h2_span]:font-medium [&_h2_span]:tracking-[.4px] [&_h2_span]:text-[var(--agent-muted)] min-2000px:min-w-[0vw] min-2000px:[&_h2]:m-[0vw] min-2000px:[&_h2]:text-[0.9vw] min-2000px:[&_h2]:tracking-[-0.025vw] min-2000px:[&_h2_span]:mt-[0.1vw] min-2000px:[&_h2_span]:text-[0.55vw] min-2000px:[&_h2_span]:tracking-[0.02vw]">
                  <h2 id="agent-title">
                    Nairon <span>{t("agent.label")}</span>
                  </h2>
                </div>
                <button
                  className="grid size-11 shrink-0 place-items-center rounded-[14px] border border-[var(--agent-border)] text-xl text-[var(--agent-muted)] hover:bg-[var(--agent-soft)] hover:text-[var(--agent-ink)] min-2000px:size-[2.2vw] min-2000px:rounded-[0.7vw] min-2000px:text-[1vw]"
                  onClick={() => void clearHistory()}
                  disabled={pending || clearing || (!messages.length && !draft)}
                  aria-label={t("agent.clear_history")}
                  title={t("agent.clear_history")}
                >
                  <LuTrash2 aria-hidden="true" />
                </button>
                <button
                  className="grid size-11 shrink-0 place-items-center rounded-[14px] border border-[var(--agent-border)] text-xl text-[var(--agent-muted)] hover:bg-[var(--agent-soft)] hover:text-[var(--agent-ink)] min-2000px:size-[2.2vw] min-2000px:rounded-[0.7vw] min-2000px:text-[1vw]"
                  onClick={close}
                  aria-label={t("agent.minimize")}
                  title={t("agent.minimize")}
                >
                  <LuMinus aria-hidden="true" />
                </button>
              </header>
              <div ref={messageList} className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-6 [scrollbar-width:thin] [scrollbar-color:var(--agent-border)_transparent] scroll-p-5 max-768px:px-4 max-768px:py-5 min-2000px:min-h-[0vw] min-2000px:p-[1.2vw] min-2000px:scroll-p-[1vw]">
                {messages.length === 0 && (
                  <div className="pt-1 pb-3 min-2000px:pt-[0.2vw] min-2000px:pb-[0.6vw]">
                    <div className="relative flex flex-col items-center px-3 pb-6 text-center max-768px:pb-[22px] min-2000px:px-[0.6vw] min-2000px:pb-[1.2vw]">
                      <div
                        className="mb-[25px] grid h-[114px] w-[137px] place-items-center rounded-[32px] bg-transparent [@media(max-height:650px)]:mb-3 [@media(max-height:650px)]:h-20 [@media(max-height:650px)]:w-[76px] min-2000px:mb-[1.25vw] min-2000px:h-[5.7vw] min-2000px:w-[6.85vw] min-2000px:rounded-[1.6vw] min-2000px:[@media(max-height:650px)]:mb-[0.6vw] min-2000px:[@media(max-height:650px)]:h-[4vw] min-2000px:[@media(max-height:650px)]:w-[3.8vw]"
                        aria-hidden="true"
                      >
                        <img
                          className="h-[150px] w-[137px] object-contain [@media(max-height:650px)]:h-20 [@media(max-height:650px)]:w-16 min-2000px:h-[7.5vw] min-2000px:w-[6.85vw] min-2000px:[@media(max-height:650px)]:h-[4vw] min-2000px:[@media(max-height:650px)]:w-[3.2vw]"
                          src={SEASONAL_THEME === "halloween"
                            ? (reducedMotion ? halloweenWelcomeStill : halloweenWelcome)
                            : SEASONAL_THEME === "christmas"
                              ? (reducedMotion ? christmasWelcomeStill : christmasWelcome)
                              : agentMascot}
                          alt=""
                        />
                      </div>
                      <div className="[&_h3]:mx-auto [&_h3]:mt-3 [&_h3]:mb-2.5 [&_h3]:max-w-[320px] [&_h3]:text-[clamp(26px,4vw,32px)] [&_h3]:font-[650] [&_h3]:leading-[1.17] [&_h3]:tracking-[-1.1px] [&_h3]:text-balance [@media(max-height:650px)]:[&_h3]:text-[25px] [&_p]:mx-auto [&_p]:my-0 [&_p]:max-w-[300px] [&_p]:text-[13px] [&_p]:leading-[1.65] [&_p]:text-[var(--agent-muted)] min-2000px:[&_h3]:mt-[0.6vw] min-2000px:[&_h3]:mb-[0.5vw] min-2000px:[&_h3]:max-w-[16vw] min-2000px:[&_h3]:text-[clamp(1.3vw,4vw,1.6vw)] min-2000px:[&_h3]:tracking-[-0.055vw] min-2000px:[@media(max-height:650px)]:[&_h3]:text-[1.25vw] min-2000px:[&_p]:my-[0vw] min-2000px:[&_p]:max-w-[15vw] min-2000px:[&_p]:text-[0.65vw]">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[1.3px] text-[var(--agent-accent)] uppercase before:size-[5px] before:rounded-full before:bg-[var(--agent-accent)] before:content-[''] min-2000px:gap-[0.3vw] min-2000px:text-[0.5vw] min-2000px:tracking-[0.065vw] min-2000px:before:size-[0.25vw]">
                          {t("agent.sidekick")}
                        </span>
                        <h3>{t("agent.welcome")}</h3>
                        <p>{t("agent.description")}</p>
                      </div>
                    </div>
                    <div className="grid gap-2 min-2000px:gap-[0.4vw]">
                      {(["idea", "write", "help"] as const).map((key) => (
                        <button
                          className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-[var(--agent-border)] bg-[var(--agent-surface)] px-3.5 py-3 text-left duration-300 hover:translate-x-0.5 hover:ring-2 ring-main/80 [&>svg]:w-[15px] [&>svg]:shrink-0 [&>svg]:text-[var(--agent-muted)] min-2000px:min-h-[2.9vw] min-2000px:gap-[0.6vw] min-2000px:rounded-[0.8vw] min-2000px:px-[0.7vw] min-2000px:py-[0.6vw] min-2000px:hover:translate-x-[0.1vw] min-2000px:[&>svg]:w-[0.75vw]"
                          key={key}
                          onClick={() => {
                            setDraft(t(`agent.prompt_${key}`));
                            setError("");
                            if (canAutoFocus())
                              input.current?.focus({ preventScroll: true });
                          }}
                        >
                          <span
                            className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-[var(--agent-soft)] text-base text-[var(--agent-accent)] min-2000px:size-[1.6vw] min-2000px:rounded-[0.5vw] min-2000px:text-[0.8vw]"
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
                          <span className="flex-1 text-xs font-[550] leading-normal min-2000px:text-[0.6vw] min-2000px:leading-[1.5]">
                            {t(`agent.suggestion_${key}`)}
                          </span>
                          <LuChevronRight aria-hidden="true" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div
                  className="flex flex-col gap-6 min-2000px:gap-[1.2vw]"
                  role="log"
                  aria-label={t("agent.history")}
                  aria-live="polite"
                  aria-relevant="additions text"
                >
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`min-w-0  min-2000px:min-w-[0vw] ${message.role === "user" ? "max-w-[88%] self-end" : "max-w-full"}`}
                    >
                      <span
                        className={`mx-0.5 mt-0 mb-[7px] flex min-h-6 items-center gap-[7px] text-[11px] font-semibold text-[var(--agent-muted)] [&_img]:h-[26px] [&_img]:w-[22px] [&_img]:object-contain  min-2000px:mx-[0.1vw] min-2000px:mt-[0vw] min-2000px:mb-[0.35vw] min-2000px:min-h-[1.2vw] min-2000px:gap-[0.35vw] min-2000px:text-[0.55vw] min-2000px:[&_img]:h-[1.3vw] min-2000px:[&_img]:w-[1.1vw] ${message.role === "user" ? "justify-end" : ""}`}
                      >
                        {message.role === "assistant" && (
                          <img src={agentMascot} alt="" />
                        )}
                        {message.role === "user" ? t("agent.you") : "Nairo"}
                      </span>
                      <div
                        className={`text-sm leading-[1.75] [overflow-wrap:anywhere]  min-2000px:text-[0.7vw] ${message.role === "user" ? "whitespace-pre-wrap rounded-[18px_18px_4px] bg-[#7955bd] px-4 py-3 text-white min-2000px:rounded-[0.9vw_0.9vw_0.2vw] min-2000px:px-[0.8vw] min-2000px:py-[0.6vw]" : "whitespace-normal rounded-[4px_18px_18px] border border-[var(--agent-border)] bg-[var(--agent-surface)] px-[18px] py-4 [&_p]:mt-0 [&_p]:mb-2.5 [&_p]:whitespace-pre-wrap [&>:last-child]:mb-0 [&_a]:text-[var(--agent-accent)] [&_a]:underline [&_a]:underline-offset-[3px] [&_a:hover]:opacity-80 [&_ul]:mt-2 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-[22px] [&_ol]:mt-2 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-[22px] [&_li]:my-1 [&_strong]:font-bold [&_em]:italic [&_:is(h1,h2,h3,h4,h5,h6)]:mt-3.5 [&_:is(h1,h2,h3,h4,h5,h6)]:mb-2 [&_:is(h1,h2,h3,h4,h5,h6)]:font-bold [&_:is(h1,h2,h3,h4,h5,h6)]:leading-[1.4] [&_h1]:text-xl [&_h2]:text-lg [&_h3]:text-base [&_blockquote]:my-2.5 [&_blockquote]:border-l-[3px] [&_blockquote]:border-[var(--agent-accent)] [&_blockquote]:pl-3 [&_blockquote]:text-[var(--agent-muted)] [&_code]:rounded [&_code]:bg-[var(--agent-soft)] [&_code]:px-[5px] [&_code]:py-0.5 [&_code]:font-mono [&_pre]:my-2.5 [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:rounded-[10px] [&_pre]:bg-[var(--agent-soft)] [&_pre]:p-3 [&_pre]:whitespace-pre [&_pre_code]:p-0 [&_table]:my-2.5 [&_table]:block [&_table]:max-w-full [&_table]:border-collapse [&_table]:overflow-x-auto [&_:is(th,td)]:border [&_:is(th,td)]:border-[var(--agent-border)] [&_:is(th,td)]:px-2.5 [&_:is(th,td)]:py-1.5 [&_th]:font-bold [&_hr]:my-3 [&_hr]:border-[var(--agent-border)] min-2000px:rounded-[0.2vw_0.9vw_0.9vw] min-2000px:px-[0.9vw] min-2000px:py-[0.8vw] min-2000px:[&_p]:mt-[0vw] min-2000px:[&_p]:mb-[0.5vw] min-2000px:[&>:last-child]:mb-[0vw] min-2000px:[&_a]:underline-offset-[0.15vw] min-2000px:[&_ul]:mt-[0.4vw] min-2000px:[&_ul]:mb-[0.6vw] min-2000px:[&_ul]:pl-[1.1vw] min-2000px:[&_ol]:mt-[0.4vw] min-2000px:[&_ol]:mb-[0.6vw] min-2000px:[&_ol]:pl-[1.1vw] min-2000px:[&_li]:my-[0.2vw] min-2000px:[&_:is(h1,h2,h3,h4,h5,h6)]:mt-[0.7vw] min-2000px:[&_:is(h1,h2,h3,h4,h5,h6)]:mb-[0.4vw] min-2000px:[&_h1]:text-[1vw] min-2000px:[&_h2]:text-[0.9vw] min-2000px:[&_h3]:text-[0.8vw] min-2000px:[&_blockquote]:my-[0.5vw] min-2000px:[&_blockquote]:border-l-[0.15vw] min-2000px:[&_blockquote]:pl-[0.6vw] min-2000px:[&_code]:rounded-[0.2vw] min-2000px:[&_code]:px-[0.25vw] min-2000px:[&_code]:py-[0.1vw] min-2000px:[&_pre]:my-[0.5vw] min-2000px:[&_pre]:rounded-[0.5vw] min-2000px:[&_pre]:p-[0.6vw] min-2000px:[&_pre_code]:p-[0vw] min-2000px:[&_table]:my-[0.5vw] min-2000px:[&_:is(th,td)]:px-[0.5vw] min-2000px:[&_:is(th,td)]:py-[0.3vw] min-2000px:[&_hr]:my-[0.6vw]"}`}
                      >
                        {message.role === "assistant" ? (
                          <AgentMarkdown content={message.content} onNavigate={close} />
                        ) : (
                          message.content
                        )}
                      </div>
                      {message.role === "assistant" && (
                        <button
                          className="flex min-h-9 items-center gap-1.5 px-[3px] py-1.5 text-[11px] text-[var(--agent-muted)] hover:text-[var(--agent-accent)] min-2000px:min-h-[1.8vw] min-2000px:gap-[0.3vw] min-2000px:px-[0.15vw] min-2000px:py-[0.3vw] min-2000px:text-[0.55vw]"
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
                        "flex min-h-17 items-center gap-3.5 py-1 text-xs text-[var(--agent-muted)] [&_img]:block [&_img]:h-[150px] [&_img]:shrink-0 [&_img]:object-contain min-2000px:min-h-[3.4vw] min-2000px:gap-[0.7vw] min-2000px:py-[0.2vw] min-2000px:text-[0.6vw] min-2000px:[&_img]:h-[7.5vw]",
                        SEASONAL_THEME === "halloween"
                          ? "[&_img]:w-23 min-2000px:[&_img]:w-[4.6vw]"
                          : SEASONAL_THEME === "christmas"
                            ? "[&_img]:w-23 min-2000px:[&_img]:w-[4.6vw]"
                            : "[&_img]:w-18 min-2000px:[&_img]:w-[3.6vw]",
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

              </div>
              <footer className="shrink-0 border-t border-[var(--agent-border)] bg-[var(--agent-surface)] px-5 pt-4 pb-3.5 max-768px:px-3 max-768px:pt-3 max-768px:pb-[max(12px,env(safe-area-inset-bottom))] min-2000px:px-[1vw] min-2000px:pt-[0.8vw] min-2000px:pb-[0.7vw]">
                {error && (
                  <p
                    className="mt-0 mb-3 text-xs leading-[1.6] text-[var(--agent-accent)] min-2000px:mt-[0vw] min-2000px:mb-[0.6vw] min-2000px:text-[0.6vw]"
                    role="alert"
                  >
                    {error}
                  </p>
                )}
                <form
                  className="flex items-end gap-2.5 rounded-[18px] border border-[var(--agent-border)] bg-[var(--agent-canvas)] p-2 pl-4 duration-300 focus-within:ring-2 ring-main/50 focus-within:shadow-[0_0_0_3px_#a47bce12] [&_textarea]:min-h-11 [&_textarea]:max-h-[120px] [&_textarea]:min-w-0 [&_textarea]:flex-1 [&_textarea]:resize-none [&_textarea]:overscroll-contain [&_textarea]:border-0 [&_textarea]:bg-transparent [&_textarea]:py-[11px] [&_textarea]:text-sm [&_textarea]:leading-[22px] [&_textarea]:text-[var(--agent-ink)] [&_textarea]:outline-none [&_textarea::placeholder]:text-[var(--agent-muted)] max-768px:[&_textarea]:text-base min-2000px:gap-[0.5vw] min-2000px:rounded-[0.9vw] min-2000px:p-[0.4vw] min-2000px:pl-[0.8vw] min-2000px:focus-within:shadow-[0_0_0_0.15vw_#a47bce12] min-2000px:[&_textarea]:min-h-[2.2vw] min-2000px:[&_textarea]:max-h-[6vw] min-2000px:[&_textarea]:min-w-[0vw] min-2000px:[&_textarea]:py-[0.55vw] min-2000px:[&_textarea]:text-[0.7vw] min-2000px:[&_textarea]:leading-[1.1vw]"
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
                    className="grid size-11 shrink-0 place-items-center rounded-[13px] bg-[#7955bd] text-[21px] text-white transition-opacity duration-150 disabled:opacity-30 min-2000px:size-[2.2vw] min-2000px:rounded-[0.65vw] min-2000px:text-[1.05vw]"
                    type="submit"
                    disabled={!draft.trim() || pending || clearing}
                    aria-label={t("agent.send")}
                  >
                    <LuArrowUp aria-hidden="true" />
                  </button>
                </form>
                <p className="mt-[9px] mb-0 text-center text-[10px] leading-normal text-[var(--agent-muted)] min-2000px:mt-[0.45vw] min-2000px:mb-[0vw] min-2000px:text-[0.5vw] min-2000px:leading-[1.5]">
                  {t("agent.hint")}
                </p>
              </footer>
            </motion.section>
          </div>
        )}
      </AnimatePresence>
    </div>,
    document.body,
  );
};
