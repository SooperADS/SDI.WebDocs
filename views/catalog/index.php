<?php include ROOT . '/views/layouts/header.php'; ?>

<section>
    <div class="container">
        <div class="row">
            <div class="col-sm-3">
                <div class="left-sidebar">
                    <h2>Каталог</h2>
                    <div class="panel-group category-products">
                        <?php foreach ($categories as $categoryItem): ?>
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <h4 class="panel-title">
                                        <a href="/category/<?php echo $categoryItem['id'];?>">
                                            <?php echo $categoryItem['name'];?>
                                        </a>
                                    </h4>
                                </div>
                            </div>
                            <?php if (!empty($categoryItem['children'])):
                                foreach ($categoryItem['children'] as $child):
                                    ?>
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <h4 class="panel-title">
                                            <a href="/category/<?php echo $child['id'];?>">
                                                --<?php echo $child['name'];?>
                                            </a>
                                        </h4>
                                    </div>
                                </div>
                            <?php endforeach;?>
                        <?php endif;?>
                                
                            
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>

            <div class="col-sm-9 padding-right">
                <div class="features_items"><!--features_items-->
                    <h2 class="title text-center">Последние</h2>
                    
                    <?php foreach ($latestArticles as $article): ?>
                        <div class="col-sm-4">
                            <div class="product-image-wrapper">
                                <div class="single-products">
                                    <div class="productinfo text-center">
                                        <img src="<?php echo Article::getImage($article['id']); ?>" alt="" />
                                        <p>
                                            <a href="/article/<?php echo $article['id']; ?>">
                                                <?php echo $article['title']; ?>
                                            </a>
                                        </p>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>         

                </div><!--features_items-->


            </div>
        </div>
    </div>
</section>

<?php include ROOT . '/views/layouts/footer.php'; ?>