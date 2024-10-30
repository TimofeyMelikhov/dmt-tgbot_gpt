import { Markup, session, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { MESSAGES } from "./constants.js";
import { createInitialSession } from "./sessionManager.js";
import { processTextMessage } from "./chatHandler.js";
import { formatForTelegramBasicMessages } from "./utils.js";

const bot = new Telegraf(config.get("TELEGRAM_TOKEN"));

bot.use(session());

// Настройка клавиатуры с кнопками
const mainMenuKeyboard = Markup.keyboard([
  [
    "Что такое ДМТ и экосистема ДМТ?",
    "Как купить ДМТ и другие токены экосистемы:",
  ],
  ["Что такое LP-токены?", "Как положить средства в пул ликвидности?"],
  ["Сбросить сессию", "Старт"],
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

// Обработка команды /start
bot.hears("Старт", async (ctx) => {
  ctx.session = createInitialSession();
  await ctx.reply(MESSAGES.hello);
});

// Обработка команды /new для сброса сессии
bot.hears("Сбросить сессию", async (ctx) => {
  ctx.session = createInitialSession();
  await ctx.reply("Сессия сброшена, жду вашего сообщения!");
});

// Добавляем обработчик нажатия кнопки
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
bot.on(message("text"), processTextMessage);
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
