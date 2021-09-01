<?php include ROOT . '/views/layouts/header_admin.php'; ?>

<section>
    <div class="container">
        <div class="row">

            <br/>

            <div class="breadcrumbs">
                <ol class="breadcrumb">
                    <li><a href="/admin">Админпанель</a></li>
                    <li><a href="/admin/article">Управление статьями</a></li>
                    <li class="active">Редактировать статью</li>
                </ol>
            </div>

            <h4>Редактировать статью #<?php echo $id; ?></h4>

            <br/>
     
            <div class="login-form">
                <form action="#" method="post" enctype="multipart/form-data">
                    <div class="col-lg-4">

                        <p>Название статьи</p>
                        <input type="text" name="title" placeholder="" value="<?php echo $article['title']; ?>">

                        <p>Уровень доступа</p>
                        <select name="level">
                            <?php for ($i=1; $i <= $userInfo['accessLevel']; $i++): ?>
                                <option value="<?php echo $i; ?>" 
                                    <?php if ($userInfo['accessLevel'] == $i) echo ' selected="selected"'; ?>>
                                    <?php echo $i; ?>
                                </option>
                            <?php endfor; ?>
                        </select>

                        <p>Категория</p>
                        <select name="category_id">
                            <?php if (is_array($categoriesList)): ?>
                                <?php foreach ($categoriesList as $category): ?>
                                    <option value="<?php echo $category['id']; ?>" 
                                        <?php if ($article['category_id'] == $category['id']) echo ' selected="selected"'; ?>>
                                        <?php echo $category['name']; ?>
                                    </option>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </select>
                        
                        <br/><br/>

                        <p>Теги(через запятую)</p>
                        <input type="text" name="tags" placeholder="" value="<?php echo $article['tags']; ?>">

                        <p>Изображение статьи</p>
                        <img src="<?php echo Article::getImage($article['id']); ?>" width="200" alt="" />
                        <input type="file" name="image" placeholder="" value="<?php echo $article['image']; ?>">

                        <p>Краткое описание</p>
                        <textarea name="description"><?php echo $article['description']; ?></textarea>
                        
                        <br/><br/>

                        <p>Статус</p>
                        <select name="status">
                            <option value="1" <?php if ($article['status'] == 1) echo ' selected="selected"'; ?>>Отображается</option>
                            <option value="0" <?php if ($article['status'] == 0) echo ' selected="selected"'; ?>>Скрыта</option>
                        </select>
                        
                        <br/><br/>
                        
                        <input type="submit" name="submit" class="btn btn-default" value="Сохранить">
                        
                        <br/><br/>
                    </div>
                    <div class="col-lg-8">
                        <p>Контент</p>
                        <textarea name="content" class="adm-art-content"></textarea>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<?php include ROOT . '/views/layouts/footer_admin.php'; ?>

