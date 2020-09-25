<?php

/* TODO: Add namespaces */
class widget_autocomplete extends \rG_Widget
{
    public $_name = 'autocomplete';

    /**
     * @var m_data_source $dataSourceModel
     */
    private $dataSourceModel;

    /** @var \m_product $productModel */
    private $productModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->dataSourceModel = new \m_data_source();

        $this->productModel = new \m_product();
    }

    public function init()
    {
        parent::init();

        $filters = $this->input->request('filters') ?: [];

        $q = $this->input->request('autocomplete_query');
        if(empty($q))
        {
            return '';
        }

        $conf = \rG_Config::singleton();
        $query_fields = $conf->get('env.webservice.elasticsearch.query_fields');
        $query_fields = array_flip($query_fields);

        $query_string = '';
        $query_arr = [];
        foreach ($filters as $filter) {
            $keys = explode('__', $filter);
            $type = $keys[0] == 'category' ? 'category_id' : $query_fields[$keys[0]];
            $value = $keys[0] == 'category' ? $keys[1] : end($keys);
            if(!isset($query_arr[$type])) $query_arr[$type] = [];

            $query_arr[$type][] = $value;
        }

        if(count($query_arr) > 0) {
            foreach ($query_arr as $key => $query) {
                $query_string .= '&' . $key . '=' . implode(',', $query);
            }
        }

        $complete_limit = $conf->get('env.webservice.limits.autocomplete_limit') ?? 8;

        $sortFilter = [];
        $sortFilter[] = '_score:desc';
        $sortFilter[] = 'sorting.2:asc';

        $fields = ["id", "name", "manufacturer", "price", "special_price", "url", "thumbnail"];

        $products = $this->productModel->getSearchResults($q, '', $filters, ['limit' => $complete_limit, 'sort' => $sortFilter, 'fields' => $fields]);
        $aggregation_orders = $this->productModel->getAggregationOrders();

        if(empty($products['products']))
        {
            return '';
        }

        $this->assign('query', str_replace(' ', '+', $q));
        $this->assign('products', $products['products'] ?? []);
        $this->assign('aggregations', $products['aggregations'] ?? []);
        $this->assign('aggregation_orders', $aggregation_orders);
        $this->assign('filters', $filters ?? []);
        $this->assign('query_string', $query_string);
        $this->assign('active_filters', $products['active_filters'] ?? []);
        $this->assign('total_count', $products  ['total']['products'] ?? 0);
    }
}

