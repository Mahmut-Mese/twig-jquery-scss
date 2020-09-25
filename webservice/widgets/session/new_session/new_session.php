<?php

class widget_new_session extends \rG_Widget
{
    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }
     public function init()
    {
        $m_spotlight = new \m_spotlight();
        $list = $m_spotlight->getSpotlights('home_uclu_alan');
        $this->assign('list',$list);

    }

}






