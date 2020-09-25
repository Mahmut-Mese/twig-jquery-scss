<?php

class widget_after_spotlight extends \rG_Widget
{
    public $_name = 'after_spotlight';

    public function init()
    {
        $m_spotlight = new \m_spotlight();
        $spotlights = $m_spotlight->getSpotlights('after_spotlight');
        $this->assign('spotlights', $spotlights);

        return $this->render();
    }
}
