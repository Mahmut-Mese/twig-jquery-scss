<?php

/* TODO: Add namespaces */
class widget_most_viewed_products extends \rG_Widget
{
    public $_name = 'most_viewed_products';

    /** @var m_menu $menuModel */
    public $menuModel;
    public $env_most;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
        $this->env_most = $this->_config->get('env.webservice.most_view_products');
    }

    public function init()
    {
        parent::init();
        $m_product = new \m_product();
        $m_customer = new \m_customer();
        $customer_id = $m_customer->get('id');
        $products = $m_product->getMostViewedProducts($customer_id,$this->env_most['limit']);
        $this->assign('products', $products['products'] ?? []);
    }
}

