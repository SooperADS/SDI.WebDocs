<?php

/**
 * Контроллер CatalogController
 * Каталог статей
 */
class CatalogController
{

    /**
     * Action для страницы "Каталог статей"
     */
    public function actionIndex()
    {
        // Список категорий для левого меню
        $categories = Category::getCategoriesList();


        
        // ААААААААААААААААААААААААААААААААААААААААААААААААААААААА НУ ЁБАНЫЙ ХУЮ ТЫ ЁБАНЫЙ СОРТИРОВЩИКК АРОРТГШОВАТР
        // НЕ ПЫТАЙТЕСЬ ИСПРАВИТЬ ЭТОТ КОД!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // for ($i=0; $i < count($categories); $i++) { 
        //     if ($categories[$i]['parent'] != -1) {
                
        //         $key = array_search($categories[$i]['parent'], array_column($categories, 'id'));# Ключ, после которого элемента вставлять подменю
        //         $key++;
        //         $categories[$i]['name'] = '-'.$categories[$i]['name'];
        //         $categories[$i]['parent'] = '-1';

        //         print_r($categories);
        //         echo "<hr>";
        //         //$temp = array_shift($categories[$i]); # Вырезаем значение
        //         $temp = array($categories[$i]);
        //         unset($categories[$i]);
        //         array_splice($categories, $key, 0, $temp);# Вставляет элемент после $key-го элемента, удалив с этой позиции 0 элементов
        //         print_r($categories);
        //         echo "<hr>";
        //         //print_r($categories);
        //         //die();
        //     }
        // }
        // var_dump($categories);
        //ОПАСНО!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        // Список последних статей
        $latestArticles = Article::getLatestArticles(12);

        // Подключаем вид
        require_once(ROOT . '/views/catalog/index.php');
        return true;
    }

    /**
     * Action для страницы "Категория статей"
     */
    public function actionCategory($categoryId, $page = 1)
    {
        // Список категорий для левого меню
        $categories = Category::getCategoriesList();

        // Список статей в категории
        $categoryArticles = Article::getArticlesListByCategory($categoryId, $page);

        // Общее количетсво статей (необходимо для постраничной навигации)
        $total = Article::getTotalArticlesInCategory($categoryId);

        // Создаем объект Pagination - постраничная навигация
        $pagination = new Pagination($total, $page, Article::SHOW_BY_DEFAULT, 'page-');

        // Подключаем вид
        require_once(ROOT . '/views/catalog/category.php');
        return true;
    }

}
