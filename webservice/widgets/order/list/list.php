<?php

class widget_list extends \rG_Widget
{
    public $_name = 'list';

    /**
     * @var m_product $productModel
     */
    private $productModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->productModel = new \m_product();
    }

    public function init()
    {
        parent::init();

        $m_order_status = new \m_order_status();
        $m_order = new \m_order();
        $page = rG_GPC::get('page') ?: 1;
        $limitPerPage = 10;
        $result = $m_order->getOrdersWithPagination($limitPerPage, $page);
        $orders = $result["result"];

        foreach ($orders as $key => $row){
            $order = $m_order->getOrder($row['entity_id']);
            if(! empty($order['products'])){
                $order_detail[$row['entity_id']] = $order['products'];
            }
            if(! empty($row['shipping_address_id'])){
                $orders[$key]['shipping_address_info'] = $m_order->getOrderAddress($row['shipping_address_id']);
            }
            if(! empty($order['ekol_order_updates'])){
                $orders[$key]['ekol_order_updates'] = $order['ekol_order_updates'];
            }
        }

        $req_url = rG_GPC::get('request_url') ?: $_SERVER['REQUEST_URI'];
        $originalRequestUrl = explode('?', $req_url)[0];
        $this->assign('current_page', $result["page"]);
        $this->assign('limit', $limitPerPage);
        $this->assign('total_count', $result["total"]);
        $this->assign('activeFilters', "");
        $this->assign('original_request_url', $originalRequestUrl);

        $this->assign('order_detail',$order_detail ?? []);

        $status_list = \db::select('sales_order_status_state', ['key_to_value' => ['@status' => 'frontend_label'], 'use_cache' => true, 'cache_duration' => 3600]);
        $is_cancelable = $m_order->getIsCancelable();

        $this->assign('status_list', $status_list);
        $this->assign('icon_status_list', $m_order_status->getOrderStatusIcon());

        $this->assign('orders', $orders ?? []);
        $this->assign('is_cancelable', $is_cancelable ?? []);
    }
}

