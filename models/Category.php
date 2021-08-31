<?php

/**
 * Класс Category - модель для работы с категориями товаров
 */
class Category
{

    /**
     * Возвращает массив категорий для списка на сайте
     * @return array <p>Массив с категориями</p>
     */
    public static function getCategoriesList()
    {
        // Соединение с БД
        $db = Db::getConnection();

        $categoryList = R::getAll('SELECT id, name FROM category WHERE status = "1" ORDER BY sort_order, name ASC');

        return $categoryList;
    }

    /**
     * Возвращает массив категорий для списка в админпанели <br/>
     * (при этом в результат попадают и включенные и выключенные категории)
     * @return array <p>Массив категорий</p>
     */
    public static function getCategoriesListAdmin()
    {
        // Соединение с БД
        $db = Db::getConnection();

        $categoryList = R::getAll('SELECT id, name, sort_order, status FROM category ORDER BY sort_order ASC');

        return $categoryList;
    }

    /**
     * Удаляет категорию с заданным id
     * @param integer $id
     * @return boolean <p>Результат выполнения метода</p>
     */
    public static function deleteCategoryById($id)
    {
        // Соединение с БД
        $db = Db::getConnection();

        $musor = R::load('category', $id);
        $result = R::trash($musor);
        return $result;
    }

    /**
     * Редактирование категории с заданным id
     * @param integer $id <p>id категории</p>
     * @param string $name <p>Название</p>
     * @param integer $sortOrder <p>Порядковый номер</p>
     * @param integer $status <p>Статус <i>(включено "1", выключено "0")</i></p>
     * @return boolean <p>Результат выполнения метода</p>
     */
    public static function updateCategoryById($id, $name, $sortOrder, $status)
    {
        // Соединение с БД
        $db = Db::getConnection();

        $category = Category::getCategoryById($id);

        mapAssoc(
            ['name' => $name, 'sort_order' => $sort_order, 'status' => $status],
            function($col_name, $value, $category){$category->$col_name = $value;},
            $category);

        $result = R::store($category);
        return $result;
    }

    /**
     * Возвращает категорию с указанным id
     * @param integer $id <p>id категории</p>
     * @return array <p>Массив с информацией о категории</p>
     */
    public static function getCategoryById($id)
    {
        // Соединение с БД
        $db = Db::getConnection();

        $category = R::load('category', $id);

        return $category;
    }

    /**
     * Возвращает текстое пояснение статуса для категории :<br/>
     * <i>0 - Скрыта, 1 - Отображается</i>
     * @param integer $status <p>Статус</p>
     * @return string <p>Текстовое пояснение</p>
     */
    public static function getStatusText($status)
    {
        switch ($status) {
            case '1':
                return 'Отображается';
                break;
            case '0':
                return 'Скрыта';
                break;
        }
    }

    /**
     * Добавляет новую категорию
     * @param string $name <p>Название</p>
     * @param integer $sortOrder <p>Порядковый номер</p>
     * @param integer $status <p>Статус <i>(включено "1", выключено "0")</i></p>
     * @return boolean <p>Результат добавления записи в таблицу</p>
     */
    public static function createCategory($name, $sortOrder, $status)
    {
        // Соединение с БД
        $db = Db::getConnection();

        // Создание обьекта категории
        $category = R::dispense('category');

        mapAssoc(
            ['name' => $name, 'sort_order' => $sort_order, 'status' => $status], 
            function($col_name, $value, $category){$category->$col_name = $value;}, 
            $category);

        $id = R::store($category);
        return $id;
    }

}
