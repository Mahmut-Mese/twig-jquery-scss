<?php

/* TODO: Add namespaces */
class widget_banner extends \rG_Widget
{
    public $_name = 'banner';

    public function init()
    {

		$source = $this->template_vars['source'];
		
		$m_spotlight = new \m_spotlight();

		$spotlights = $m_spotlight->getSpotlights($source ?: 'spotlight');

		$this->assign('spotlights', $spotlights);

        return $this->render();
    }
}

