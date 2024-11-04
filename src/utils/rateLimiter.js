import Bottleneck from "bottleneck";

export const limiter = new Bottleneck({
  maxConcurrent: 3, // Разрешаем до 3 параллельных запросов
  minTime: 100, // Минимум 100 мс между запросами (10 запросов/сек)
});
