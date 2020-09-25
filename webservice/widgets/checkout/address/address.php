<?php

/* TODO: Add namespaces */

class widget_address extends \rG_Widget
{
    public $_name = 'checkout_address';

    /** @var m_menu $menuModel */
    public $menuModel;

    /**
     * @var $modelAddress
     */
    private $modelAddress;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
        $this->modelAddress = new \m_address();
    }

    public function init()
    {
        parent::init();

        (new \rG_Controller)->requireLogin(true, false, true);

        $m_basket = new \m_basket();
        $basket = $m_basket->get(true);

        $config = include DOMAIN_CONFIG_PATH . '/env.php';
        $check_remote_stock = false;
        if (! empty($config['florchestra']['url'])) {
            $check_remote_stock = true;
        }

        $items_stock = [];
        foreach ($basket['items'] as $key => $item) {
            $items_stock[] = ['sku' => ltrim($item['sku'], '0'), 'qty' => $item['qty']];
            if (! $check_remote_stock) {
                $actualStock = $m_basket->getItemStockById($item['product_id']);
                if ((int)$actualStock[ltrim($item['sku'], '0')]['qty'] <= 0) {
                    \utils::redirect_with_code('/basket?stockout=1', 200);
                }
            }
        }

//        if ($check_remote_stock) {
//            $m_florchestra = new m_florchestra;
//            $available = $m_florchestra->checkOrderStatus($basket['id'], $items_stock);
//            if (! $available) {
//                \utils::redirect_with_code('/basket?stockout=1', 200);
//            }
//        }

        $addresses = $this->modelAddress->getAddresses();

        if (!empty($addresses['require_login'])) {
            (new \rG_Controller)->requireLogin(false, true);
        }

        $m_country = new \m_country();
        $countries = $m_country->getCountries();

        $regions = $this->modelAddress->getRegions(['country_id' => 'TR']);

        $towns = $this->modelAddress->getTowns(0);
        $getId = \rG_GPC::get('id');

        $shippingMethodInfo = $this->modelAddress->getShippingMethod('ClickCollect');

        $clickCollectIsActive = 0;
        $clickCollectTitle = '';
        if($shippingMethodInfo['success']){
            foreach ($shippingMethodInfo['data'] as $data) {
                if($data['path'] == 'carriers/ClickCollect/active'){
                    $clickCollectIsActive = $data['value'];
                    if(\m_customer::isGuest()){
                        $clickCollectIsActive = 0;
                    }else{

                        $m_customer = new \m_customer();
                        $customer = $m_customer->getByCustomerId(\rG_GPC::get('customer_id'));
                        $phone = $m_customer->getAttribute('phone', \rG_GPC::get('customer_id'));
                    }
                }
                if($data['path'] == 'carriers/ClickCollect/title'){
                    $clickCollectTitle = $data['value'];
                }
            }
        }



        $guestAddress = '';
        if(empty($customer)){
            $guestAddress = $m_basket->getBasketShippingAddress();
            $guestAddress['telephone_mask'] = substr($guestAddress['telephone'], 1);
            $guestTowns = $this->modelAddress->getTowns($guestAddress['region_id']);
            $telephoneMask = $guestAddress['telephone'];
        }
        $cookie_adress = ['billing_address' => rG_GPC::get('billing_address'),
            'shipping_address' => rG_GPC::get('shipping_address'),
            'checked' => rG_GPC::get('checked'),
            'newShip' => rG_GPC::get('newShip')];
         $this->assign('clickCollectIsActive', $clickCollectIsActive);
        $this->assign('clickCollectTitle', $clickCollectTitle);
        $this->assign('customer', $customer ?? []);
        $this->assign('addresses', $addresses ?? []);
        $this->assign('guestAddress', $guestAddress ?? []);
        $this->assign('guestTowns', $guestTowns['data'] ?? []);
        $this->assign('telephoneMask', $telephoneMask ?? []);
        $this->assign('phone', $phone['value'] ?? '');
        $this->assign('basket', $basket);
        $this->assign('countries', $countries ?? []);
        $this->assign('regions', $regions ?? []);
        $this->assign('towns', $towns['success'] ? $towns['data'] : []);
        $this->assign('getId', $getId ?? 0);
        $this->assign('cookie_adress', $cookie_adress ?? []);
    }
}
