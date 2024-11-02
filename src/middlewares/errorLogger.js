import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Функция для получения имени файла на основе текущей даты
const getErrorLogFilePath = () => {
  const date = new Date().toISOString().split("T")[0];
  return path.join(logDir, `errorLogs_${date}.json`);
};

// Функция для логирования ошибок
export const logError = (error) => {
  const filePath = getErrorLogFilePath();

  // Инициализируем файл, если он ещё не создан
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }

  // Читаем текущие логи ошибок
  const errorLogs = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Добавляем новую ошибку с меткой времени и сообщением
  errorLogs.push({
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
  });

  // Записываем обновлённые логи обратно в файл
  fs.writeFileSync(filePath, JSON.stringify(errorLogs, null, 2));
};
