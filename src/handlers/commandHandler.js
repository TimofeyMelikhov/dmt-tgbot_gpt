import { MESSAGES } from "../constants/messages.js";
import {
  chatMenuKeyboard,
  faqMenuKeyboard,
  mainMenuKeyboard,
} from "../keyboards.js";
import { logError } from "../middlewares/errorLogger.js";
import { logUser } from "../services/userLogger.js";
import { deleteSession, getSession } from "../session/sessionManager.js";
import { processTextMessage } from "./chatHandler.js";

export const handleStartCommand = async (ctx) => {
  try {
    const userId = ctx.from.id;
    const session = getSession(userId);
    session.mode = null;
    logUser(ctx.from.username, ctx.from.id);
    ctx.reply(MESSAGES.hello, mainMenuKeyboard);
  } catch (error) {
    logError(error);
    console.error("Error in start command:", error.message);
    await ctx.reply("Произошла ошибка, попробуйте позже.");
  }
};

export const deleteHistory = async (ctx) => {
  const userId = ctx.from.id;
  const session = getSession(userId);
  deleteSession(userId);
  session.mode = null;
  await ctx.reply("История общения сброшена", mainMenuKeyboard);
};

export const handleChatCommand = async (ctx) => {
  const userId = ctx.from.id;
  const session = getSession(userId);
  try {
    if (session.mode === null) {
      await ctx.reply(
        "Пожалуйста, выберите режим, нажав на одну из кнопок в меню."
      );
    } else if (session.mode === "faq") {
      await ctx.reply(
        "Чтобы задать вопрос, вернитесь в режим чата, выбрав 'Чат с Тайсоном' в главном меню."
      );
    } else if (session.mode === "chat") {
      processTextMessage(ctx);
    }
  } catch (error) {
    logError(error);
    console.error("Error processing message:", error.message);
    await ctx.reply("Произошла ошибка, попробуйте позже.");
  }
};

export const handleFaqCommand = async (ctx) => {
  const userId = ctx.from.id;
  const session = getSession(userId);
  session.mode = "faq";
  await ctx.reply("Выберите вопрос:", faqMenuKeyboard);
};

export const handleChatWithTysonCommand = async (ctx) => {
  const userId = ctx.from.id;
  const session = getSession(userId);
  session.mode = "chat";
  await ctx.reply(
    `Я нахожусь в режиме чата.
Как я могу помочь тебе сегодня? 💬`,
    chatMenuKeyboard
  );
};

export const handleBackToMainMenuCommand = async (ctx) => {
  const userId = ctx.from.id;
  const session = getSession(userId);
  session.mode = null;
  await ctx.reply("Вы вернулись в главное меню", mainMenuKeyboard);
};

export const handleDmtAndEcosystemCommand = async (ctx) => {
  await ctx.reply(MESSAGES.dmtAndEcosystem, {
    parse_mode: "Markdown",
  });
};

export const handlePurchaseDmtAndTokensCommand = async (ctx) => {
  await ctx.reply(MESSAGES.purchaseDmtAndTokens, {
    parse_mode: "Markdown",
  });
};

export const handleWhatAreLpTokensCommand = async (ctx) => {
  await ctx.reply(MESSAGES.whatAreLpTokens, {
    parse_mode: "Markdown",
  });
};

export const handleFundLiquidityPoolCommand = async (ctx) => {
  await ctx.reply(MESSAGES.fundLiquidityPool, {
    parse_mode: "Markdown",
  });
};
export const handleliquidityAndFreezeInfoCommand = async (ctx) => {
  await ctx.reply(MESSAGES.liquidityAndFreezeInfo, {
    parse_mode: "Markdown",
  });
};
