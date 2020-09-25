<?php

class widget_item extends \rG_Widget
{
    public $_name = 'list';

    /**
     * @var m_product $productModel
     */

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {
        parent::init();
        $m_customer = new \m_customer();

        $orderId = \rG_GPC::get('id');
        $telephone = $m_customer->phoneClear(\rG_GPC::get('telephone'));
        $m_order = new \m_order();
        $order = $m_order->getOrder($orderId);


        $status_list = \db::select('sales_order_status',['key_to_value' => ['@status' => 'label'], 'use_cache' => true, 'cache_duration' => 3600]);

        $orderDate = new DateTime($order['info']['created_at']);
        $orderItems = $order['products'];
        $type = 'flo';
        foreach ($orderItems as $orderItem) {
            if (!empty($orderItem['supplier'])) {
                if ($orderItem['supplier'] != '1533') {
                    $type = 'others';
                    break;
                }
            }
        }

        $estimated = $m_customer->getEstimatedShipping($type, $orderDate);

        $m_card_images = new \m_card_images();
        if (!empty($order['payu_transactions'])) {
            $card_prgram_name = $m_order->getOrderCardName($order['payu_transactions']);
        }
        $is_cancelable = $m_order->getIsCancelable();

        $this->assign('card_images_name', $card_prgram_name ?? null);
        $this->assign('card_images_icon', $m_card_images->getCreditCardIcon());
        $this->assign('status_list', $status_list);
        $this->assign('estimated_first', $estimated['firstDate']);
        $this->assign('estimated_last', $estimated['lastDate']);
        $this->assign("order", $order);
        $this->assign('is_cancelable',$is_cancelable);
        $this->assign('error',$error ?? 0);
    }
}

