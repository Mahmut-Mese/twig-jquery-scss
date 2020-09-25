<?php

class widget_static_page extends \rG_Widget
{
    public $_name = 'static_page';

    /** @var m_static_page $staticPageModel */
    public $staticPageModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->staticPageModel = new \m_static_page();
    }

    public function init()
    {
        $url = \rG_GPC::get('url');
        $page_id = \rG_GPC::get('page_id');

        if(! empty($page_id))
        {
            $static_page = $this->staticPageModel->getByUrlOrId($page_id);
        }
        else
        {
            $static_page = $this->staticPageModel->getByUrlOrId($url);
        }

        if(empty($static_page))
        {
            \utils::_404();
        }

        $this->assign('static_page', $static_page);
    }
}
