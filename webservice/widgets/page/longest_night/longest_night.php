<?php

class widget_longest_night extends \rG_Widget
{
    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

    }

    public function init()
    {
		$m_spotlight = new \m_spotlight();

		$enuzun_head_image = $m_spotlight->getSpotlights('enuzun_head_image');
		$enuzun_banner = $m_spotlight->getSpotlights('enuzun_banner');

        $m_content = new \m_content();
        $block1 = $m_content->getBlockContent('enuzun_blocks_1');
        if(! empty($block1['content'])) {
			$this->assign('enuzun_blocks_1', json_decode($block1['content'],true));
		}

        $block2 = $m_content->getBlockContent('enuzun_blocks_2');
        if(! empty($block2['content'])) {
			$this->assign('enuzun_blocks_2', $block2['content']);
		}
		
        $this->assign('campaigns', $enuzun_banner ?? []);
        $this->assign('enuzun_head_image', $enuzun_head_image);
    }
}
