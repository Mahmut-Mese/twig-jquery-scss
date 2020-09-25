<?php

class widget_order_status extends \rG_Widget
{
    public $_name = 'list';

    /**
     * @var m_product $productModel
     */
    private $_params;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
        $this->_params = $params;
    }

    public function init()
    {
        parent::init();

        $status = $this->_params['status'];
        $level = 0;
        if ($status == 'canceled' || $status == 'order_canceled') {
            $level = 1;
        } elseif ($status == 'waiting_cancel' || $status == 'waiting_refund' || $status == 'refunded' || $status == 'closed') {
            $level = 2;//Para iadesi bekleniyor
        } elseif ($status == 'warehouse_notified' || $status == 'processing' || $status == 'fraud' ||
            $status == 'holded' ||
            $status == 'pending' ||
            $status == 'pending_payment'
        ) {
            $level = 3; //Sipariş Alındı
        } elseif ($status == 'allocated' || $status == 'invoiced' ||
            $status == 'packaged' ||
            $status == 'waiting_shipment'
        ) {
            $level = 4; //Hazırlanıyor
        } elseif ($status == 'arrived' ||
            $status == 'moving' ||
            $status == 'shipped' ||
            $status == 'transfer' ||
            $status == 'undelivered') {
            $level = 5;//Kargoya Verildi
        } elseif (
            $status == 'complete' ||
            $status == 'payment_review' ||
            $status == 'delivered' ||
            $status == 'store_arrived' ||
            $status == 'store_collect' ||
            $status == 'store_complete'
        ) {
            $level = 6;// Teslim Edildi
        }
        $status_list = \db::select('sales_order_status_state', ['key_to_value' => ['@status' => 'frontend_label'], 'use_cache' => true, 'cache_duration' => 3600]);

        $this->assign('status_list', $status_list);

        $this->assign('siparis_durumu', $status);
        $this->assign('level', $level);


    }
}

