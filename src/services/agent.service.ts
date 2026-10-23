import { $api } from "./interceptor";
import { executeAgentActions } from "../utils/executeAgentActions";
import { SEASONAL_THEME } from "../constants/seasonalTheme";
import { useChristmasMusicStore } from "../stores/christmasMusic";

export const AGENT_MESSAGE_MAX_LENGTH = 2000;

class AgentService {
  async clearHistory(): Promise<void> {
    await $api.delete("/ai/agent/chat");
  }

  async chat(
    message: string,
    history: { role: "user" | "assistant"; content: string }[] = [],
  ): Promise<string> {
    const trimmed = message.trim();
    if (!trimmed || trimmed.length > AGENT_MESSAGE_MAX_LENGTH) {
      throw new Error("Invalid agent message length");
    }

    const { data } = await $api.post("/ai/agent/chat", {
      message: trimmed,
      musicAvailable: SEASONAL_THEME === "christmas",
      musicEnabled: useChristmasMusicStore.getState().enabled,
      history: history
        .slice(-40)
        .map(({ role, content }) => ({
          role,
          content: content.slice(0, 20000),
        })),
    });

    if (typeof data?.message !== "string" || !data.message.trim()) {
      throw new Error("Empty agent reply");
    }

    await executeAgentActions(data.actions);
    return data.message;
  }
}

export const agentService = new AgentService();
