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

        $m_country = new \m_country();
        $countries = $m_country->getCountries();
        $this->assign('countries', $countries ?? []);

        $regions = $this->modelAddress->getRegions(['country_id' => 'TR']);
        $this->assign('regions', $regions ?? []);

        $towns = $this->modelAddress->getTowns(0);
        $this->assign('towns', $towns['success'] ? $towns['data'] : []);

        $this->assign('na_post_time', (int)\rG_GPC::get('na_post_time'));
        $this->assign('re_captcha', $this->_config->get('env.webservice.re_captcha'));
    }

}
