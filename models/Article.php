<?php

/**
 * Класс Articl - модель для работы со статьями
 */
class Article
{

    // Количество отображаемых статей по умолчанию
    const SHOW_BY_DEFAULT = 6;

    /**
     * Возвращает массив последних статей
     * @param type $count [optional] <p>Количество</p>
     * @param type $page [optional] <p>Номер текущей страницы</p>
     * @return array <p>Массив со статьями</p>
     */
    public static function getLatestArticles($count = self::SHOW_BY_DEFAULT)
    {
        // Соединение с БД
        $db = Db::getConnection();

        $sql = 'SELECT id, title, description FROM articles '
        . 'WHERE status = "1" ORDER BY id DESC LIMIT ?';

        $articles = R::getAll($sql, [$count]);

        return $articles;
    }

    /**
     * Возвращает список статей в указанной категории
     * @param type $categoryId <p>id категории</p>
     * @param type $page [optional] <p>Номер страницы</p>
     * @return type <p>Массив со статьями</p>
     */
    public static function getArticlesListByCategory($categoryId, $page = 1)
    {
        // Соединение с БД
        $db = Db::getConnection();

        $limit = Article::SHOW_BY_DEFAULT;
        // Смещение (для запроса)
        $offset = ($page - 1) * self::SHOW_BY_DEFAULT;

        $sql = 'SELECT id, title, description FROM articles '
        . 'WHERE `status` = 1 AND `category_id` = :category_id '
        . 'ORDER BY `id` ASC LIMIT :limit OFFSET :offset';

        $articles = R::getAll($sql, [':category_id' => $categoryId, ':limit' => $limit, ':offset' => $offset]);

        return $articles;
    }

    /**
     * Возвращает статью с указанным id
     * @param integer $id <p>id статьи</p>
     * @return array <p>Массив с информацией о статье</p>
     */
    public static function getArticleById($id)
    {
        // Соединение с БД
        $db = Db::getConnection();

        $article = R::load('articles', $id);
        return $article;
    }

    /**
     * Возвращаем количество статей в указанной категории
     * @param integer $categoryId
     * @return integer
     */
    public static function getTotalArticlesInCategory($categoryId)
    {
        // Соединение с БД
        $db = Db::getConnection();

        $articlesCount = R::count('articles', 'status="1" AND category_id = ?', [$categoryId]);
        return $articlesCount;
    }

    /**
     * Возвращает список статей с указанными индентификторами
     * @param array $idsArray <p>Массив с идентификаторами</p>
     * @return array <p>Массив со списком статей</p>
     */
    public static function getArticlesByIds($idsArray)
    {
        // Соединение с БД
        $db = Db::getConnection();

        $articles = R::loadAll('articles', $idsArray);
        return $articles;
    }

    /**
     * Возвращает список рекомендуемых статей
     * @return array <p>Массив со статьями</p>
     */
    public static function getRecommendedArticles()
    {
        // Соединение с БД
        $db = Db::getConnection();

        $articles = R::getAll('SELECT id, title, description, is_hot FROM articles '
                . 'WHERE status = "1" ORDER BY id DESC');

        return $articles;
    }

    /**
     * Возвращает список статей
     * @return array <p>Массив со статьями</p>
     */
    public static function getArticlesList()
    {
        // Соединение с БД
        $db = Db::getConnection();

        $articles = R::getAll('SELECT * FROM articles ORDER BY id ASC');

        return $articles;
    }

    /**
     * Удаляет статью с указанным id
     * @param integer $id <p>id статьи</p>
     * @return boolean <p>Результат выполнения метода</p>
     */
    public static function deleteArticleById($id)
    {
        // Соединение с БД
        $db = Db::getConnection();

        $musor = R::load('articles', $id);
        $result = R::trash($musor);
        return $result;
    }

    /**
     * Редактирует статью с заданным id
     * @param integer $id <p>id статьи</p>
     * @param array $options <p>Массив с информацей о статье</p>
     * @return boolean <p>Результат выполнения метода</p>
     */
    public static function updateArticleById($id, $options)
    {
        // Соединение с БД
        $db = Db::getConnection();

        // Создаём обьект ухо получив статью по id
        $article = Article::getArticleById($id);

        // Свойства обьекта
        mapAssoc($options, function($option, $value, $article){$article->$option = $value;}, $article);

        // Заливаем обьект
        $result = R::store($article);
        return $result;
    }

    /**
     * Добавляет новую статью
     * @param array $options <p>Массив с информацией о статье</p>
     * @return integer <p>id добавленной в таблицу записи</p>
     */
    public static function createArticle($options)
    {
        // Соединение с БД
        $db = Db::getConnection();
        
        // Создаём обьект ухо
        $article = R::dispense('articles'); 
        
        // Свойства обьекта ЗАМАПИМ :33333333333333
        mapAssoc($options, function($option, $value, $article){$article->$option = $value;}, $article);

        // Заливаем обьект
        $id = R::store($article);
        
        // Возвращаем id вставленной статьи
        return $id;
    }

    /**
     * Возвращает путь к изображению
     * @param integer $id
     * @return string <p>Путь к изображению</p>
     */
    public static function getImage($id)
    {
        // Название изображения-пустышки
        $noImage = 'no-image.jpg';

        // Путь к папке со статьями
        $imgpath = '/upload/images/';
        $path = $imgpath . 'articles/';

        // Путь к изображению товара
        $pathToProductImage = $path . $id . '.jpg';

        if (file_exists($_SERVER['DOCUMENT_ROOT'].$pathToProductImage)) {
            // Если изображение для статьи существует
            // Возвращаем путь изображения товара
            return $pathToProductImage;
        }

        // Возвращаем путь изображения-пустышки
        return $imgpath . $noImage;
    }

}
