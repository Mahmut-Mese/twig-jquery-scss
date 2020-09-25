<?php

class widget_order_confirm extends \rG_Widget
{
    public $_name = 'list';

    /**
     * @var m_product $productModel
     */

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {
        parent::init();
        $this->assign('order_confirm','');

    }
}

