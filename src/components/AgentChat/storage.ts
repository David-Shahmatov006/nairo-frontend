import type { AgentMessage } from ".";

type Conversation = { messages: AgentMessage[]; draft: string };
const storageKey = (userId: string) => `nairo-agent-chat:${userId}`;

export function loadConversation(userId: string): Conversation {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(storageKey(userId)) || "null",
    );
    if (
      saved &&
      typeof saved === "object" &&
      "messages" in saved &&
      "draft" in saved &&
      typeof saved.draft === "string" &&
      Array.isArray(saved.messages)
    ) {
      const messages = saved.messages.filter(
        (message): message is AgentMessage =>
          message &&
          typeof message === "object" &&
          typeof message.id === "string" &&
          (message.role === "user" || message.role === "assistant") &&
          typeof message.content === "string",
      );
      return { messages, draft: saved.draft };
    }
  } catch {
    // Corrupt or unavailable storage must not prevent opening the chat.
  }
  return { messages: [], draft: "" };
}

export function saveConversation(
  userId: string,
  conversation: Conversation,
): void {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(conversation));
  } catch {
    // Keep the chat usable when storage is full or blocked.
  }
}
