<?php

/* TODO: Add namespaces */

class widget_payment extends \rG_Widget
{
    public $_name = 'checkout_payment';

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

        $m_customer = new \m_customer();
        $isLogged = $m_customer::isLoggedIn();

        if (empty($basket['items'])) {
            \utils::redirect_with_code('/basket', 302);
        }

        $savedCardTokens = $m_basket->getSavedCard();
        $payment_methods = $m_basket->getPaymentMethods();

        $totals = $basket['total_segments'];

        $grand_total = $totals['grand_total']['value'];

        if (!empty($payment_methods['require_login'])) {
            (new \rG_Controller)->requireLogin(false, true);
        }

        $m_address = new \m_address();
        $isClickCollect = $m_address->getBasketShippingMethod($basket['id']);

        if($isClickCollect['data']['shipping_method'] == 'ClickCollect_ClickCollect'){
            unset($payment_methods['cashondelivery']);
            $m_address->saveClickCollectHistory([
                'quote_id' => $basket['id'],
                'customer_email' => $m_customer->get('email') ?? '',
                'issue' => 'payment',
                'channel' => $m_customer->getDevice(),
                'comment' => 'payment',
            ]);
        }

        $this->assign('basket', $basket);
        $this->assign('payment_methods', $payment_methods);
        $this->assign('saved_card_tokens', $savedCardTokens);
        $this->assign('total', $grand_total);
        $this->assign('isLogged', $isLogged);

        if(isset($_GET['3DReturn'])) {
            $this->assign('alert', translate('3D İşleminiz gerçekleştirilemedi.'));
        }

        // set default payment method
        $m_basket->setPaymentMethod('payu');
    }
}

