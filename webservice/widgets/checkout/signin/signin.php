<?php

/* TODO: Add namespaces */
class widget_signin extends \rG_Widget
{
    public $_name = 'checkout_signin';

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
        $this->assign("aggrements",$m_customer->getAggrements('register_form'));
    }
}

