<?php

/* TODO: Add namespaces */
class widget_banner3 extends \rG_Widget
{
    public $_name = 'banner3';

    public function init()
    {
        $m_spotlight = new \m_spotlight();
        $spotlights = $m_spotlight->getSpotlights('anasayfa_uclu');

        $this->assign('spotlights', $spotlights);

        return $this->render();
    }
}

