<?php

/* TODO: Add namespaces */

class widget_shipping_methods extends \rG_Widget
{
    public $_name = 'checkout_shipping_methods';

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {
        parent::init();

        (new \rG_Controller)->requireLogin(true, false, true);

        $m_basket = new \m_basket;

        $basket = $m_basket->get();

        if (empty($basket['items'])) {
            \utils::redirect_with_code('/basket', 302);
        }


        $address = $this->input->request('shipping_address');


        $m_address = new \m_address();
        $regions = $m_address->getRegions(['country_id' => 'TR']);

        $towns = $m_address->getTowns($regions[0]['region_id'] ?? 0);

        if (isset($_POST['shipping_address'])) {
            $address = [
                'firstname' => '',
                'lastname' => '',
                'telephone' => '',
                'region' => $address['region'],
                'city' => $address['city'],
                'country_id' => $address['country_id'],
                'postcode' => '',
                'street' => '',
            ];

        } else {
            $address = [
                'firstname' => '',
                'lastname' => '',
                'telephone' => '',
                'region' => $regions[0]['default_name'],
                'city' => $towns['data'][0]['default_name'],
                'country_id' => 'TR',
                'postcode' => '',
                'street' => '',
            ];


        }
        if (empty($address['region'])) {
            return 'Teslimat adresi bulunamadı';
        }


        $shipping_methods = $m_basket->getShippingMethods($address);

        // resimler statik eklendi daha sonradan dinamik yapialacak

        $allowed_shipping_methods = [
            'FloShippingMng' => 1,
            'FloShippingAras' => 0,
            'FloShippingPtt' => 0,
        ];

        // Stokta  Magaza urun varsa PTT kargo secenegi kaldirilacak
        $config = include DOMAIN_CONFIG_PATH . '/env.php';
//        if (!empty($config['florchestra']['url']) && isset($basket['items'])) {
//            $m_florchestra = new \m_florchestra();
//            $items = [];
//            foreach ($basket['items'] as $item) {
//                $items[] = $item['sku'];
//            }
//            $stocks = $m_florchestra->getItemsStock($items);
//            $allowed_shipping_methods = $stocks['shipping_methods'] ?? $allowed_shipping_methods;
//            $allowed_shipping_methods = $stocks['shipping_methods'] ?? $allowed_shipping_methods;
//        }
//        $default_method_code = $this->getDefaultShippingMethod();



        foreach ($shipping_methods as $key => $row) {

            $params = [];
            $params['rows'] = ['value'];
            $params['use_cache'] = true;
            $path = 'carriers/' . $row['method_code'] . '/icon';
            $params['where'] = "path  = '" . $path . "'";
            $params['cache_duration'] = 600;
            $params['database'] = 'slave';

            $image = db::select('core_config_data', $params, true);

            if (!empty($image['value'])) {
                $shipping_methods[$key]['resim'] = '/pub/media/shipping/icon/' . $image['value'];
            } else {
                if ($row['method_code'] == 'Flo_ShippingMng') {
                    $shipping_methods[$key]['resim'] = '/pub/assets/instreet/images/icon-aras.png';
                }
                if ($row['method_code'] == 'Flo_ShippingAras') {
                    $shipping_methods[$key]['resim'] = '/pub/assets/instreet/images/icon-mng.png';
                }
                if ($row['method_code'] == 'Flo_ShippingPtt') {
                    $shipping_methods[$key]['resim'] = '/pub/assets/instreet/images/icon-ptt.png';
                }
            }
            $shipping_methods[$key]['is_default'] = 0;
            if (isset($row['method_code'])) {
                // TODO panelden kargo seçimi geçeci olarak iptal edildi
                /*
                if(!empty($default_method_code)) {
                    if($row['method_code'] == $default_method_code) {
                        $shipping_methods[$key]['is_default'] = 1;
                    }
                }
                */
                if (empty($allowed_shipping_methods[$row['method_code']])) {
                    unset($shipping_methods[$key]);
                }
            }
        }

        $shipping_methods[array_keys($shipping_methods)[0]]['is_default'] = 1;


        if (!empty($config['florchestra']['url']) && isset($basket['items'])) {
            $m_florchestra = new \m_florchestra();

            $orderedMethods = $m_florchestra->getShippingMethods();

            $tmp_methods = [];

            if (!empty($shipping_methods) and !empty($orderedMethods)) {
                foreach ($shipping_methods as $key => $shipping_method) {
                    $shipping_methods[$shipping_method['method_code']] = $shipping_method;
                    unset($shipping_methods[$key]);
                }

                foreach ($orderedMethods as $key => $method) {
                    if (isset($shipping_methods[$key])) {
                        $tmp_methods[$key] = $shipping_methods[$key];
                    }
                }
                $shipping_methods = $tmp_methods;
                unset($tmp_methods);
            }
        }


        $m_customer = new \m_customer();
        $orderDate = new DateTime(date("Y-m-d"));

        $quoteItems = $basket['items'];
        $type = 'flo';
        $m_product = new \m_product();
        foreach ($quoteItems as $quoteItem) {
            $supplierInfo = $m_product->getProductAttribute('supplier', $quoteItem['product_id']);
            if (isset($supplierInfo['value']) && $supplierInfo['value'] != '1533') {
                $type = 'others';
                break;
            }
        }
        //print_r($shipping_methods);
        $estimated = $m_customer->getEstimatedShipping($type, $orderDate);
        $this->assign('product_cargo', $estimated);
        $this->assign('shipping_methods', $shipping_methods);
    }

    /**
     * @return array
     * @throws Exception
     */
    private function getDefaultShippingMethod() {
        $params = [];
        $params['rows'] = ['@value'];
        $params['where'] = "path = 'shipping_estimated_time/default_shipping/shippingDefault'";
        $params['order_by'] = "config_id desc";

        return \db::select('core_config_data', $params, true);
    }
}

