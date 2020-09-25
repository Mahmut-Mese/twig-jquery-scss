<?php

/* TODO: Add namespaces */

class widget_agreement2 extends \rG_Widget
{
    public $_name = 'checkout_agreement1';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {
        parent::init();

        (new \rG_Controller)->requireLogin(true, false, true);

        $m_basket = new \m_basket;
        $basket = $m_basket->get();
        $cashOnDeliveryFee = $m_basket->getCashOnDeliveryFee();
        $this->assign('cash_on_delivery_fee', $cashOnDeliveryFee);

        $this->assign('basket', $basket);
        $this->assign('shipping_address', $basket['extension_attributes']['shipping_assignments'][0]['shipping']['address']);
        $this->assign('today', date('d/m/Y'));
    }
}

