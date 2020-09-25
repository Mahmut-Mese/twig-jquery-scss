<?php

/* TODO: Add namespaces */

class widget_list extends rG_Widget
{
    public $_name = 'list';

    /**
     * @var m_product $productModel
     */
    private $productModel;
    private $filters = [];

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->productModel = new m_product();
    }

    public function init()
    {
        parent::init();

        $this->setOutputCaching(300);

        $m_basket = new m_basket();
        $free_shipping_limit = $m_basket->getFreeShippingLimit();
        // TODO: Change these to key -> value array
        $categoryId = rG_GPC::get('category_id') ?: 0;
        $manufacturerId = rG_GPC::get('manufacturer_id') ?: 0;
        $gender_general = rG_GPC::get('gender_general') ?: '';
        $special_price = rG_GPC::get('special_price') ?: '';
        $req_url = rG_GPC::get('request_url') ?: $_SERVER['REQUEST_URI'];

        $minPrice = $this->input->request('min');
        $maxPrice = rG_GPC::get('max');

        $minPercent= $this->input->request('percent_min');
        $maxPercent = rG_GPC::get('percent_max');

        // $gorunum = \rG_GPC::get('gorunum') ?? \rG_GPC::get('filter_view') ?? 1;
        $gorunum = rG_GPC::get('gorunum') ?? 1;

        $originalRequestUrl = explode('?', $req_url)[0];
        $request_url = str_replace('/','', explode('?', $req_url)[0]);
        $custom_urls = $this->_config->get('env.webservice.custom_urls');

        if (isset($custom_urls[$request_url])) {
            $sortingCategoryId = $custom_urls[$request_url]['sorting_id'] ?? 0;
        } elseif (!empty($manufacturerId)) {
            $sortingCategoryId = 1000000 + intval($manufacturerId);
        }

        if ($maxPrice && $minPrice > $maxPrice) {
            $transferPrice = $minPrice;
            $maxPrice = $minPrice;
            $minPrice = $transferPrice;
        }
        if ($maxPercent && $minPercent> $maxPercent) {
            $transferPercent = $minPercent;
            $maxPercent = $minPercent;
            $minPercent = $transferPercent;
        }

        // END TODO

        $this->filters = rG_GPC::m_get('filters');
        $q = rG_GPC::get('q') ?: '';
        $limitPage = $page = rG_GPC::get('page') ?: 1;
        $sort = trim(rG_GPC::get('sort'));
        $limitPerPageConfig = $this->_config->get('env.webservice.products_list.per_page');
        //$itemLimit = $limitPerPage = $this->widgetParams['limit_per_page'] ?? ($limitPerPageConfig ?? 72);
        $itemLimit = $limitPerPage = $limitPerPageConfig ?? 72;
        $pagination = $this->_config->get('env.frontendSettings.category.pagination') ?? false;

        if (!$this->isAjax && $page > 1 && $pagination === false) {
            $limitPerPage *= $page;
            $limitPage = 1;
        }


        $sort_options = $this->_config->get('env.webservice.sorting');
        $season_options = $this->_config->get('env.webservice.product.active_season');

        $sortFilter = [];

        if (empty($sort)) {
            if (!empty($sortingCategoryId)) {
                $sortFilter[] = 'sorting.' . $sortingCategoryId . ':asc';
                $sortFilter[] = 'sorting.2:asc';
            } else if ($categoryId) {
                $sortFilter[] = 'sorting.' . $categoryId . ':asc';
            } elseif (!empty($q)) {
                if(! empty($sort_options[0]['key']))
                {
                    $sortFilter[] = $sort_options[0]['key'];
                }
                else
                {
                    $sortFilter[] = '_score:desc';
                    $sortFilter[] = 'sorting.2:asc';
                }
            } else {
                $sortFilter[] = 'sorting.2:asc';
            }
        } else {
            $sortFilter[] = $sort;
        }

        $queries = $this->getQueries($categoryId);

        $whereClause = '';
        if ($categoryId) {
            $whereClause = 'category_ids:' . $categoryId;
            $this->filters[] = "category__*{$categoryId}*__*";
        }

        if ($manufacturerId) {
            $whereClause = 'manufacturer_id:' . $manufacturerId;
        }

        if (!empty($gender_general)) {
            $whereClause = 'gender_general:' . $gender_general;
        }

        if (!empty($special_price)) {
            $whereClause = 'special_price:>0';
        }

        $limit_array = [
            'min' => $minPrice,
            'max' => $maxPrice
        ];
        $limit_percent_array = [
            'min' => $minPercent,
            'max' => $maxPercent
        ];

        foreach ($this->filters as $key => $filter) {
            if(!is_string($filter)) continue;
            //Ampersant
            $this->filters[$key] = str_replace('&', '%26', $filter);
        }

        // TODO: Change aggregation limit to 0
        $data = $this->productModel->getSearchResults($q, $whereClause, $this->filters,
            [
                'page' => $limitPage,
                'limit' => $limitPerPage,
                'aggregation_limit' => 0,
                'sort' => $sortFilter,
                'queries' => $queries,
                'price' => $limit_array,
                'percent' => $limit_percent_array
            ]);

        if (!empty($q) && isset($data['products']) && is_array($data['products'])
            && count($data['products']) === 1
            && empty($this->filters) && ($page == 1)) {
            $url = $data['products'][0]['url'];
            utils::redirect_with_code($url, 301);
        }

        $aggregation_orders = $this->productModel->getAggregationOrders();

        $selectedMainCategory = [];

        if (!empty($data)) {
            if (isset($data['aggregations']['category'])) {
                foreach ($data['aggregations']['category'] as $category) {
                    if ($category['id'] == $data['selectedCategory']) {
                        $category['class'] = 'open';
                        $category['sub_class'] = '';
                        $selectedMainCategory[] = $category;
                    }
                }

                if ($data['selectedCategory'] && !empty($selectedMainCategory)) {
                    $data['aggregations']['category'] = $selectedMainCategory;
                }
            }

            $data['aggregations']['price'] = [
                'min' => $minPrice,
                'max' => $maxPrice,
                'minlimit' => 5,
                'maxlimit' => 9999
            ];

            $data['aggregations']['price_percent'] = [
                'percent_min' => $minPercent,
                'percent_max' => $maxPercent,
                'minlimit' => 5,
                'maxlimit' => 10
            ];
        }

        if ($categoryId && isset($data['active_filters'])) {
            foreach ($data['active_filters'] as $fKey => $filter) {
                if ($filter['value'] === "category__*{$categoryId}*__*") {
                    unset($data['active_filters'][$fKey]);
                    continue;
                }

                if (empty($q)) {
                    $exp = explode('__', $filter['value']);
                    if (isset($exp[0]) && $exp[0] === 'category') {
                        unset($data['active_filters'][$fKey]);
                    }
                }
            }
        }

        $title_aggs = $data['aggregations'] ?? [];
        if (isset($title_aggs['category']) && isset($data['breadcrumb'])) {
            $title_aggs['category'] = $data['breadcrumb'];
        }
        rG_Registry::set('aggs', $title_aggs);

        if (empty($data['breadcrumb'])) {
            if (isset($custom_urls[$request_url])) {
                $data['breadcrumb'][] = [
                    'name' => $custom_urls[$request_url]['title'],
                    'url' => '#',
                    'query_string' => null,
                    'selected' => 1
                ];
            }
        }

        if (!empty($data['breadcrumb'])) {
            $data['mob_breadcrumb'] = $this->mobilCrumb($data['breadcrumb'], 23);
        } else {
            $data['mob_breadcrumb'] = $data['breadcrumb'] ?? [];
        }
        if (!empty($data['aggregations']['gender']))
            $data['aggregations']['gender'] = $this->categoryGender($data['aggregations']['gender']);

        $footer_desc = $this->getCmsBlockDescription();
        /*$type = rG_Registry::get('page_type') ?: '';
        if (empty($data['active_filters']) && $type != 'category') {
            $footer_desc = $this->footerDesc();
        } else {
            if($type == 'category'){
                $footer_desc = $this->getCmsBlockDescription();
            }else
                $footer_desc = "";
        }*/

        rG_Registry::set('footer_desc', $footer_desc);
        if(! empty($data['total']['products']) && isset($page)){
            $total_count = ceil( $data['total']['products'] / $itemLimit);
            rG_Registry::set('product_pages', $this->getProductPages(['current_page' => $page, 'total_count' => $total_count ]));
        }
        if(! empty($page) && $page > 1 && $page > intval($total_count ?? 0)){
            $new_url = $this->productModel->removePage($req_url);
            \utils::redirect_with_code($new_url,301);
        }

        $filters = [];
        if(!empty($data['filters'])) {
            foreach ($data['filters'] as $filter) {
                $filters[] = str_replace('&', '%26', $filter);
            }
        }

        if(!empty($data['aggregations']['manufacturer'])) {
            foreach($data['aggregations']['manufacturer'] as $key => $item) {
                $data['aggregations']['manufacturer'][$key]['name'] = str_replace('--', '&', $item['name']);
            }
        }

        $checkList = $_GET;
        $countFilter = 0;
        foreach ($checkList as $c => $d) {
            if (!($c == 'min' || $c == 'percent_min')) {
                $countFilter += 1;
            }
        }
        $countComma = implode($checkList);
        $countComma = substr_count($countComma, ',');
        $totalFilter = $countComma + $countFilter + 1;
        rG_Registry::set('filter_count', $totalFilter);

        $this->assign('footer_desc', $footer_desc);
        // TODO: Change this to key -> value array
        $this->assign('category_id', $categoryId);
        $this->assign('manufacturer_id', $manufacturerId);
        $this->assign('special_price', $special_price);
        $this->assign('gender_general', $gender_general);
        // END TODO
        $this->assign('q', $q);
        $this->assign('current_page', $page);
        $this->assign('limit', $itemLimit);
        $this->assign('active_sorting', $sort);
        $this->assign('sorting_filter', $sortFilter);
        $this->assign('sorting_options', $sort_options);
        $this->assign('aggregation_orders', $aggregation_orders);
        $this->assign('products', $data['products'] ?? []);
        $this->assign('aggregations', $data['aggregations'] ?? []);
        $this->assign('breadcrumb', $data['breadcrumb'] ?? []);
        $this->assign('mob_breadcrumb', $data['mob_breadcrumb'] ?? []);
        $this->assign('total_count', $data['total']['products'] ?? 0);
        $this->assign('active_filters', $data['active_filters'] ?? []);
        $this->assign('filters', $filters);
        $this->assign('queries', $queries);
        $this->assign('gorunum', $gorunum);
        $this->assign('free_shipping_limit', $free_shipping_limit);
        $this->assign('season_options', $season_options);
        $this->assign('request_url', $request_url);
        $this->assign('original_request_url', $originalRequestUrl);
        $this->assign('filter_count', rG_Registry::get('filter_count'));

    }
    private function categoryGender($data)
    {
        $category_gender = $this->_config->get('env.webservice.category_gender');
        if (empty($category_gender)) return $data;
        $new_data = array();

        foreach ($category_gender as $row) {
            $findKey = $this->search_revisions($data, $row, 'query');
            if (isset($findKey[0]) && is_array($data[$findKey[0]]))
                $new_data[] = $data[$findKey[0]];
        }
        return $new_data;

    }

    private function search_revisions($dataArray, $search_value, $key_to_search)
    {
        $keys = array();
        foreach ($dataArray as $key => $cur_value) {
            if ($cur_value[$key_to_search] == $search_value) {
                $keys[] = $key;
            }
        }
        return $keys;
    }

    private function getQueries($categoryId)
    {
        $query_fields = $this->_config->get('env.webservice.elasticsearch.query_fields');
        $queries = [];

        if (!empty($q) && $categoryId) {
            $queries['category_id'] = $categoryId;
        }

        if (!empty($query_fields)) {
            if (empty($this->filters)) {
                foreach ($query_fields as $key => $value) {
                    $query = rG_GPC::get($key);
                    if (!empty($query)) {
                        $query_array = explode(',', $query);
                        foreach ($query_array as $item) {
                            $this->filters[] = "{$value}__*__" . $item;
                        }
                        $queries[$key] = $query;
                    }
                }
            } else {
                $query_fields = array_flip($query_fields);
                foreach ($this->filters as $item) {
                    $filter_array = explode('__', $item);
                    $query_key = $query_fields[$filter_array[0]] ?? '';
                    if (!isset($queries[$query_key])) $queries[$query_key] = [];
                    $queries[$query_key][] = end($filter_array);
                }

                $queries = array_map(function ($x) {
                    if (is_array($x)) $x = implode(',', $x);
                    return $x;
                }, $queries);
            }
        }

        return $queries;
    }

    protected function mobilCrumb($finalcrumb, $satir_sayisi)
    {

        $karekter_sayisi = 0;

        foreach ($finalcrumb as $key => $row) {
            $karekter_sayisi += strlen($row['name']);

            if ($karekter_sayisi < $satir_sayisi) {
                $mob_crumb[] = [
                    'name' => $row['name'],
                    'url' => $row['url'],
                ];
            } else {
                $length = $satir_sayisi - ($karekter_sayisi - strlen($row['name']));
                $mob_crumb[] = [
                    'name' => mb_substr($row['name'], 0, $length) . " ...",
                    'url' => $row['url'],
                ];
                break;
            }
        }
        return $mob_crumb;
    }

    protected function footerDesc()
    {
        $m_product = new m_product();
        $type = rG_Registry::get('page_type') ?: '';
        $description = "";
        switch ($type) {
            case 'category' :
                $value = rG_GPC::get('category_id') ?: 0;
                $stmt = $m_product->getCategoryTextValue($value);
                if (!empty($stmt['value']))
                    $description = $stmt['value'];
                break;
            case 'manufacturer' :
                $value = rG_GPC::get('manufacturer_id') ?: 0;
                $stmt = $m_product->getManufacturerTitleValue($value);
                if (!empty($stmt['short_description']))
                    $description = $stmt['short_description'];
                break;
        }
        return $description;
    }

    private function getCmsBlockDescription()
    {
        $uri = ltrim($_SERVER['REQUEST_URI'], "/");
        $arrFrom = array("&", ",", "=", "?", "-", "/");
        $identifier = str_replace($arrFrom, "_", $uri);
        $description = rG_Cache::get('cmsblock_' . $identifier);

        if (!$description) {
            $m_product = new m_product();
            $stmt = $m_product->getCategoryCmsBlockTextValue($identifier);
            $description = "";
            if (!empty($stmt['content'])) {
                $description = $stmt['content'];
            }

            rG_Cache::set('cmsblock_' . $identifier, $description);
        }

        return $description;
    }

    private function getProductPages($page_arr){
        $url = $_SERVER['REQUEST_URI'];
        $uri_arr = explode("?",$url);
        $get = $_GET;
        if($page_arr['current_page'] == 1 && $page_arr['total_count'] > 1){
            $donus = [
                'prev' => null,
                'next' => 2
            ];
        }elseif($page_arr['current_page'] == $page_arr['total_count']){
            $donus = [
                'prev' => $page_arr['current_page'] - 1,
                'next' => null
            ];
        }elseif ($page_arr['current_page'] > $page_arr['total_count']){
            $donus = [
                'prev' => null,
                'next' => null
            ];
        }else{
            $donus = [
                'prev' => $page_arr['current_page'] - 1,
                'next' => $page_arr['current_page'] + 1
            ];
        }
        $actual_link = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://".$_SERVER['HTTP_HOST'].$uri_arr[0];

        if(! empty($donus['prev'])){
            $get['page'] =  $donus['prev'];
            $bb['prev'] = $this->getPage($get,$actual_link);

        }
        if(! empty($donus['next'])){
            $get['page'] =  $donus['next'];
            $bb['next'] = $this->getPage($get,$actual_link);
        }
        return $bb ?? [];
    }
    private function getPage($get,$actual_link){
        $imp = "";
        foreach ($get as $key => $value) {
            if (is_array($value)) { // fixme
                continue;
            }
            $imp .= $key."=".$value."&";
        }
        $imp = rtrim($imp,"&");
        return $actual_link."?".$imp;
    }
}

