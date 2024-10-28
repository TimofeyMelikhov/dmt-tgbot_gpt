// sessionManager.js
import fs from "fs";
import { openai } from "./openai.js";

// Загрузка контекста из JSON
const contextData = JSON.parse(fs.readFileSync("./src/data.json", "utf8"));

// Начальная сессия
const INITIAL_SESSION = {
  messages: [
    {
      role: openai.roles.SYSTEM,
      content:
        "Ты — бот, отвечающий только в рамках текущего жестко закрепленного контекста...",
    },
    ...contextData.how_to_buy_dmt.instructions.map((instruction) => ({
      role: openai.roles.SYSTEM,
      content: `Как купить DMT: ${instruction.step}. Ссылка: ${instruction.link}. Примечание: ${instruction.note}`,
    })),
    ...contextData.why_buy_dmt.reasons.map((reason) => ({
      role: openai.roles.SYSTEM,
      content: `Почему стоит купить DMT: ${reason.reason}. Объяснение: ${reason.explanation}.`,
    })),
    {
      role: openai.roles.SYSTEM,
      content: `Как заработать DMT во время лиги: ${contextData.how_to_earn_dmt_during_league.link}`,
    },
    ...contextData.what_happens_after_league.updates.map((update) =>
      typeof update === "string"
        ? {
            role: openai.roles.SYSTEM,
            content: `Что будет после окончания лиги: ${update}`,
          }
        : {
            role: openai.roles.SYSTEM,
            content: `Что будет после окончания лиги: ${update.update}. Ссылка: ${update.link}`,
          }
    ),
    ...contextData.how_to_get_dmt_free_or_cheap.methods.map((method) => ({
      role: openai.roles.SYSTEM,
      content: `Как получить DMT бесплатно или дешево: ${
        method.method
      }. Примечание: ${method.note}. ${
        method.link ? `Ссылка: ${method.link}` : ""
      }`,
    })),
    { role: openai.roles.SYSTEM, content: `Сводка: ${contextData.summary}` },
  ],
};

export const createInitialSession = () => ({
  messages: [...INITIAL_SESSION.messages],
});
