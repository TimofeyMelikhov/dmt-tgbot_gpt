import { code } from "telegraf/format";
import { createInitialSession } from "./sessionManager.js";
import { MESSAGES } from "./constants.js";
import { openai } from "./openai.js";
import { formatForTelegram } from "./utils.js";

export const processTextMessage = async (ctx) => {
  ctx.session ??= createInitialSession();
  const processingMessage = await ctx.reply(code(MESSAGES.processing));
  try {
    const userText = ctx.message.text;

    ctx.session.messages.push({ role: openai.roles.USER, content: userText });

    const response = await openai.chat(ctx.session.messages);

    if (response) {
      ctx.session.messages.push({
        role: openai.roles.ASSISTANT,
        content: response,
      });

      await ctx.deleteMessage(processingMessage.message_id);

      await ctx.reply(formatForTelegram(response), { parse_mode: "Markdown" });
    } else {
      await ctx.reply("Извините, не удалось получить ответ от сервера.");
    }
  } catch (error) {
    console.log(`Error while text message:`, error.message);
    await ctx.reply(MESSAGES.error);
  }
};
