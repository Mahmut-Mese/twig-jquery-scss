<?php

class widget_price_notification extends \rG_Widget
{
    public $_name = 'list';

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {
        $m_price_alert = new \m_price_alert();
        $aa = $m_price_alert->getStocksAlert();

        
        $this->assign('price_alerts', $aa['products'] ?? []);
        parent::init();
    }
}