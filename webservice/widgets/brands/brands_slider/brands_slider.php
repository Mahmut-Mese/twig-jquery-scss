<?php

/* TODO: Add namespaces */
class widget_brands_slider extends \rG_Widget
{
    public $_name = 'brands_slider';

    /**
     * @var m_brand $brandModel
     */
    private $brandModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->brandModel = new \m_brand();
    }

    public function init()
    {
        parent::init();

        $brands = $this->brandModel->getBrands(true, \utils::is_mobile() ? 15 : null);

        $this->assign('brands', $brands);
    }
}

