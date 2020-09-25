<?php

/* TODO: Add namespaces */
class widget_coupons extends \rG_Widget
{
    public $_name = 'basket_coupons';

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
        if($m_customer::isLoggedIn()){
            $coupons = $m_customer->getCustomerCouponsWithRule(['customer_email' => $m_customer->get('email')]);
        }else{
            $coupons = null;
        }

        $this->assign('coupons', $coupons);

    }
}

