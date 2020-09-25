<?php

/* TODO: Add namespaces */
class widget_product_slider extends \rG_Widget
{
    public $_name = 'product_slider';

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
        $additionalParams = [];
        $limit = $this->_config->get('env.webservice.additional_limit') ?? 0;
        if($limit){
            $additionalParams = ['limit' => 10];
        }
        $products = $this->dataSourceModel->getByAlias($this->template_vars['data_source'],[],$additionalParams);
        $m_basket = new \m_basket();
        $free_shipping_limit = $m_basket->getFreeShippingLimit();

        $this->assign('products', $products);
        $this->assign('free_shipping_limit', $free_shipping_limit);
    }
}

