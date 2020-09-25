<?php

class widget_savedcard extends \rG_Widget
{
    public $_name = 'list';

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {

        $m_saved_card = new \m_saved_card();

        $allCard = $m_saved_card->getCardList();
        $this->assign('cards', $allCard ?? []);
        parent::init();
    }
}