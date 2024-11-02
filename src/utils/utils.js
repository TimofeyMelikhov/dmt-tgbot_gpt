export const formatForTelegram = (text) => {
  return text
    .replace(/^# (.*?)$/gm, "*$1*")
    .replace(/^## (.*?)$/gm, "*$1*")
    .replace(/^### (.*?)$/gm, "*$1*")
    .replace(/^#### (.*?)$/gm, "_$1_")
    .replace(/\*\*(.*?)\*\*/g, "*$1*")
    .replace(/__(.*?)__/g, "_$1_")
    .replace(/`([^`]+)`/g, "`$1`")
    .replace(/```([^`]+)```/g, "```$1```");
};
