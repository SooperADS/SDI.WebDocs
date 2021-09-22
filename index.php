<?php
// <style type="text/css">
//     .adm-art-content
//     {
//         width: 100%;
//         height: 50%;
//     }
// </style>

// FRONT CONTROLLER

// Общие настройки
ini_set('display_errors',1);
error_reporting(E_ALL);

session_start();

function map($items, $func, $OBJ = null)
{
    foreach ($items as $item) {
        $result = $func($item, $OBJ);
        $results[] = $result;
    }

    return $results;
}

function mapAssoc($items, $func, $OBJ = null)
{
    foreach ($items as $item => $value) {
        $result = $func($item, $value, $OBJ);
        $results[] = $result;
    }

    return $results;
}


// Подключение файлов системы
define('ROOT', dirname(__FILE__));
require_once(ROOT.'/components/Autoload.php');

// Вызов Router
$router = new Router();
$router->run();