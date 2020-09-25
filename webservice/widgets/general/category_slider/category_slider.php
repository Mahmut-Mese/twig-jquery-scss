<?php

/* TODO: Add namespaces */
class widget_category_slider extends \rG_Widget
{
    public $_name = 'category_slider';

    public function init()
    {
        $m_spotlight = new \m_spotlight();
        $spotlights = $m_spotlight->getSpotlights('category_slider');

        $this->assign('spotlights', $spotlights);

        return $this->render();
    }
}

