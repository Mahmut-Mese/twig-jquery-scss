<?php

class widget_spotlight extends \rG_Widget
{
    public $_name = 'spotlight';

    public function init()
    {
        $m_spotlight = new \m_spotlight();
        $spotlights = $m_spotlight->getSpotlights('banner_slider');
        $this->assign('spotlights', $spotlights);

        return $this->render();
    }
}
