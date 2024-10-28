import { code } from "telegraf/format";

export const processTextMessage = async (ctx) => {
  ctx.session ??= createInitialSession();
  try {
    await ctx.reply(code(MESSAGES.processing));
    const userText = ctx.message.text;

    ctx.session.messages.push({ role: openai.roles.USER, content: userText });

    const response = await openai.chat(ctx.session.messages);

    if (response) {
      ctx.session.messages.push({
        role: openai.roles.ASSISTANT,
        content: response,
      });
      await ctx.reply(response);
    } else {
      await ctx.reply("Извините, не удалось получить ответ от сервера.");
    }
  } catch (error) {
    console.log(`Error while text message:`, error.message);
    await ctx.reply(MESSAGES.error);
  }
};
