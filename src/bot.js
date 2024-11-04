import { session, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { getSession } from "./session/sessionManager.js";
import {
  deleteHistory,
  handleBackToMainMenuCommand,
  handleChatCommand,
  handleChatWithTysonCommand,
  handleDmtAndEcosystemCommand,
  handleFaqCommand,
  handleFundLiquidityPoolCommand,
  handlePurchaseDmtAndTokensCommand,
  handleStartCommand,
  handleWhatAreLpTokensCommand,
} from "./handlers/commandHandler.js";
import { cleanInactiveSessions } from "./middlewares/sessionCleanup.js";
import { limiter } from "./utils/rateLimiter.js";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"));

bot.use(session());

bot.use(async (ctx, next) => {
  const userId = ctx.from.id;
  const session = getSession(userId);
  session.lastActivity = Date.now();
  try {
    await limiter.schedule(() => next());
  } catch (error) {
    logError(error);
    if (error.code === 403) {
      console.log(`Пользователь ${ctx.from.username} заблокирован`);
    }
  }
});

bot.command("start", handleStartCommand);
bot.hears("Сбросить историю", deleteHistory);
bot.hears("FAQ", handleFaqCommand);
bot.hears("Чат с Тайсоном", handleChatWithTysonCommand);
bot.hears("Вернуться в главное меню", handleBackToMainMenuCommand);
bot.hears("Что такое ДМТ и экосистема ДМТ?", handleDmtAndEcosystemCommand);
bot.hears(
  "Как купить ДМТ и другие токены экосистемы?",
  handlePurchaseDmtAndTokensCommand
);
bot.hears("Что такое LP-токены?", handleWhatAreLpTokensCommand);
bot.hears(
  "Как положить средства в пул ликвидности?",
  handleFundLiquidityPoolCommand
);
bot.on(message("text"), handleChatCommand);

bot.telegram
  .setMyCommands([{ command: "start", description: "Начать работу" }])
  .catch((err) => console.log("Ошибка в установлении команд", err.message));

cleanInactiveSessions(bot);
bot.launch();
process.once("SIGNIN", () => bot.stop("SIGNIN"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
