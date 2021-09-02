<?php include ROOT . '/views/layouts/header_admin.php'; ?>

<section>
    <div class="container">
        <div class="row">

            <br/>

            <div class="breadcrumbs">
                <ol class="breadcrumb">
                    <li><a href="/admin">Админпанель</a></li>
                    <li><a href="/admin/category">Управление категориями</a></li>
                    <li class="active">Редактировать категорию</li>
                </ol>
            </div>


            <h4>Редактировать категорию "<?php echo $category['name']; ?>"</h4>

            <br/>

            <div class="col-lg-4">
                <div class="login-form">
                    <form action="#" method="post">

                        <p>Название</p>
                        <input type="text" name="name" placeholder="" value="<?php echo $category['name']; ?>">

                        <p>Порядковый номер</p>
                        <input type="text" name="sort_order" placeholder="" value="<?php echo $category['sort_order']; ?>">

                        <p>Родительская категория</p>
                        <select name="parent">
                            <?php if (is_array($categoriesList)): ?>
                                <option value="-1">[В корневом разделе]</option>
                                <?php foreach ($categoriesList as $category): ?>
                                    <?php if ($category['id'] != $id): ?>
                                        <option value="<?php echo $category['id']; ?>"
                                            <?php $firstCategoryId = $categoriesList[0]['id'];// id первой категории в массиве
                                            $currentCategoryId = $id - $firstCategoryId;// Если id категорий начинаются не с 0
                                            if ($categoriesList[$currentCategoryId]['parent'] == $category['id']) { //проверка на указанный родительский элемент
                                                echo "selected";
                                            } ?>>
                                            <?php echo $category['name']; ?>
                                        </option>
                                    <?php endif; ?>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </select>
                        
                        <p>Статус</p>
                        <select name="status">
                            <option value="1" <?php if ($category['status'] == 1) echo ' selected="selected"'; ?>>Отображается</option>
                            <option value="0" <?php if ($category['status'] == 0) echo ' selected="selected"'; ?>>Скрыта</option>
                        </select>

                        <br><br>
                        
                        <input type="submit" name="submit" class="btn btn-default" value="Сохранить">
                    </form>
                </div>
            </div>
        </div>
    </div>
</section>

<?php include ROOT . '/views/layouts/footer_admin.php'; ?>

