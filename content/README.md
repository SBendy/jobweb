# Каталоги контента CapService

Все материалы сайта — в **`content/`**. У каждого раздела своя папка; картинки обычно в подпапке **`assets/`** рядом с `meta.json`.

## Структура

| Каталог | Назначение |
|---------|------------|
| `content/hero/` | Фон первого экрана: `pool.json` (список файлов) + папка **`assets/`** |
| `content/services/<slug>/` | Карточка услуги: `meta.json` + **`assets/`** (например обложка `cover.png`) |
| `content/special-offers/<slug>/` | Акция на главной и страница оффера: `meta.json` + **`assets/`** |
| `content/news/<slug>/` | Новость: `meta.json` + **`assets/`** |
| `content/warranty/` | Блок «Гарантия» на главной: `meta.json` + **`assets/`** |
| `content/promo/` | Всплывающий виджет: `meta.json` + **`assets/`** |

### Услуги (`content/services/<slug>/meta.json`)

- `title`, `description`
- `image` — путь относительно папки услуги, например **`assets/cover.png`**
- `detailPage` — опционально

### Спецпредложения (`content/special-offers/<slug>/meta.json`)

Поля страницы детали: `pageTitle`, `label`, `title`, `body`, `image` (часто **`assets/cover.png`**), кнопки.

Для главной — блок **`homeCard`**: `date`, `title`, `description`, **`image`**, `detailPage`.

### Новости

Как у акций; обложка в **`content/news/<slug>/assets/`**, в `meta` указываете **`assets/имя_файла`**.

### Герой (`content/hero/pool.json`)

```json
{ "files": ["assets/1.jpg", "assets/2.jpg"] }
```

При каждой загрузке главной выбирается случайный файл из списка. Добавьте файлы в **`content/hero/assets/`** и пропишите их в `files`.

### Гарантия (`content/warranty/meta.json`)

```json
{ "image": "assets/cover.png", "alt": "…" }
```

### Попап (`content/promo/meta.json`)

`title`, **`image`** (например **`assets/cover.png`**), `detailPage`, `showDelayMs`, `alt`.

## Внутренние страницы

В `pages/*.html` атрибут **`data-content-root`** указывает на папку в `content/…`.

## Новая сущность

1. Папка + `meta.json` + при необходимости **`assets/`**.
2. Для главной — при необходимости правка `index.html` (`data-catalog`, `data-catalog-slug`).
3. Для отдельной страницы — файл в `pages/` и `detailPage` в `meta`.
