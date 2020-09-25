<?php

/* TODO: Add namespaces */

class widget_head extends \rG_Widget
{
    public $_name = 'head';
    private $_aggs = [];

    /**
     * @var m_product $productModel
     */
    private $productModel;
    private $filters = [];

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        if(!isset($this->template_vars['meta'])) $this->setDefaultMeta();
        $cnf = $this->_config->get('env.webservice');
        $fb_app_id = $cnf['social.facebook.app_id'] ?? 0;

        \rG_Registry::set('fb_app_id', $fb_app_id);
    }

    public function init()
    {
        parent::init();

        if(isset($this->template_vars['meta']) && !isset($this->template_vars['meta']['default'])) return null;

        $aggs = \rG_Registry::get('aggs') ?: [];
        $type = \rG_Registry::get('page_type') ?: '';

        $query_fields = $this->_config->get('env.webservice.elasticsearch.query_fields');
        switch ($type) {
            case 'category' :
                $value = \rG_GPC::get('category_id') ?: 0;
                break;
            case 'manufacturer' :
                $value = \rG_GPC::get('manufacturer_id') ?: 0;
                break;
            case 'gender' :
                $value = \rG_GPC::get('gender_general') ?: 0;
                break;
            case 'search' :
                $value = \rG_GPC::get('q') ?: '';
                $query_fields['q'] = 'search';
                break;
            default :
                $value = '';
                break;
        }

        $query_fields = array_flip($query_fields);

        $query_string = $_GET;
        if(!empty($type) && !empty($value)) {
            $query_string[$query_fields[$type]] = $value;
        }

        foreach ($aggs as $key => $agg) {
            $selector = 'query';
            if($key === 'category' || ($type === 'manufacturer' && $key === 'manufacturer')) $selector = 'id';
            $this->_aggs[$key] = [];
            foreach ($agg as $item) {
                if(!isset($item[$selector])) continue;
                $this->_aggs[$key][$item[$selector]] = $item;
            }
        }

        if($type != 'product') {
            $this->setHeadMeta($type, $query_string);
        }

    }

    public function setHeadMeta($type, $query_string = [])
    {
        $request_uri = $_SERVER['REQUEST_URI'];
        if(! empty($_GET['page']) && $_GET['page'] == 1){
            $protocol = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http");
            $new_url = $protocol.'://'.$_SERVER['HTTP_HOST'].str_replace(['?page=1','&page=1'],'',$request_uri);
            utils::redirect_with_code($new_url,'200');
        }
        $m_product = new \m_product();
        $cmc_url = $m_product->getFloCmcUrl($request_uri);

        $metas = $this->_config->get('env.webservice.meta_data');
        $titles = $metas['title'][$type] ?? [];
        $h1_s = $metas['h1'][$type] ?? [];
        $descs = $metas['description'][$type] ?? [];

        $title = $metas['title']['index'];
        $desc = $metas['description']['index'];

        $key_rates = $metas['key_rates'];
        $original_fields = $this->_config->get('env.webservice.elasticsearch.query_fields');
        $query_fields = array_flip($original_fields);

        $check = 0;
        //print_r($query_fields);
        foreach ($query_fields as $k => $field) {
            $check += (isset($query_string[$field]) ? $key_rates[$k] : 0);
        }

        $set = 0;
        foreach ($titles as $key => $item) {
            if ($set) continue;
            if ($key <= $check && ($check & $key) == $key) {
                $title = $item;
                $desc = $descs[$key];
                if (!empty($h1_s[$key])) {
                    $h1 = $h1_s[$key];
                }
                $set = 1;
            }
        }

        $defaults = $metas['default'];
        $replacements = is_array($defaults) ? array_merge($query_string, $defaults) : $query_string;

        foreach ($replacements as $key => $query) {
            if (is_array($query)) continue;
            $query_arr = explode(',', $query);
            $key_arr = [];
            $static_key = $original_fields[$key] ?? '';
            foreach ($query_arr as $query_value) {

                $val = '';
                if (isset($this->_aggs[$static_key][$query_value]['name'])) {
                    $val = $this->_aggs[$static_key][$query_value]['name'];
                } else {
                    $val = $this->_agg_attribute($static_key, $query_value, $m_product);
                }

                $key_arr[] = $val;
            }

            $keyWord = implode(', ', $key_arr);

            $title = str_replace("%$key%", "$keyWord ", $title);
            $desc = str_replace("%$key%", "$keyWord ", $desc);
            if (!empty($h1))
                $h1 = str_replace("%$key%", "$keyWord ", $h1);
        }

        $base_url = $this->_config->get('env.webservice.url.web');
        $url = rtrim($base_url, '/');

        $uri_arr = explode('?', $request_uri);
        $base_url_page = $url.$uri_arr[0];
        $url .= $uri_arr[0];

        $checkList = $_GET;

        unset($checkList['min']);
        unset($checkList['max']);
        unset($checkList['sort']);
        unset($checkList['percent_max']);
        unset($checkList['percent_min']);
        unset($checkList['beden']);
        unset($checkList['renk']);
        unset($checkList['kategori']);
        if(count($checkList) > 0 && ($check == "3" || $check == "5")){
            $c_url = "?";
            foreach ($checkList as $k => $q) {
                if (is_array($q) || count(explode(',', $q)) > 1){
                    $base_con_url = true;
                    break;
                }else{
                    $c_url .= $k . '=' . $q."&";
                }
            }
            if(empty($base_con_url)){
                $c_url = rtrim(rtrim($c_url,'&'),'?');
                $url .= $c_url;
            }
        }

        if(! empty($cmc_url['h1'])){
            $head_one = $cmc_url['h1'] ?? null;
        }else if(!empty($h1)){
            $head_one = $h1;
        }

        \rG_Registry::set('head_one', $head_one ?? null);

        $product_pages = \rG_Registry::get('product_pages') ?: '';
        $virtual_categories = $this->_config->get('env.webservice.virtual_categories');
        $parse_url = parse_url($base_url_page);
        $parse_url_exp = explode("/",$parse_url['path']);

        if(! empty($virtual_categories)){
            foreach ($virtual_categories as $row){
                if(in_array($row,$parse_url_exp)){
                    $url =  $base_url_page;
                    $title = str_replace(['En Ucuz','Ucuz'],"",$title);
                    break;
                }
            }
        }
        $canonical_base = $this->_config->get('env.webservice.canonical_base');

        if(! empty($canonical_base)){
            foreach ($canonical_base as $key => $row){
                if(in_array($key,$parse_url_exp)){
                    $url =  $base_url.$row;
                    $title = str_replace(['En Ucuz','Ucuz'],"",$title);
                    break;
                }
            }
        }
        $m_title = $cmc_url['title'] ?? $title;
        $m_description = $cmc_url['description'] ?? $desc;
        if(! empty($checkList['page']) && $checkList['page'] > 1){
            $m_title .=" | Sayfa ".$checkList['page'];
            $m_description .= " | Sayfa ".$checkList['page'];
        }
        $meta = [
            'title' => $m_title,
            'description' => $m_description,
            'canonical' => $cmc_url['canonical'] ?? $url,
            'alternate' => $cmc_url['canonical'] ?? $url,
            'image' => $this->_config->get('env.webservice.url.logo') ?? ($this->_config->get('env.webservice.url.web') . 'pub/assets/instreet/images/logo.png'),
            'prev' => $product_pages['prev'] ?? null,
            'next' => $product_pages['next'] ?? null,
            'robots' => $cmc_url['robots'] ?? null,
        ];
        $this->assign('meta', $meta);
    }

    private function setDefaultMeta() {
        if(\rG_Registry::get('page_type') && \rG_Registry::get('page_type') == 'product') {
            return;
        }

        $url = $this->_config->get('env.webservice.url.web');
        $url = rtrim($url, '/');

        $m_product = new m_product();
        $request_uri =  $_SERVER['REQUEST_URI'];
        $cmc_url = $m_product->getFloCmcUrl($request_uri);

        $metas = $this->_config->get('env.webservice.meta_data');
        $title = $metas['title']['index'];
        $desc = $metas['description']['index'];

        $meta = [
            'title' => $cmc_url['title'] ?? $title,
            'description' => $cmc_url['description'] ?? $desc,
            'canonical' => $cmc_url['canonical'] ?? $url,
            'alternate' =>$cmc_url['canonical'] ?? $url,
            'h1' => $cmc_url['h1'] ?? '',
            'image' => $url . '/pub/assets/instreet/images/logo.png',
            'default' => true,
            'robots' => $cmc_url['robots'] ?? null
        ];

        $this->assign('meta', $meta);
    }
    protected function _agg_attribute($static_key,$query_value,$m_product){
        $val = $query_value;
        $tr  = array('ş', 'Ş', 'ı', 'İ', 'ğ', 'Ğ', 'ü', 'Ü', 'ö', 'Ö', 'Ç', 'ç', ' ', '.', ',', '---', '--');
        $eng = array('s', 'S', 'i', 'I', 'g', 'G', 'u', 'U', 'o', 'O', 'C', 'c', '-', '-', '.', '-', '-');
        if($static_key === 'gender') {
            //attribute table'dan genderı çek 4 den
            $genders = $m_product->getGenderTitleValue();
            $islem_yapildi = false;
            foreach ($genders as $gender) {
                $filter_value = str_replace($tr, $eng, $gender['value']);
                $filter_value = strtolower($filter_value);
                $filter_value = trim($filter_value, '-');

                if($filter_value === $query_value){
                    $val = $gender['value'];
                    $islem_yapildi = true;
                }
            }
            if($islem_yapildi == false){
                $custom_urls = $this->_config->get('env.webservice.custom_urls');
                if(! empty($custom_urls[$query_value]))
                    $val = $custom_urls[$query_value]['title'];
            }
        } elseif ($static_key === 'category') {
            //category 3 den name
            $stmt = $m_product->getCategoryTitleValue($query_value);
            if(!empty($stmt['value']))
                $val = $stmt['value'];
        } elseif ($static_key === 'manufacturer') {
            //attribute table'dan manufacturer'ı çek 4 den
            $stmt = $m_product->getManufacturerTitleValue($query_value);
            if(!empty($stmt['page_title']))
                $val = $stmt['page_title'];
        }
        return $val;

    }
}

