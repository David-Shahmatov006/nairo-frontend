import { $api } from "./interceptor";

export const AGENT_MESSAGE_MAX_LENGTH = 2000;

class AgentService {
  async chat(message: string, history: { role: "user" | "assistant"; content: string }[] = []): Promise<string> {
    const trimmed = message.trim();
    if (!trimmed || trimmed.length > AGENT_MESSAGE_MAX_LENGTH) {
      throw new Error("Invalid agent message length");
    }

    const { data } = await $api.post("/ai/agent/chat", {
      message: trimmed,
      history: history.slice(-40).map(({ role, content }) => ({ role, content: content.slice(0, 20000) })),
    });

    if (typeof data?.message !== "string" || !data.message.trim()) {
      throw new Error("Empty agent reply");
    }

    return data.message;
  }
}

export const agentService = new AgentService();
