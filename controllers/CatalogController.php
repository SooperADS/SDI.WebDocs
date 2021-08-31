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

        // Список последних статей
        $latestProducts = Article::getLatestArticles(12);

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
        $categoryProducts = Article::getArticlesListByCategory($categoryId, $page);

        // Общее количетсво статей (необходимо для постраничной навигации)
        $total = Article::getTotalArticlesInCategory($categoryId);

        // Создаем объект Pagination - постраничная навигация
        $pagination = new Pagination($total, $page, Article::SHOW_BY_DEFAULT, 'page-');

        // Подключаем вид
        require_once(ROOT . '/views/catalog/category.php');
        return true;
    }

}
