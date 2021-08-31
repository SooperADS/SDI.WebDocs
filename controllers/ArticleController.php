<?php

/**
 * Контроллер ArticleController
 * Статья
 */
class ArticleController
{

    /**
     * Action для страницы просмотра статьи
     * @param integer $articleId <p>id статьи</p>
     */
    public function actionView($articleId)
    {
        // Список категорий для левого меню
        $categories = Category::getCategoriesList();

        // Получаем инфомрацию о статье
        $product = Article::getArticlesById($articleId);

        // Подключаем вид
        require_once(ROOT . '/views/product/view.php');
        return true;
    }

}
