import fs from "fs";

const LOG_FILE_PATH = "./logs/userLogs.json";

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

  const logData = JSON.parse(fs.readFileSync(LOG_FILE_PATH, "utf8"));

  if (!logData.userNames.includes(userName)) {
    logData.totalUsers += 1;
    logData.userNames.push(userName);

    fs.writeFileSync(LOG_FILE_PATH, JSON.stringify(logData, null, 2));
  }
};
