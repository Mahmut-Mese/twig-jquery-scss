<?php

/* TODO: Add namespaces */
class widget_list extends \rG_Widget
{
    public $_name = 'list';

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
                'image' => '/pub/assets/flo/img/sample/blog.jpg',
                'title' => 'Lorem ipsum dolor sit amet consectetur olor sit amet consectetur adipiscing elit.',
            ],
            [
                'url'   => '#',
                'image' => '/pub/assets/flo/img/sample/blog.jpg',
                'title' => 'Lorem ipsum dolor sit amet consectetur olor sit amet consectetur adipiscing elit.',
            ],
            [
                'url'   => '#',
                'image' => '/pub/assets/flo/img/sample/blog.jpg',
                'title' => 'Lorem ipsum dolor sit amet consectetur olor sit amet consectetur adipiscing elit.',
            ],
        ];
        // @TODO: Bu kısım dinamikleştirilecek

        $this->assign('blog_posts', $data);
    }
}

