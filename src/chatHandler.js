import { code } from "telegraf/format";
import { createInitialSession } from "./sessionManager.js";
import { MESSAGES } from "./constants.js";
import { openai } from "./openai.js";

const formatForTelegram = (text) => {
  // Преобразование Markdown в Telegram MarkdownV2
  const transformedText = text
    .replace(/^# (.*?)$/gm, "*$1*") // Заголовки уровня 1 (# -> *)
    .replace(/^## (.*?)$/gm, "*$1*") // Заголовки уровня 2 (## -> *)
    .replace(/^### (.*?)$/gm, "*$1*") // Заголовки уровня 3 (### -> *)
    .replace(/^#### (.*?)$/gm, "_$1_") // Заголовки уровня 4 (#### -> _)
    .replace(/\*\*(.*?)\*\*/g, "*$1*") // Жирный текст (** -> *)
    .replace(/__(.*?)__/g, "_$1_") // Курсив (__ -> _)
    .replace(/`([^`]+)`/g, "`$1`") // Моноширинный текст
    .replace(/```([^`]+)```/g, "```$1```"); // Блоки кода

  // Экранирование спецсимволов Telegram MarkdownV2
  return transformedText.replace(/([_\~`>+\-=|{}.!])/g, "\\$1");
};

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

      const formattedResponse = formatForTelegram(response);
      await ctx.reply(formattedResponse, { parse_mode: "MarkdownV2" });
      console.log(formattedResponse);
    } else {
      await ctx.reply("Извините, не удалось получить ответ от сервера.");
    }
  } catch (error) {
    console.log(`Error while text message:`, error.message);
    await ctx.reply(MESSAGES.error);
  }
};
