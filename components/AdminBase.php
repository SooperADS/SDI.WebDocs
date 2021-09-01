<?php

/**
 * Абстрактный класс AdminBase содержит общую логику для контроллеров, которые 
 * используются в панели администратора
 */
abstract class AdminBase
{

    /**
     * Метод, который проверяет пользователя на то, является ли он администратором
     * @return array <p>{ 'user' => $user, 'accessLevel' => $accessLevel }</p>
     */
    public static function checkAdmin()
    {
        // Проверяем авторизирован ли пользователь. Если нет, он будет переадресован
        $userId = User::checkLogged();

        // Получаем информацию о текущем пользователе
        $user = User::getUserById($userId);
        $accessLevel = User::getUserAccessLevel($user['role']);

        // Если роль текущего пользователя "admin", пускаем его в админпанель
        if ($accessLevel) {
            return array('user' => $user, 'accessLevel' => $accessLevel);
        }

        // Иначе завершаем работу с сообщением об закрытом доступе
        die('Access denied');
    }

}
