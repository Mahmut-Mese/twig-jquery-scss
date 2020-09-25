<?php

class widget_blogger extends \rG_Widget
{
    public $_name = 'blogger';

    public function init()
    {
        $m_spotlight = new \m_spotlight();
        $spotlights = $m_spotlight->getSpotlights('blogger_banner');

        $this->assign('spotlights', $spotlights);

        return $this->render();
    }
}

