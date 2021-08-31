<?php

# Список директорий для подключения
$dirs = array
	(
		ROOT.'/components/',
		ROOT.'/models/',
		ROOT.'/controllers/',
	);

# Цикл перебора директорий
foreach ($dirs as $dir) 
{
	# Сканируем файлы в текущей директории
	$files = array_diff( scandir($dir), array(".", "..") );

	# Цикл перебора файлов в директории
	foreach ($files as $file) {

		# Разделяем название файла на массив, посредством разделителя "точки"
		$fileArr = explode('.', $file);

		# Проверяем php ли этот файл
		if (array_pop($fileArr) == 'php') {

			# Подключаем файл
			require_once $dir.$file;

		}		
	}
}