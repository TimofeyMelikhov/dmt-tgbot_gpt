import { Markup, session, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { MESSAGES } from "./constants.js";
import { createInitialSession } from "./sessionManager.js";
import { processTextMessage } from "./chatHandler.js";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"));

bot.use(session());

const mainMenuKeyboard = Markup.keyboard([
  ["Как купить DMT?", "Почему стоит купить DMT?"],
  ["Как заработать DMT во время лиги?", "Что будет после окончания лиги?"],
])
  .resize()
  .oneTime();

bot.command("start", async (ctx) => {
  ctx.session = createInitialSession();
  await ctx.reply(MESSAGES.hello, mainMenuKeyboard);
});

bot.command("new", async (ctx) => {
  ctx.session = createInitialSession();
  await ctx.reply("Сессия сброшена, жду вашего сообщения!", mainMenuKeyboard);
});

bot.hears("Как купить DMT?", async (ctx) => {
  await ctx.reply(
    "Инструкция по покупке DMT: 1. Зарегистрируйтесь... 2. Следуйте шагам..."
  );
});

bot.hears("Почему стоит купить DMT?", async (ctx) => {
  await ctx.reply(
    "Преимущества покупки DMT:\n- Преимущество 1: ...\n- Преимущество 2: ..."
  );
});

bot.hears("Как заработать DMT во время лиги?", async (ctx) => {
  await ctx.reply("Чтобы заработать DMT во время лиги, вы можете...");
});

bot.hears("Что будет после окончания лиги?", async (ctx) => {
  await ctx.reply("После окончания лиги будет происходить следующее:...");
});

bot.on(message("text"), processTextMessage);

bot.telegram
  .setMyCommands([
    { command: "start", description: "Начать работу" },
    { command: "new", description: "Сбросить историю общения" },
  ])
  .catch((err) => console.log("Ошибка в установлении команд", err.message));

bot.launch();

process.once("SIGNIN", () => bot.stop("SIGNIN"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
