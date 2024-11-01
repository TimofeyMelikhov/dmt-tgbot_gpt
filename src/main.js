import { Markup, session, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { MESSAGES } from "./constants.js";
import { createInitialSession } from "./sessionManager.js";
import { processTextMessage } from "./chatHandler.js";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"));
bot.use(session());

const mainMenuKeyboard = Markup.keyboard([["FAQ", "Чат с Тайсоном"]])
  .resize()
  .oneTime();

const faqMenuKeyboard = Markup.keyboard([
  [
    "Что такое ДМТ и экосистема ДМТ?",
    "Как купить ДМТ и другие токены экосистемы?",
  ],
  ["Что такое LP-токены?", "Как положить средства в пул ликвидности?"],
  ["Вернуться в главное меню"],
])
  .resize()
  .oneTime();
const chatMenuKeyboard = Markup.keyboard([
  ["Вернуться в главное меню", "Сбросить историю"],
])
  .resize()
  .oneTime();

bot.command("start", async (ctx) => {
  ctx.session = createInitialSession();
  ctx.session.mode = null;
  await ctx.reply(MESSAGES.hello, mainMenuKeyboard);
});

bot.hears("Сбросить историю", async (ctx) => {
  ctx.session = createInitialSession();
  ctx.session.mode = "chat";
  await ctx.reply("История общения сброшена", chatMenuKeyboard);
});

bot.hears("FAQ", async (ctx) => {
  ctx.session.mode = "faq";
  await ctx.reply("Выберите вопрос:", faqMenuKeyboard);
});

bot.hears("Чат с Тайсоном", async (ctx) => {
  ctx.session.mode = "chat";
  await ctx.reply(
    `Я нахожусь в режиме чата.
Как я могу помочь тебе сегодня? 💬`,
    chatMenuKeyboard
  );
  bot.on(message("text"), processTextMessage);
});

bot.hears("Вернуться в главное меню", async (ctx) => {
  ctx.session.mode = null;
  await ctx.reply("Вы вернулись в главное меню", mainMenuKeyboard);
});

bot.hears("Что такое ДМТ и экосистема ДМТ?", async (ctx) => {
  await ctx.reply(MESSAGES.dmtAndEcosystem, {
    parse_mode: "Markdown",
  });
});

bot.hears("Как купить ДМТ и другие токены экосистемы?", async (ctx) => {
  await ctx.reply(MESSAGES.purchaseDmtAndTokens, {
    parse_mode: "Markdown",
  });
});

bot.hears("Что такое LP-токены?", async (ctx) => {
  await ctx.reply(MESSAGES.whatAreLpTokens, {
    parse_mode: "Markdown",
  });
});

bot.hears("Как положить средства в пул ликвидности?", async (ctx) => {
  await ctx.reply(MESSAGES.fundLiquidityPool, {
    parse_mode: "Markdown",
  });
});

bot.on(message("text"), async (ctx) => {
  if (ctx.session.mode === null) {
    await ctx.reply(
      "Пожалуйста, выберите режим, нажав на одну из кнопок в меню."
    );
  } else if (ctx.session.mode === "faq") {
    await ctx.reply(
      "Чтобы задать вопрос, вернитесь в режим чата, выбрав 'Чат с Тайсоном' в главном меню."
    );
  } else if (ctx.session.mode === "chat") {
    processTextMessage(ctx);
  }
});
bot.telegram
  .setMyCommands([{ command: "start", description: "Начать работу" }])
  .catch((err) => console.log("Ошибка в установлении команд", err.message));

bot.launch();
process.once("SIGNIN", () => bot.stop("SIGNIN"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
