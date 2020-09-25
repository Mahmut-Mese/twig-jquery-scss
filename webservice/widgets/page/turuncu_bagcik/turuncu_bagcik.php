<?php

class widget_turuncu_bagcik extends \rG_Widget
{
    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

    }

    public function init()
    {
        $m_static_page = new \m_static_page();
        $list = $m_static_page->getOrangeLacing(1);
        $list = [
            'sent_money' =>number_format($list['sent_money'],0,'.','.'),
            'incoming_money' =>number_format($list['incoming_money'],0,'.','.'),
            'number_of_schools' =>number_format($list['number_of_schools'],0,'.','.'),
            'number_of_children' =>number_format($list['number_of_children'],0,'.','.'),
            'counter' =>number_format($list['counter'],0,'',''),
            'video_url' => $list['video_url'] ?? null,
        ];
        $this->assign('list',$list);
    }
}
