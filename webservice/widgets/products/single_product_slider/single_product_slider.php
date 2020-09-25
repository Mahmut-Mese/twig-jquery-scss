<?php

/* TODO: Add namespaces */
class widget_single_product_slider extends \rG_Widget
{
    public $_name = 'single_product_slider';

    /**
     * @var m_data_source $dataSourceModel
     */
    private $dataSourceModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->dataSourceModel = new \m_data_source();
    }

    public function init()
    {
        parent::init();

        $products = $this->dataSourceModel->getByAlias($this->template_vars['data_source']);
        $m_basket = new \m_basket();
        $free_shipping_limit = $m_basket->getFreeShippingLimit();

        $this->assign('products', $products);
        $this->assign('free_shipping_limit', $free_shipping_limit);
    }
}

