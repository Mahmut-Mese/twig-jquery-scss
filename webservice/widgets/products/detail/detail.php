<?php

/* TODO: Add namespaces */
class widget_detail extends \rG_Widget
{

    /**
     * @var m_product $productModel
     */
    private $productModel;

    /**
     * @var m_brand $brandModel
     */
    private $brandModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->productModel = new \m_product();
        $this->brandModel = new \m_brand();
    }

    public function init()
    {
        $this->setOutputCaching(60);

        parent::init();
        $m_basket = new \m_basket();
        $free_shipping_limit = $m_basket->getFreeShippingLimit();

        $productInfo = \rG_Registry::get('productInfo');

        if(!$productInfo) {
            $url = \rG_GPC::get('url');
            $productId = \rG_GPC::get('product_id');

            if(! empty($productId))
            {
                $productInfo = $this->productModel->getById($productId);
                $productInfo = $productInfo['products'][0] ?? [];
            }
            else
            {
                $productInfo = $this->productModel->getByUrl($url);
            }

            if(empty($productInfo))
            {
                \utils::_404();
                return;
            }
        }

        if(empty($productInfo["model_code"])){
            $model_code_att = $this->productModel->getProductModelCode(['attribute_code' => 'model_code','product_id' => $productInfo['id']]);
            $productInfo["model_code"] = $model_code_att['value'] ?? ' ';
        }

        $urlInfo['base'] = $this->_config->get('env.webservice.url.web');
        $urlInfo['current'] = $urlInfo['base'] . '' . $productInfo['url'];

        $brandInfo = [];

        if (! empty($productInfo['manufacturer_id'])) {
            $brandInfo = $this->brandModel->getById($productInfo['manufacturer_id']);
        }

        $breadcrumb = [];
        $finalcrumb = [];
        $categories = $productInfo['categories'] ?? [];
        $attributes = $productInfo['attributes'];
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
                    $finalcrumb[] = [
                        'name' => $attArray[2],
                        'url'  => end($attArray)
                    ];
                }
            }

        }

        $sum_qty = array_sum(array_column($productInfo['options'], 'qty'));
        if((int) $sum_qty == 0) {
            if(!empty(end($finalcrumb)['url'])) {
                utils::redirect_with_code("/".end($finalcrumb)['url'], 301);
            }
        }

        $description_fields = [
            'manufacturer',
            'model_code',
            'model',
            'gender',
            'renk',
            'sku',
            'saya_malzeme',
            'baglama_sekli',
//            'saya_sekli',
//            'season',
        ];

        $attributeLabels = $this->productModel->getAttributeLabels();

        if(count($finalcrumb) > 0  ){
            $satir_sayisi = 30;
            $sub = $this->mobilCrumb($finalcrumb,$satir_sayisi);
            if($sub['karekter_sayisi'] < $satir_sayisi){
                $length = (27 - $sub['karekter_sayisi']);
                $productMobInfo['name'] = mb_substr($productInfo['name'],0,$length)." ...";

            }else{
                $productMobInfo['name'] = "";
            }
            $mob_crumb = $sub['mob_crumb'];

        }else{
            $mob_crumb = $finalcrumb;
            $productMobInfo['name'] =  mb_substr($productInfo['name'],0,30);
            if(strlen($productInfo['name']) > 30){
                $productMobInfo['name'] = $productMobInfo['name'] . " ...";
            }
        }
        $season_options = $this->_config->get('env.webservice.product.active_season');
        $m_customer = new \m_customer();
        $orderDate = new DateTime(date("Y-m-d"));

        $type = 'flo';
        $m_product = new \m_product();
        $prodID = $productInfo['id'] ?? $productId;
        $supplierInfo = $m_product->getProductAttribute('supplier', $prodID);
        if(isset($supplierInfo['value']) && $supplierInfo['value'] != '1533'){
            $type = 'others';
        }
        $product_cargo = $m_customer->getEstimatedShipping($type, $orderDate);

        $isQuickView = \rG_GPC::get('is_quick_view') ?? '0';

        $most_env = $this->_config->get('env.webservice.most_view_products');
        if($m_customer::isLoggedIn() && ! empty($most_env['active'])){
            $most_list = $m_product->getMostViewedProduct($m_customer->get('id'),$productInfo['id']);
            if(! empty($most_list)){
                $m_product->updateMostViewedProducts($most_list['id']);
            }else{
                $m_product->setMostViewedProducts(['customer_id' => $m_customer->get('id'),'product_id' => $productInfo['id'],'sku' => $productInfo['sku']]);
            }
        }

        $badges = [];
        if(!empty($productInfo['dynamic_badges'])){
			$limit = 3;
            $cnt = 0;
            foreach ($productInfo['dynamic_badges'] as $badge) {
                if($badge['show_on_detail'] == 1 && $cnt < $limit){
                    $badges['desktop_image'][] = $badge['desktop_image'];
                    $badges['mobile_image'][]= $badge['mobile_image'];
                }
                $cnt++;
            }
        }

        $this->assign('url_info', $urlInfo);
        $this->assign('attribute_labels', $attributeLabels);
        $this->assign('description_fields', $description_fields);
        $this->assign('brand_info', $brandInfo);
        $this->assign('product', $productInfo);
        $this->assign('breadcrumb', $finalcrumb);
        $this->assign('mob_crumb', $mob_crumb);
        $this->assign('productMob', $productMobInfo);
        $this->assign('free_shipping_limit', $free_shipping_limit);
        $this->assign('season_options', $season_options);
        $this->assign('product_cargo', $product_cargo);
		$this->assign('is_quick_view', $isQuickView);
		$this->assign('badges', $badges);
    }

    /**
     * @param $finalcrumb
     * @param $satir_sayisi
     * @return array
     * mobil gorunum de 30 karekterden sonra ... işareti konulacak
     */
    protected function mobilCrumb($finalcrumb,$satir_sayisi){

        $karekter_sayisi=0;

        foreach ($finalcrumb as $key => $row){
            $karekter_sayisi += strlen($row['name']);

            if($karekter_sayisi < $satir_sayisi){
                $mob_crumb[] = [
                    'name' => $row['name'],
                    'url' => $row['url'],
                ];
            }else{
                $length = $satir_sayisi - ($karekter_sayisi- strlen($row['name']));
                $mob_crumb[] = [
                    'name' => mb_substr($row['name'],0,$length)." ...",
                    'url' => $row['url'],
                ];
                break;
            }
        }
        return [
            'mob_crumb' => $mob_crumb,
            'karekter_sayisi' => $karekter_sayisi
        ];
    }
}

