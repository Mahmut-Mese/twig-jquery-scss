<?php

class widget_after_brand extends \rG_Widget
{
    public $_name = 'after_brand';

    public function init()
    {
        $m_spotlight = new \m_spotlight();
        $spotlights = $m_spotlight->getSpotlights('after_brand');
        $this->assign('spotlights', $spotlights);

        return $this->render();
    }
}
