<?php

return array(
    // Товар:
    'article/([0-9]+)' => 'article/view/$1', // actionView в ArticleController
    // Каталог:
    'catalog' => 'catalog/index', // actionIndex в CatalogController
    // Категория статьи:
    'category/([0-9]+)/page-([0-9]+)' => 'catalog/category/$1/$2', // actionCategory в CatalogController   
    'category/([0-9]+)' => 'catalog/category/$1', // actionCategory в CatalogController
    // Пользователь:
    'user/register' => 'user/register',
    'user/login' => 'user/login',
    'user/logout' => 'user/logout',
    'cabinet/edit' => 'cabinet/edit',
    'cabinet' => 'cabinet/index',
    // Управление статьями:    
    'admin/article/create' => 'adminArticle/create',
    'admin/article/update/([0-9]+)' => 'adminArticle/update/$1',
    'admin/article/delete/([0-9]+)' => 'adminArticle/delete/$1',
    'admin/article' => 'adminArticle/index',
    // Управление категориями:    
    'admin/category/create' => 'adminCategory/create',
    'admin/category/update/([0-9]+)' => 'adminCategory/update/$1',
    'admin/category/delete/([0-9]+)' => 'adminCategory/delete/$1',
    'admin/category' => 'adminCategory/index',
    // Админпанель:
    'admin' => 'admin/index',
    // О нас
    'contacts' => 'site/contact',
    'about' => 'site/about',
    // Главная страница
    'index.php' => 'site/index', // actionIndex в SiteController
    '' => 'site/index', // actionIndex в SiteController
);
