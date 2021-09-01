<?php

/**
 * Класс Db
 * Компонент для работы с базой данных
 */
class Db
{
    public static $is_connected = 0;
    /**
     * Устанавливает соединение с базой данных
     */
    public static function getConnection()
    {
        // Получаем параметры подключения из файла
        $paramsPath = ROOT . '/config/db_params.php';
        $params = include($paramsPath);

        // Устанавливаем соединение
        $dsn = "mysql:host={$params['host']};dbname={$params['dbname']}";

        if (self::$is_connected == 0) {
            $result = R::setup($dsn, $params['user'], $params['password']);
            self::$is_connected = 1;

            //R::fancyDebug( TRUE );
        }     
    }
}
