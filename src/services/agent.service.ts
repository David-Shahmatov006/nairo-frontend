import { $api } from "./interceptor";

export const AGENT_MESSAGE_MAX_LENGTH = 2000;

class AgentService {
  async chat(message: string): Promise<string> {
    const trimmed = message.trim();
    if (!trimmed || trimmed.length > AGENT_MESSAGE_MAX_LENGTH) {
      throw new Error("Invalid agent message length");
    }

    const { data } = await $api.post("/ai/agent/chat", {
      message: trimmed,
    });

    if (typeof data?.message !== "string" || !data.message.trim()) {
      throw new Error("Empty agent reply");
    }

    return data.message;
  }
}

export const agentService = new AgentService();
