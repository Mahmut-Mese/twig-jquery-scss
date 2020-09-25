<?php

/* TODO: Add namespaces */

class widget_success extends \rG_Widget
{
    public $_name = 'checkout_success';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {
        parent::init();

        if(!\utils::is_app())
            (new \rG_Controller)->requireLogin(true, false, true);

        $id = \rG_GPC::get('order_id');
        $hash = \rG_GPC::get('hsh');

        if (! $id || ! intval($id) > 0) {
            \utils::redirect_with_code('/', 302);
        }

        $m_order = new \m_order;
        $order = $m_order->get($id);

        if (! $order) {
            \utils::_404();
        }

        if(md5($order['info']['protect_code']) !== $hash) {
            \utils::_404();
        }

        $m_customer = new \m_customer();
        $orderDate = new DateTime($order['info']['created_at']);
        $orderItems = $order['products'];
        $type = 'flo';
        foreach ($orderItems as $orderItem) {
            if($orderItem['supplier'] != '1533'){
                $type = 'others';
                break;
            }
        }

        $m_customer->setCustomerQueue([
            'customer_email'  =>  $order['info']['customer_email'],
            'integration'      => '\Flo\Emarsys\Helper\Data',
            'operation'       => 'contactOrder',
            'json_params'       => json_encode([
                'increment_id' => $order['info']['increment_id'],
            ])
        ]);

        $estimated = $m_customer->getEstimatedShipping($type, $orderDate);
        if($id){
            $order_data = [
                'browser_user_agent' =>  $_SERVER['HTTP_USER_AGENT'],
                'remote_ip' =>  $_SERVER['HTTP_X_ORIGINAL_FORWARDED_FOR'] ?? ($_SERVER['REMOTE_ADDR'] ?? 0)
            ];
            $m_order->setOrderAttribute($order_data,$id);
        }
        /*echo "<pre>";
        print_r($order);*/

        $this->assign('creditcard_saved', $_COOKIE['creditcard_saved'] ?? 0);
        $this->assign('use_saved_card', $_COOKIE['is_use_saved_card'] ?? 0);
        $this->assign('estimated_first', $estimated['firstDate']);
        $this->assign('estimated_last', $estimated['lastDate']);
        $this->assign('order', $order);
    }
}

