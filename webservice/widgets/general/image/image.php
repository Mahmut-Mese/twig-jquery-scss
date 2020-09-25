<?php

/* TODO: Add namespaces */
class widget_image extends \rG_Widget
{
    public $_name = 'header';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

    }

    public function init()
    {
        parent::init();
        $m_spotlight = new \m_spotlight();
        $spotlight = $m_spotlight->getSpotlights('banner_big_box');
        if(!empty($spotlight)){
            $this->assign('spotlight',$spotlight[0]);
        }

    }
}

