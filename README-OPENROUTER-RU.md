# Публикация игры с OpenRouter (бесплатная модель)

## 1. Настройка

В проекте уже выбраны `PROVIDER = "openrouter"` и `MODEL = "google/gemma-4-26b-a4b-it:free"` в `wrangler.toml`. Модель должна поддерживать изображения; доступность бесплатной версии может меняться.

## 2. Cloudflare

В терминале в папке проекта: `npm install -g wrangler` (если ещё не установлен), `npx wrangler login`, `npx wrangler deploy`. Для этого нужен Node.js.

Затем в Cloudflare Dashboard → Workers & Pages → space-between-memories → Settings → Variables and Secrets → Add: имя `OPENROUTER_API_KEY`, тип **Secret**, значение — ваш существующий ключ. Сохраните и разверните изменения, если интерфейс попросит. Можно также выполнить `npx wrangler secret put OPENROUTER_API_KEY` в папке проекта. Никогда не записывайте ключ в `wrangler.toml` или `public/index.html`.

## 3. Проверка

Откройте `https://<имя-воркера>.<ваш-subdomain>.workers.dev/api/health`. Должно быть `ok:true`, `provider:openrouter`. Затем откройте корневой адрес сайта, создайте память с фотографией и проверьте Regenerate with AI.

## 4. Ограничения

У бесплатных моделей OpenRouter могут быть лимиты 50 запросов/сутки, очереди и недоступность. Нельзя гарантировать работоспособность у всех проверяющих без нагрузочного теста. Лимит по IP в этом Worker best-effort (не глобальная защита от злоупотреблений). Входящие фотографии передаются в OpenRouter и выбранному провайдеру модели.

## 5. Если не работает

Если `/api/health` возвращает `ok:false`, секрет не установлен. Если генерация возвращает 404/429, проверьте доступность и лимиты выбранной модели. При необходимости смените `MODEL` на другой подтверждённый бесплатный vision model ID.
