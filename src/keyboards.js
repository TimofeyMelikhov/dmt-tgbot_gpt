import { Markup } from "telegraf";

export const mainMenuKeyboard = Markup.keyboard([["FAQ", "Чат с Тайсоном"]])
  .resize()
  .oneTime();

export const faqMenuKeyboard = Markup.keyboard([
  ["Вернуться в главное меню"],
  ["Как положить токены в пулы ликвидности и фризы?"],
  ["Что такое ДМТ и экосистема ДМТ?"],
  ["Как купить ДМТ и другие токены экосистемы?"],
  ["Что такое LP-токены?"],
  ["Как положить средства в пул ликвидности?"],
])
  .resize()
  .oneTime();

export const chatMenuKeyboard = Markup.keyboard([
  ["Вернуться в главное меню", "Сбросить историю"],
])
  .resize()
  .oneTime();
