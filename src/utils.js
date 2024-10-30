export const formatForTelegramBasicMessages = (text) => {
  // Преобразование Markdown в Telegram MarkdownV2
  const transformedText = text

    .replace(/([.+-?^${}|])/g, "\\$1") // Экранирование специальных символов
    .replace(/_/g, "\\_") // Экранирование символа подчеркивания
    .replace(/~/g, "\\~") // Экранирование символа тильда
    .replace(/`/g, "\\`"); // Экранирование символа обратной кавычки

  // Экранирование символов для Telegram MarkdownV2
  return transformedText;
};
