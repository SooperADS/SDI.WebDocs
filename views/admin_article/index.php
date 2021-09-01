<?php include ROOT . '/views/layouts/header_admin.php'; ?>

<section>
    <div class="container">
        <div class="row">

            <br/>

            <div class="breadcrumbs">
                <ol class="breadcrumb">
                    <li><a href="/admin">Админпанель</a></li>
                    <li class="active">Управление статьями</li>
                </ol>
            </div>

            <a href="/admin/article/create" class="btn btn-default back"><i class="fa fa-plus"></i> Добавить статью</a>
            
            <h4>Список статей</h4>

            <br/>

            <table class="table-bordered table-striped table">
                <tr>
                    <th>ID статьи</th>
                    <th>Название статьи</th>
                    <th>Автор</th>
                    <th>Дата создания</th>
                    <th>ID категории</th>
                    <th>Описание</th>
                    <th>Статус</th>
                    <th>Уровень доступа</th>
                    <th>Теги</th>
                    <th></th>
                    <th></th>
                </tr>
                <?php foreach ($articlesList as $article): ?>
                    <tr>
                        <td><?php echo $article['id']; ?></td>
                        <td><?php echo $article['title']; ?></td>
                        <td><?php echo $article['author']; ?></td>
                        <td><?php echo $article['post_date']; ?></td> 
                        <td><?php echo $article['category_id']; ?></td> 
                        <td><?php echo $article['description']; ?></td> 
                        <td><?php echo $article['status']; ?></td> 
                        <td><?php echo $article['level']; ?></td> 
                        <td><?php echo $article['tags']; ?></td> 
                        <td><a href="/admin/article/update/<?php echo $article['id']; ?>" title="Редактировать"><i class="fa fa-pencil-square-o"></i></a></td>
                        <td><a href="/admin/article/delete/<?php echo $article['id']; ?>" title="Удалить"><i class="fa fa-times"></i></a></td>
                    </tr>
                <?php endforeach; ?>
            </table>

        </div>
    </div>
</section>

<?php include ROOT . '/views/layouts/footer_admin.php'; ?>

