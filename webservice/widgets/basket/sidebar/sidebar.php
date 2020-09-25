<?php

/* TODO: Add namespaces */
class widget_sidebar extends \rG_Widget
{
    public $_name = 'basket_sidebar';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {
        parent::init();

        $m_basket = new \m_basket();
        $sepet_onayla = isset($this->widgetParams['sepet_onayla']) ? $this->widgetParams['sepet_onayla'] : "" ;
        $cashOnDeliveryFee = $m_basket->getCashOnDeliveryFee();
        $shippingAmount = $m_basket->getShippingAmount();
        $freeShippingLimit = $m_basket->getFreeShippingLimit();

        $basket = $m_basket->get();

        $baseSubtotal = $basket['base_subtotal'] ?? 0;
        $this->assign('is_method_cash_on_delivery', $basket['total_segments']['cash_on_delivery_fee']['value'] ?? null);
        $this->assign('cash_on_delivery_fee', $cashOnDeliveryFee);
        $this->assign('shipping_amount', $shippingAmount);
        $this->assign('free_shipping_limit', $freeShippingLimit);
        $this->assign('base_subtotal', $basket['base_subtotal_with_discount'] ?? $baseSubtotal);

        $this->assign('sepet_onayla', $sepet_onayla);
        $this->assign('basket', $basket);
    }
}

