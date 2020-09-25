<?php

/* TODO: Add namespaces */
class widget_mini_cart extends \rG_Widget
{
    public $_name = 'mini_cart';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {
        parent::init();

        if(! $this->input->request('load'))
        {
            return '';
        }

        $m_basket = new \m_basket();

		$this->assign('basket', $m_basket->get());
    }
}

