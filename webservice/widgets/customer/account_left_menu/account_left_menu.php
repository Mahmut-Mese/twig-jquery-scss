<?php

/* TODO: Add namespaces */
class widget_account_left_menu extends \rG_Widget
{
    public $_name = 'image';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

    }

    public function init()
    {
        parent::init();
        $request_url = $_SERVER['REQUEST_URI'];
        $url = explode("?",$request_url);
        switch ($url[0]){
            case "/customer/orders":
            case  "/customer/order":
                $active_class = "customer_orders";
                break;
            case "/customer/edit":
                $active_class = "customer_edit";
                break;
            case "/ticket/list":
            case "/ticket/detail":
            case "/ticket/new":
            case "/ticket/answer":
                $active_class = "ticket_list";
                break;
            case "/customer/address/index":
                $active_class = "customer_address_index";
                break;
            case "/customer/coupons":
                $active_class = "customer_coupons";
                break;
            case "/customer/subscriptions":
                $active_class = "customer_subscriptions";
				break;
			case '/customer/credit':
				$active_class = 'credit';
				break;
            case '/customer/price-notification':
                $active_class = 'customer_price';
                break;
            default:
                $active_class = "customer_edit";
        }

        $this->assign('active_class',$active_class);
    }
}

