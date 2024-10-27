import OpenAI from "openai";
import config from "config";

class OpenAi {
  roles = {
    ASSISTANT: "assistant",
    USER: "user",
    SYSTEM: "system",
  };

  constructor(apiKey) {
    this.openai = new OpenAI({
      apiKey,
      baseURL: "https://api.proxyapi.ru/openai/v1",
    });
  }

  async chat(messages) {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages,
      });
      return response.choices[0].message.content;
    } catch (error) {
      console.error("Error while gptchat:", error.message);
    }
  }
}

export const openai = new OpenAi(config.get("OPENAI_KEY"));
