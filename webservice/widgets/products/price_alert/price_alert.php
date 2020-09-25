<?php

/* TODO: Add namespaces */
class widget_price_alert extends \rG_Widget
{
    public $_name = 'price_alert';
    protected $_params;

    /**
     * @var m_data_source $dataSourceModel
     */

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
        $this->_params = $params;
    }

    public function init()
    {
        parent::init();
        $m_price_alert = new \m_price_alert();
        $product_alert = $m_price_alert->getCustomerProductPriceAlert($this->_params['product_id']);
        $this->assign('product_alerts',$product_alert);
        $this->assign('params',$this->_params);
    }
}

