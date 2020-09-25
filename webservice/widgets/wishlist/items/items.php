<?php

class widget_items extends \rG_Widget
{
    public $_name = 'items';

    /**
     * @var m_product $productModel
     */
    private $productModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->productModel = new \m_product();
    }

    public function init()
    {
        parent::init();

        $m_wishlist = new \m_wishlist();
        $products = $m_wishlist->getProducts();
        $this->assign('products', $products['products'] ?? []);
    }
}

