<?php

class widget_store extends \rG_Widget
{
    public $_name = 'store';

    /** @var m_static_page $staticPageModel */
    public $storeModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->storeModel = new \m_store();
    }

    public function init()
    {
        $m_country = new \m_country();
        $city = \rG_GPC::get('city');
        $country = \rG_GPC::get('country');

        $page["list"] = $this->storeModel->getStores($city,$country);
        $page["list_city"] = $this->storeModel->getStoreCities($country,false);

        $page["selected_city"] = $city;


        if(isset($country)){
            $page["selected_country"] = $country;
        }
        $page["country_list"] = $this->storeModel->getStoreContries();

        $contries = $m_country->getStoreContry();

        foreach ($page["country_list"] as $key => $row){
            if(isset($contries[$row['country']]))
                $page["country_list"][$key]['text'] = $contries[$row['country']];
        }
        $config = $this->_config->get('env.webservice.store');
        $core_config = $this->storeModel->getCoreConfig('web/store_maps/key');
        $store_env = [
            'key' => $core_config['value'] ?? null,
            'language' => $config['language'] ?? null
        ];

        $this->assign('store', $page);
        $this->assign('store_env', $store_env);
    }

}
