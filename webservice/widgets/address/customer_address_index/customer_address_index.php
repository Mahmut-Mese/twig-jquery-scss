<?php

class widget_customer_address_index extends \rG_Widget
{
    public $_name = 'customer_address_index';

    /**
     * @var $modelAddress
     */
    private $modelAddress;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->modelAddress = new \m_address();
    }

    /**
     * @return void|null
     */
    public function init()
    {

        $addresses = $this->modelAddress->getAddresses();

        if (!empty($addresses['require_login'])) {
            (new \rG_Controller)->requireLogin(false);
        }

        $this->assign('addresses', $addresses ?? []);

    }

}
