import { MESSAGES } from "../constants/messages.js";
import { mainMenuKeyboard } from "../keyboards.js";
import { sessionStore } from "../session/sessionManager.js";

const INACTIVITY_LIMIT = 15 * 60 * 1000;

export const cleanInactiveSessions = (bot) => {
  setInterval(() => {
    const now = Date.now();
    sessionStore.forEach((session, userId) => {
      const inactivityDuration = now - session.lastActivity;
      if (inactivityDuration > INACTIVITY_LIMIT) {
        sessionStore.delete(userId);
        bot.telegram.sendMessage(userId, MESSAGES.goodbye, {
          reply_markup: mainMenuKeyboard.reply_markup,
        });
      }
    });
  }, 10 * 60 * 1000);
};
