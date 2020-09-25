<?php

/* TODO: Add namespaces */
class widget_password_edit extends \rG_Widget
{
    public $_name = 'password_edit';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

    }

    public function init()
    {
        parent::init();

        $m_customer = new \m_customer();
        $m_product = new \m_product();
        $customer = $m_customer->get();

        $this->assign("customer",$customer);
        $this->assign("meta",$m_product->getMetaData('customer_password_edit'));

    }
}

