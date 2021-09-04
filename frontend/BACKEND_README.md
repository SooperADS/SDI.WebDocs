## Что это такое?

Это записи для **BACKEND** разработчика
Тут важно следующее: Весь дублирующийся frontend вынесен в папку `template`.

Тогда как мне понять какой файл шаблона какому куску кода соотвеисивует?
Очеь просто:
```
<!--#D "block"-->
<div>
	Дублирующийся блок
</div>
```

`<!--#D "файл"-->` озночает что блок кода взят из `./template/`**файл**`.html`. 
Значит подключать его в PhP мы будем так
```
<?php
	...

	// Путь к папке с шаблонами
	$templates_path = "./template"

	// Здесь "header" это файл
	requeue_once $template_path."header".".html"

	...
?>
```

Вот и всё!