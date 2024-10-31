import { Markup, session, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { MESSAGES } from "./constants.js";
import { createInitialSession } from "./sessionManager.js";
import { processTextMessage } from "./chatHandler.js";
import { formatForTelegramBasicMessages } from "./utils.js";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"));
bot.use(session());

// Главное меню с двумя кнопками после нажатия "Старт"
const mainMenuKeyboard = Markup.keyboard([["FAQ", "Чат с Тайсоном"]])
  .resize()
  .oneTime();

// Клавиатура для FAQ с несколькими вопросами
const faqMenuKeyboard = Markup.keyboard([
  [
    "Что такое ДМТ и экосистема ДМТ?",
    "Как купить ДМТ и другие токены экосистемы:",
  ],
  ["Что такое LP-токены?", "Как положить средства в пул ликвидности?"],
  ["Вернуться в главное меню"],
])
  .resize()
  .oneTime();

// Обработчик команды /start
bot.command("start", async (ctx) => {
  ctx.session = createInitialSession();
  ctx.session.mode = null;
  await ctx.reply(MESSAGES.hello, mainMenuKeyboard);
});

bot.hears("/new", async (ctx) => {
  ctx.session = createInitialSession();
  ctx.session.mode = null;
  await ctx.reply("История общения очищена", mainMenuKeyboard);
});

// Обработчик для кнопки "FAQ", переход к вопросам
bot.hears("FAQ", async (ctx) => {
  ctx.session.mode = "faq";
  await ctx.reply("Выберите вопрос:", faqMenuKeyboard);
});

// Обработчик для кнопки "Чат с Тайсоном", переход в чат-режим
bot.hears("Чат с Тайсоном", async (ctx) => {
  ctx.session.mode = "chat";
  await ctx.reply(`Я нахожусь в режиме чата.
Как я могу помочь тебе сегодня? 💬`);
  bot.on(message("text"), processTextMessage);
});

// Обработка кнопки "Вернуться в главное меню"
bot.hears("Вернуться в главное меню", async (ctx) => {
  await ctx.reply("Вы вернулись в главное меню", mainMenuKeyboard);
});

// Добавляем обработчик нажатия кнопок FAQ
bot.hears("Что такое ДМТ и экосистема ДМТ?", async (ctx) => {
  const message = `
ДМТ – это команда, работающая над проектом, а также её основатель. Команда ведет следующие проекты:

- *ДМТ*
- *Лягушка*
- *Ликвидатор*

Другие команды работают независимо и не подчиняются ДМТ. Они включают:

- *Токены-партнеры* – дружеские команды, с которыми у нас есть общие механики, задания или события.
- *Дружественные токены и сообщества*
- *Участники ДМТ лиги* – [https://t.me/dmt_community_bot?start=ref_66698a601a9bf1e3fca29048](https://t.me/dmt_community_bot?start=ref_66698a601a9bf1e3fca29048)
- *И многое другое*

Все токены и команды выше – отличные, сам держу много их токенов, всегда рад поддержать советом и нужным толчком, но это исключительно дружеские жесты.
`;
  await ctx.reply(formatForTelegramBasicMessages(message), {
    parse_mode: "MarkdownV2",
  });
});

bot.hears("Как купить ДМТ и другие токены экосистемы:", async (ctx) => {
  const message = `
- Используйте *свап кофи* –
  [https://swap.coffee/dex?referral=user_UQC8oun2zkOaRaz8Xecn-2Pl5y077tJs07yDu31aXjd0PKcI](https://swap.coffee/dex?referral=user_UQC8oun2zkOaRaz8Xecn-2Pl5y077tJs07yDu31aXjd0PKcI),
  чтобы обменять ТОН или другие токены на наши токены экосистемы.
  *Важно*: используйте именно свап кофи.
  Если купите через другие платформы, арбитражные боты могут съесть часть цены.
`;
  await ctx.reply(formatForTelegramBasicMessages(message), {
    parse_mode: "MarkdownV2",
  });
});

bot.hears("Что такое LP-токены?", async (ctx) => {
  const message = `
LP-токены – это *токены пулов ликвидности*.
Они выдаются пользователям за вложение активов в пулы ликвидности и представляют собой своего рода квитанцию,
с помощью которой провайдер может вернуть внесенные средства вместе с заработанными процентами.

LP-токены можно использовать для:

- *Фарминга доходности* \\(заработок процентов\\)
- *Получения криптозаймов*
- *Передачи права собственности на ликвидность в стейкинге*

❗️ *Важно*: после передачи LP-токенов другому лицу, вы перестанете владеть соответствующей ликвидностью.

*Простыми словами, ликвидность – это возможность свободно торговать активом без значительных изменений цены.*
`;
  await ctx.reply(formatForTelegramBasicMessages(message), {
    parse_mode: "MarkdownV2",
  });
});

bot.hears("Как положить средства в пул ликвидности?", async (ctx) => {
  const message = `
1. Купите *равное количество пары токенов* на сумму, эквивалентную доллару.
2. Перейдите на [DeDust](https://dedust.io/pools/) и найдите нужный вам пул.
`;
  await ctx.reply(formatForTelegramBasicMessages(message), {
    parse_mode: "MarkdownV2",
  });
});

// Обработка текстовых сообщений
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
    processTextMessage(ctx); // Передача сообщения обработчику для общения с ChatGPT
  }
});
bot.telegram
  .setMyCommands([
    { command: "start", description: "Начать работу" },
    { command: "new", description: "Сбросить историю общения" },
  ])
  .catch((err) => console.log("Ошибка в установлении команд", err.message));

// Запуск бота
bot.launch();
process.once("SIGNIN", () => bot.stop("SIGNIN"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
