<?php

/**
 * Контроллер AdminArticleController
 * Управление статьями в админпанели
 */
class AdminArticleController extends AdminBase
{

	/**
	 * Action для страницы "Управление статьями"
	 */
	public function actionIndex()
	{
		// Проверка доступа
		self::checkAdmin();

		// Получаем список статей
		$articlesList = Article::getArticlesList();

		// Подключаем вид
		require_once(ROOT . '/views/admin_article/index.php');
		return true;
	}

	/**
	 * Action для страницы "Добавить статью"
	 */
	public function actionCreate()
	{
		// Проверка доступа
		$userInfo = self::checkAdmin();

		

		// Получаем список категорий для выпадающего списка
		$categoriesList = Category::getCategoriesListAdmin();

		// Обработка формы
		if (isset($_POST['submit'])) {

			// Если форма отправлена
			// Получаем данные из формы
			$options['title'] = $_POST['title'];
			$options['author'] = $userInfo['user']['name'];
			$options['post_date'] = R::isoDateTime();
			$options['content'] = $_POST['content'];
			$options['category_id'] = $_POST['category_id'];
			$options['description'] = $_POST['description'];
			$options['status'] = $_POST['status'];
			$options['level'] = $_POST['level'];
			$options['tags'] = $_POST['tags'];

			// Флаг ошибок в форме
			$errors = false;

			// При необходимости можно валидировать значения нужным образом
			if (!isset($options['title']) || empty($options['title'])) {
				$errors[] = 'Заполните поле "Название"';
			}

			if (!isset($options['level']) || empty($options['level'])) {
				$errors[] = 'Заполните поле "Уровень доступа"';
			}

			if ($options['level'] > $userInfo['accessLevel'] || $options['level'] < 1) {
				$errors[] = 'Уровень доступа выходит за допустимые пределы(1 до '.$userInfo['accessLevel'];
			}

			if (!isset($options['status']) || empty($options['status'])) {
				$errors[] = 'Заполните поле "Статус"';
			}

			if ($errors == false) {
				// Если ошибок нет
				// Добавляем новую статью
				$id = Article::createArticle($options);

				// Если запись добавлена
				if ($id) {
					// Проверим, загружалось ли через форму изображение
					if (is_uploaded_file($_FILES["image"]["tmp_name"])) {
						// Если загружалось, переместим его в нужную папке, дадим новое имя
						move_uploaded_file($_FILES["image"]["tmp_name"], $_SERVER['DOCUMENT_ROOT'] . "/upload/images/articles/{$id}.jpg");
					}
				};

				// Перенаправляем пользователя на страницу управлениями статьями
				header("Location: /admin/article");
			}
		}

		// Подключаем вид
		require_once(ROOT . '/views/admin_article/create.php');
		return true;
	}

	/**
	 * Action для страницы "Редактировать статью"
	 */
	public function actionUpdate($id)
	{
		// Проверка доступа
		$userInfo = self::checkAdmin();

		// Получаем список категорий для выпадающего списка
		$categoriesList = Category::getCategoriesListAdmin();

		// Получаем данные о конкретной статье
		$article = Article::getArticleById($id);

		// Обработка формы
		if (isset($_POST['submit'])) {
			// Если форма отправлена
			// Получаем данные из формы редактирования. При необходимости можно валидировать значения
			$options['title'] = $_POST['title'];
			$options['author'] = $userInfo['user']['name'];
			$options['post_date'] = R::isoDateTime();
			$options['content'] = $_POST['content'];
			$options['category_id'] = $_POST['category_id'];
			$options['description'] = $_POST['description'];
			$options['status'] = $_POST['status'];
			$options['level'] = $_POST['level'];
			$options['tags'] = $_POST['tags'];

			// Флаг ошибок в форме
			$errors = false;

			if (!isset($options['title']) || empty($options['title'])) {
				$errors[] = 'Заполните поле "Название"';
			}

			if (!isset($options['level']) || empty($options['level'])) {
				$errors[] = 'Заполните поле "Уровень доступа"';
			}

			if ($options['level'] > $accessLevel || $options['level'] < 1) {
				$errors[] = 'Уровень доступа выходит за допустимые пределы(1 до '.$accessLevel;
			}

			if (!isset($options['status']) || empty($options['status'])) {
				$errors[] = 'Заполните поле "Статус"';
			}

			if ($errors == false) {
				// Если ошибок нет
				// Сохраняем изменения
				if (Article::updateArticleById($id, $options)) {

					// Если запись сохранена
					// Проверим, загружалось ли через форму изображение
					if (is_uploaded_file($_FILES["image"]["tmp_name"])) {

						// Если загружалось, переместим его в нужную папке, дадим новое имя
					   move_uploaded_file($_FILES["image"]["tmp_name"], $_SERVER['DOCUMENT_ROOT'] . "/upload/images/articles/{$id}.jpg");
					}
				}
			}
			// Перенаправляем пользователя на страницу управлениями статьями
			header("Location: /admin/article");
		}

		// Подключаем вид
		require_once(ROOT . '/views/admin_article/update.php');
		return true;
	}

	/**
	 * Action для страницы "Удалить статью"
	 */
	public function actionDelete($id)
	{
		// Проверка доступа
		self::checkAdmin();

		// Обработка формы
		if (isset($_POST['submit'])) {
			// Если форма отправлена
			// Удаляем статью
			Article::deleteArticleById($id);

			// Перенаправляем пользователя на страницу управлениями статьями
			header("Location: /admin/articles");
		}

		// Подключаем вид
		require_once(ROOT . '/views/admin_article/delete.php');
		return true;
	}

}
