<?php

/* TODO: Add namespaces */
class widget_banner2 extends \rG_Widget
{
    public $_name = 'banner2';

    public function init()
    {
        $m_spotlight = new \m_spotlight();
        $spotlights = $m_spotlight->getSpotlights('anasayfa_ikili');

        $this->assign('spotlights', $spotlights);

        return $this->render();
    }
}

