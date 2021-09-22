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

        $categoryList = R::getAll('SELECT id, name, parent FROM category WHERE status = "1"');

        $categoryes = array();
        $resultArray = Category::composeCategoriesList($categoryList);

        $GLOBALS['categoryList'] = $resultArray['result'];
        $categoryes = Category::fetchCategoriesList($resultArray);
        print_r($GLOBALS['categoryList']);
        die();
        return $categoryes;
    }

    public static function fetchCategoriesList($resultArray)
    {
        $resultArray['ote'] = array_values($resultArray['ote']);
        for ($i=0; $i < count($resultArray['ote']); $i++) { 
            for ($j=0; $j < count($resultArray['result']); $j++) { 
                if ($resultArray['ote'][$i]['parent'] == $resultArray['result'][$j]['id']) {
                    $GLOBALS['categoryList'][$j]['children'][] = $resultArray['ote'][$i];
                }
                else{
                    if (!empty($resultArray['result'][$j]['children'])) {
                        Category::fetchCategoriesList(array('ote' => $resultArray['ote'], 'result' => $resultArray['result'][$j]['children']));
                    }
                }
            }
        }
    }

    public static function composeCategoriesList($categoryList)
    {
        $categoryes = array();

        for ($i=0; $i < count($categoryList); $i++) { 
            if ($categoryList[$i]['parent'] == '-1') {
                $categoryes[] = $categoryList[$i];
            }
            else{
                $otherElements[] = $categoryList[$i];
            }
        }

        for ($i=0; $i < count($otherElements); $i++) { 
            $ote[$otherElements[$i]['id']] = $otherElements[$i];// Элементы которые впоследствии будут Ребёнком в Ребёнке 
        }
        for ($i=0; $i < count($categoryes); $i++) { 
            for ($j=0; $j < count($otherElements); $j++) { 
                if ($categoryes[$i]['id'] == $otherElements[$j]['parent']) {
                    $categoryes[$i]['children'][] = $otherElements[$j];
                    unset($ote[$otherElements[$j]['id']]);
                }
            }
        }
        return array('result' => $categoryes, 'ote' => $ote);
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

        $categoryList = R::getAll('SELECT id, name, sort_order, parent, status FROM category ORDER BY sort_order ASC');

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
    public static function updateCategoryById($id, $name, $sortOrder, $parent, $status)
    {
        // Соединение с БД
        $db = Db::getConnection();

        $category = Category::getCategoryById($id);

        mapAssoc(
            ['name' => $name, 'sort_order' => $sortOrder, 'parent' => $parent, 'status' => $status],
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
    public static function createCategory($name, $sortOrder, $parent, $status)
    {
        // Соединение с БД
        $db = Db::getConnection();

        // Создание обьекта категории
        $category = R::dispense('category');

        mapAssoc(
            ['name' => $name, 'sort_order' => $sortOrder, 'parent' => $parent, 'status' => $status], 
            function($col_name, $value, $category){$category->$col_name = $value;}, 
            $category);

        $id = R::store($category);
        return $id;
    }

}
