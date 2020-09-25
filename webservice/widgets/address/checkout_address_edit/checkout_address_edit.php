<?php

class widget_checkout_address_edit extends \rG_Widget
{
    public $_name = 'checkout_address_edit';

    /**
     * @var $modelAddress
     */
    private $modelAddress;
    private $getId;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->modelAddress = new \m_address();
    }

    public function init()
    {

        $m_country = new \m_country();
        $this->getId = \rG_GPC::get('id');

        $address = $this->modelAddress->getAddress((int)$this->getId);
        $address = $this->modelAddress->normalizeAddressData($address);
        $this->assign('address', $address ?? []);

        $countries = $m_country->getCountries();
        $this->assign('countries', $countries?? []);

        $regions = $this->modelAddress->getRegions(['country_id' => 'TR']);
        $this->assign('regions', $regions ?? []);

        $towns = $this->modelAddress->getTowns($address['region_id'] ?? 0);
        $this->assign('towns', $towns['success'] ? $towns['data'] : []);

    }
}
