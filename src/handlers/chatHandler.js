import { code } from "telegraf/format";
import { openai } from "../services/openai.js";
import { formatForTelegram } from "../utils/utils.js";
import { logError } from "../middlewares/errorLogger.js";
import { MESSAGES } from "../constants/messages.js";
import { getSession } from "../session/sessionManager.js";

export const processTextMessage = async (ctx) => {
  const processingMessage = await ctx.reply(code(MESSAGES.processing));
  const userId = ctx.from.id;
  const session = getSession(userId);
  try {
    const userText = ctx.message.text;

    session.messages.push({ role: openai.roles.USER, content: userText });

    const response = await openai.chat(session.messages);

    if (response) {
      session.messages.push({
        role: openai.roles.ASSISTANT,
        content: response,
      });

      await ctx.deleteMessage(processingMessage.message_id);

      await ctx.reply(formatForTelegram(response), { parse_mode: "Markdown" });
    } else {
      await ctx.reply("Извините, не удалось получить ответ от сервера.");
    }
  } catch (error) {
    logError(error);
    console.log(`Error while text message:`, error.message);
    await ctx.reply(MESSAGES.error);
  }
};
