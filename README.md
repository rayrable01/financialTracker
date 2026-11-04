# 💳 Financial Tracker

Современное веб-приложение (Single Page Application) для персонального учета финансов, мониторинга банковских карт, отслеживания курсов валют и аналитики расходов.

---

## 🚀 Стек технологий

- **Ядро приложения**: React 19, TypeScript (Strict Mode), Vite 8, React Router 7.
- **Управление состоянием**: Redux Toolkit, RTK Query.
- **Стилизация**: CSS Modules, CSS Custom Properties (дизайн-токены, поддержка светлой и темной тем), Lucide Icons.
- **Формы и валидация**: React Hook Form, IMask / React IMask, Card Validator.
- **Тестирование**: Vitest 5, React Testing Library, JSDOM, V8 Coverage.
- **Линтинг и форматирование**: ESLint 10 (Flat Config), Stylelint 17, Prettier 3.
- **Контроль качества и Git-хуки**: Husky 9, Lint-Staged, Commitlint (Conventional Commits).
- **CI/CD & DevOps**: GitHub Actions (4-этапный пайплайн), Docker (Multi-stage build), Nginx Alpine.

---

## 🏛 Архитектура проекта

Проект построен по принципам чистой плоской модульной архитектуры (компонентно-ориентированный подход):

```text
financialTracker/
├── .github/workflows/    # CI/CD пайплайн (проверка качества, тесты, сборка, docker)
├── .husky/               # Git-хуки (pre-commit: lint, format, typecheck, tests; commit-msg: commitlint)
├── server/               # Локальный мок-сервер (Express + tsx) для dev-режима
│   ├── endpoints/        # Эндпоинты мок-API (cards и др.)
│   └── index.ts          # Входная точка стаб-сервера (порт 3001)
├── src/
│   ├── api/              # RTK Query слайсы и роутер окружений (apiRouter.ts)
│   ├── components/       # Изолированные атомарные UI-компоненты (CardList, Search, etc.)
│   ├── layout/           # Лейауты приложения (LeftSidebarLayout, RightSideLayout, Header)
│   ├── pages/            # Композиционные страницы экранов с lazy-loading
│   ├── routes/           # Конфигурация маршрутов с разделением чанков (React.lazy)
│   ├── store/            # Конфигурация Redux Store
│   ├── test/             # Глобальная тестовая среда Vitest и полифилы
│   ├── types/            # СТРОГО все доменные типы, интерфейсы и DTO сущностей
│   ├── utils/            # Вспомогательные функции, утилиты валидации и константы
│   ├── App.tsx           # Корневой компонент
│   ├── index.css         # Глобальные стили, CSS-переменные и токены тем
│   └── main.tsx          # Точка входа в React SPA
├── nginx.conf            # Продакшен-конфигурация Nginx (gzip, кэширование, security headers)
├── Dockerfile            # Двухэтапная сборка образа (Node 22 builder -> Nginx runtime)
└── ...                   # Конфигурации (Vite, TS, ESLint, Prettier, Stylelint)
```

### Ключевые архитектурные правила:

1. **Изоляция Dev и Prod:**
   - В продакшене приложение представляет собой чистый статический SPA, работающий внутри Nginx (~25MB образ). Фронтенд обращается к внешнему REST API напрямую через переменную `VITE_FINANCE_API`.
   - В dev-режиме мок-сервер на Express запускается локально на порту `3001`, а Vite автоматически проксирует вызовы `/api/*`.
2. **Расположение типов (`src/types/`):**
   - Все доменные интерфейсы и DTO хранятся строго в `src/types/<domain>.ts`. Создание локальных файлов `types.ts` внутри папок страниц запрещено.
3. **Декомпозиция компонентов (`src/components/`):**
   - Все переиспользуемые блоки выносятся в `src/components/`. Внутри папок страниц нет вложенных `components/` — страница служит исключительно композиционным слоем.
4. **Code Splitting (Оптимизация бандла):**
   - Все маршруты в `src/routes/routes.ts` используют `React.lazy()` и обернуты в `<Suspense>`. Каждая страница компилируется в отдельный легковесный чанк и загружается только при переходе по ссылке.

---

## 🛠 Быстрый старт

### Системные требования

