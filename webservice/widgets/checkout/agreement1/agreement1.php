<?php

/* TODO: Add namespaces */

class widget_agreement1 extends \rG_Widget
{
    public $_name = 'checkout_agreement2';

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
        $basketShippingAddress = $m_basket->getBasketShippingAddress();
        $basketBillingAddress = $m_basket->getBasketBillingAddress();
        $this->assign('cash_on_delivery_fee', $cashOnDeliveryFee);
        $this->assign('basket', $basket);
        $this->assign('shipping_address', $basketShippingAddress);
        $this->assign('billing_address', $basketBillingAddress);
        //$this->assign('shipping_address', $basket['extension_attributes']['shipping_assignments'][0]['shipping']['address']);
        $this->assign('today', date('d/m/Y'));
    }
}

