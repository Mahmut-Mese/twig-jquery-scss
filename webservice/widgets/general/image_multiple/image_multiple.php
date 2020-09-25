<?php

/* TODO: Add namespaces */
class widget_image_multiple extends \rG_Widget
{
    public $_name = 'image_multiple';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

    }

    public function init()
    {
        parent::init();
        // $m_spotlight = new \m_spotlight();
        // $spotlight = $m_spotlight->getSpotlights('banner_big_box');
        // if(!empty($spotlight)){
        //     $this->assign('spotlight',$spotlight[0]);
        // }
        
        // @TODO: Bu kısım dinamikleştirilecek
        $data = [
            [
                'url'   => '#',
                'image' => '/pub/assets/flo/img/sample/banner-3.jpg',
                'title' => 'Lorem ipsum dolor sit amet consectetur olor sit amet consectetur adipiscing elit.',
            ],
            [
                'url'   => '#',
                'image' => '/pub/assets/flo/img/sample/banner-4.jpg',
                'title' => 'Lorem ipsum dolor sit amet consectetur olor sit amet consectetur adipiscing elit.',
            ],
            [
                'url'   => '#',
                'image' => '/pub/assets/flo/img/sample/banner-5.jpg',
                'title' => 'Lorem ipsum dolor sit amet consectetur olor sit amet consectetur adipiscing elit.',
            ],
        ];
        // @TODO: Bu kısım dinamikleştirilecek

        $this->assign('banners', $data);
    }
}

