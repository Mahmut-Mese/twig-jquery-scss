<?php

class widget_customer_address_new extends \rG_Widget
{
    public $_name = 'customer_address_new';
    /**
     * @var $modelAddress
     */
    private $modelAddress;

    /**
     * @var $modelCustomer
     */
    private $modelCustomer;
    private $getId;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->modelCustomer = new \m_customer();
        $this->modelAddress = new \m_address();
    }

    public function init()
    {
        $m_country = new \m_country();
        $countries = $m_country->getCountries();
        $this->assign('countries', $countries?? []);

        $regions = $this->modelAddress->getRegions(['country_id' => 'TR']);
        $this->assign('regions', $regions ?? []);

        $towns = $this->modelAddress->getTowns(0);
        $this->assign('towns', $towns['success'] ? $towns['data'] : []);

        $this->assign('na_post_time', (int)\rG_GPC::get('na_post_time'));
        $this->assign('re_captcha', $this->_config->get('env.webservice.re_captcha'));
    }

}
