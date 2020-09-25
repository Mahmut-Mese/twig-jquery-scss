<?php

class widget_stock_alert_list extends \rG_Widget
{
    public $_name = 'stock_alert_list';

    /** @var m_static_page $staticPageModel */
    public $modelStocksAlert;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->modelStocksAlert = new \m_stock_alert();
    }

    public function init()
    {

        $products = $this->modelStocksAlert->getStocksAlert();

        $this->assign('products', $products['products'] ?? []);

    }


}
