# Подключение okeancto.by (hoster.by) → GitHub Pages

Репозиторий: https://github.com/tolkachev14881488-beep/okeansto

## 1. DNS на hoster.by

Личный кабинет → **Домены** → ваш домен → **Редактировать DNS** / **Расширенный DNS-редактор**.

### Корень домена `okeancto.by` (обязательно)

Добавьте **4 записи типа A** (поле «домен» / «имя» — пустое или `@`):

| Тип | Имя | Значение        |
|-----|-----|-----------------|
| A   | @   | 185.199.108.153 |
| A   | @   | 185.199.109.153 |
| A   | @   | 185.199.110.153 |
| A   | @   | 185.199.111.153 |

### Поддомен www (рекомендуется)

| Тип   | Имя | Значение                         |
|-------|-----|----------------------------------|
| CNAME | www | tolkachev14881488-beep.github.io |

Сохраните. Обновление DNS: от 15 минут до 24 часов.

## 2. GitHub

1. https://github.com/tolkachev14881488-beep/okeansto/settings/pages  
2. **Custom domain:** `okeancto.by`  
3. **Save**  
4. Дождаться зелёной проверки DNS  
5. Включить **Enforce HTTPS**

В репозитории должен быть файл **CNAME** с текстом `okeancto.by` (уже в проекте).

## 3. Файлы на GitHub

Залейте в корень репозитория:

- `index.html` (с ссылками на okeancto.by)
- `CNAME`
- `hero-bg.png`, `gallery-body.png`, `gallery-alignment.png`
- `robots.txt`, `sitemap.xml`, `.nojekyll`

## 4. Проверка

- https://okeancto.by/
- https://www.okeancto.by/ (должен открываться или редиректить на основной)
