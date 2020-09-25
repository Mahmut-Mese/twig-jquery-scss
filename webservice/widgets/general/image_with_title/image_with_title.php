<?php

/* TODO: Add namespaces */
class widget_image_with_title extends \rG_Widget
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
        $bannerItems = $m_spotlight->getSpotlights('banner_siz_icin_sec');
        $this->assign('bannerItems',$bannerItems[0] ?? []);

    }
}