- **Node.js**: `>= 22.0.0` (рекомендуется использовать `.nvmrc`)
- **npm**: `>= 10.0.0`

### 1. Установка зависимостей

```bash
npm ci
```

### 2. Настройка окружения

Создайте локальный файл `.env` на основе примера:

```bash
cp .env.example .env
```

Переменные окружения:

- `VITE_FINANCE_API` — URL внешнего API для продакшена.
- `STUB_PORT` — Порт локального Express мок-сервера (по умолчанию `3001`).

### 3. Запуск в режиме разработки

```bash
npm run dev
```

Команда параллельно запускает:

- **Vite Dev Server** (SPA) на `http://localhost:5173` с мгновенным HMR.
- **Express Mock Server** на `http://localhost:3001` через `tsx watch`.

---

## 📋 Скрипты проекта

| Команда                 | Описание                                                          |
| :---------------------- | :---------------------------------------------------------------- |
| `npm run dev`           | Одновременный запуск фронтенда и мок-сервера разработки           |
| `npm run dev:stub`      | Запуск только мок-сервера на Express                              |
| `npm run build`         | Проверка типов (`tsc -b`) и сборка продакшен-бандла в `dist/`     |
| `npm run preview`       | Локальный сервер для предпросмотра собранного бандла              |
| `npm run typecheck`     | Полная проверка типов TypeScript во всем проекте без генерации JS |
| `npm run lint`          | Комплексная проверка кода через ESLint и Stylelint                |
| `npm run lint:js`       | Проверка JS/TS файлов через ESLint                                |
| `npm run lint:css`      | Проверка CSS Modules через Stylelint                              |
| `npm run lint:css:fix`  | Автоматическое исправление ошибок в CSS                           |
| `npm run format`        | Автоматическое форматирование всех файлов проекта через Prettier  |
| `npm run format:check`  | Проверка форматирования без изменения файлов (для CI)             |
| `npm run test`          | Запуск тестов Vitest в интерактивном watch-режиме                 |
| `npm run test:run`      | Однократный запуск всех 67 unit/integration тестов                |
| `npm run test:coverage` | Прогон тестов с формированием честного отчета покрытия V8         |

---

## 🔒 Контроль качества (Git Hooks & CI)

### 1. Pre-commit хук (Husky + lint-staged)

При выполнении команды `git commit` автоматически запускается цепочка проверок:

1. **lint-staged**: Все подготовленные к коммиту файлы автоматически форматируются через Prettier и очищаются через `eslint --fix` / `stylelint --fix`.
2. **Typecheck**: Запускается `npm run typecheck` (`tsc -b --noEmit`) — коммит отклоняется при любых ошибках типизации.
3. **Unit Tests**: Запускается `npm run test:run` — коммит отклоняется, если хотя бы один тест упал.

### 2. Commitlint (Conventional Commits)

Текст сообщения коммита валидируется по стандарту:

- `feat:` — добавление новой функциональности
- `fix:` — исправление ошибки
- `refactor:` — оптимизация и рефакторинг кода без изменения логики
- `chore:` — обновление конфигов, зависимостей, рутинные задачи
- `docs:` — правки документации
- `test:` — добавление или изменение тестов

### 3. CI/CD (GitHub Actions)

В файле `.github/workflows/check.yml` настроен 4-этапный пайплайн:

- **Code Quality & Types**: Проверка Prettier (`format:check`), линтеров (`lint`) и типов (`typecheck`).
- **Unit Tests**: Прогон тестов Vitest.
- **Production Build**: Сборка бандла через `npm run build`.
- **Docker Build**: Проверка сборки Docker-образа приложения.

---

## 🐳 Docker и Production

### Сборка Docker-образа

```bash
docker build -t financial-tracker .
```

Сборка состоит из двух этапов:

1. **Builder (`node:22-alpine`)**: Устанавливает чистые зависимости через `npm ci` и собирает статику.
2. **Runtime (`nginx:alpine`)**: Копирует собранный `dist/` и оптимизированный `nginx.conf`. Размер итогового контейнера — около 25 МБ.

### Запуск контейнера

```bash
docker run -d -p 8080:80 --name financial-app financial-tracker
```

Приложение откроется на `http://localhost:8080` с поддержкой SPA-роутинга, gzip-сжатием и кэшированием статических ассетов.
