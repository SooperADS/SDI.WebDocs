# Репозиторий сайта SDI

Ссылка на наш сайт [SDI-WebDocs](https://www.markdownguide.org)!

This Markdown cheat sheet provides a quick overview of all the Markdown syntax elements. It can’t cover every edge case, so if you need more information about any of these elements, refer to the reference guides for [basic syntax](https://www.markdownguide.org/basic-syntax) and [extended syntax](https://www.markdownguide.org/extended-syntax).

### Список задач

- [x] Переписать весь код и проверить его на баги
- [x] Проверка кода: Ошибок не выявлено
- [x] Сделеть родительские элементы И убрать сортировку при выводе для пользователя по sort_order
- [ ] Переделать шаблон интернет магазина в новый шаблон 
- [ ] Реализовать уровни доступа при создании статей

- [ ] ЗАКОНЧИТЬ ВЁРСТКУ

## Переменные enviroment

- `$_SESSION['user']` - Идентификатор авторизированного пользователя
- `ROOT` - Корень директории с сайтом

## SQL

### User table

lorem ipsum.....

### User Roles ([!] КОСТЫЛЬ [!])

10. `Владелец` -> `root`
9. `Разработчик` -> `developer`
8. `Администратор` -> `admin`
7. `Сис.Админ` -> `sys.admin`
7. `Тех.Админ` -> `tech.admin`
6. `Создатель` -> `creator`
5. `Модератор` -> `moderator`
4. `Энигма` -> `enigma`
4. `Феникс` -> `phoenix`
4. `Хелпер` -> `helper`
4. `Делюкс` -> `deluxe`
4. `Креатив` -> `creative`
3. `Премиум` -> `premium`
2. `Вип` -> `vip`
1. `Флай` -> `fly`

### Article table
`
  {
    id - AutoIncrement
    title - Название статьи
    author - Автор статьи
    post_date = R::isoDateTime(); - Время создания поста
    content - Контент статьи
    category_id - Идентификатор категории
    description - Описание статьи
    status - Статус статьи(1 - Отображается, 0 - Не отображается)
    level - Уровень доступа(от 1 до 15)
    tags - Теги для поиска статьи (макс 7 шт)
  }
`


## Basic Syntax

These are the elements outlined in John Gruber’s original design document. All Markdown applications support these elements.

### Heading

# H1
## H2
### H3

### Bold

**bold text**

### Italic

*italicized text*

### Blockquote

> blockquote

### Ordered List

1. First item
2. Second item
3. Third item

### Unordered List

- First item
- Second item
- Third item

### Code

`code`

### Horizontal Rule

---

### Link

[Markdown Guide](https://www.markdownguide.org)

### Image

![alt text](https://www.markdownguide.org/assets/images/tux.png)

## Extended Syntax

These elements extend the basic syntax by adding additional features. Not all Markdown applications support these elements.

### Table

| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text |

### Fenced Code Block

```
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

### Footnote

Here's a sentence with a footnote. [^1]

[^1]: This is the footnote.

### Heading ID

### My Great Heading {#custom-id}

### Definition List

term
: definition

### Strikethrough

~~The world is flat.~~

### Task List

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media
