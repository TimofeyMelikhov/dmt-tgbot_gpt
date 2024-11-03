import fs from "fs";

const LOG_FILE_PATH = "./logs/userLogs.json";
// const LOG_FILE_PATH = "./dmt-tgbot_gpt/logs/userLogs.json";

const initializeLogFile = () => {
  if (!fs.existsSync(LOG_FILE_PATH)) {
    fs.writeFileSync(
      LOG_FILE_PATH,
      JSON.stringify({ totalUsers: 0, userNames: [] }, null, 2)
    );
  }
};

export const logUser = (userName) => {
  initializeLogFile();
  console.log("Current working directory:", process.cwd());
  console.log("Expected log file path:", LOG_FILE_PATH);

  const logData = JSON.parse(fs.readFileSync(LOG_FILE_PATH, "utf8"));

  if (!logData.userNames.includes(userName)) {
    logData.totalUsers += 1;
    logData.userNames.push(userName);

    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logData, null, 2));
  }
};
