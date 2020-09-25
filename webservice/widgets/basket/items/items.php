<?php

/* TODO: Add namespaces */
class widget_items extends \rG_Widget
{
    public $_name = 'basket_items';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {
        parent::init();

        $m_basket = new \m_basket();
        $basket =  $m_basket->get();

        $config = include DOMAIN_CONFIG_PATH . '/env.php';
        $check_remote_stock = false;
        if (! empty($config['florchestra']['url'])) {
            $check_remote_stock = true;
        }

        if(!empty($basket['items']) && \rG_GPC::get('stockout')) {
            $item_ids = [];
            $items = [];
            foreach ($basket['items'] as $key => $item) {
                $item_ids[] = $item['product_id'];
                $items[] = ['sku' => ltrim($item['sku'], '0'), 'qty' => $item['qty']];
            }

            if ($check_remote_stock) {
                $m_florchestra = new m_florchestra;
                $order = $m_florchestra->splitOrder($basket['id'], $items);
                $stocks = array_column($order['items'] ?? [], null, 'sku');
                foreach ($stocks as &$stock) {
                    if (array_key_exists('available_qty', $stock)) {
                        $stock['qty'] = $stock['available_qty'];
                    }
                }
            } else {
                $stocks = $m_basket->getItemStockById($item_ids);
            }

            foreach ($basket['items'] as $key => $item) {
                $clean_sku = ltrim($item['sku'], '0');
                $actual_stock = isset($stocks[$clean_sku]['qty']) ? (int) $stocks[$clean_sku]['qty'] : 0;

                if((int) $item['qty'] > $actual_stock) {
                    $basket['items'][$key]['not_in_stock'] = 1;
                    $basket['items'][$key]['qty'] = 0;

                    if(isset($item['data']['options']) && is_array($item['data']['options']) && count($item['data']['options']) > 0) {
                        foreach ($item['data']['options'] as $o_key => $option) {
                            if($option['entity_id'] === $item['product_id']){
                                $basket['items'][$key]['data']['options'][$o_key]['is_in_stock'] = 0;
                                $basket['items'][$key]['data']['options'][$o_key]['qty'] = 0;
                            }
                        }
                    }
                }
            }

        }

        if (!empty($basket['items'])) {
            foreach($basket['items'] as $item_key => $basket_items) {
                $productInfo = $basket_items['data'] ?? [];
                $basket['items'][$item_key]['data']['ecommerce_categories'] = implode(' / ', $this->getDataLayerEcomCats($productInfo));
            }
        }

        $this->assign('isAjax', (utils::isAjax() ? 1 : 0));
        $this->assign('basket', $basket);
    }

    private function getDataLayerEcomCats(array $productInfo) {
        if(empty($productInfo))
            return [];

        $ecommerce_categories = [];
        $breadcrumb = [];
        $attributes = $productInfo['attributes'];
        $categories = $productInfo['categories'] ?? [];
        $anti_breadcrumb_array = $this->_config->get('env.webservice')['anti_breadcrumb'] ?? [];

        foreach ($categories as $category) {
            $catPath = explode('/', $category['path']);
            if(in_array($catPath[0], $anti_breadcrumb_array)) continue;
            if(count($breadcrumb) < count($catPath)) $breadcrumb = $catPath;
        }

        foreach ($attributes as $attribute) {
            $attArray = explode('__', $attribute);
            if($attArray[0] != 'category') continue;
            $controlArr = [];

            foreach ($breadcrumb as $item) {
                $controlArr[] = $item;
                if($attArray[1] == implode('_', $controlArr)) {
                    $ecommerce_categories[] = $attArray[2];
                }
            }
        }
        return $ecommerce_categories;
    }
}

