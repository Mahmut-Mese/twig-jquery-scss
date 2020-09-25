<?php

class widget_christmas_special extends \rG_Widget
{
    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

    }

    public function init()
    {
		$m_spotlight = new \m_spotlight();

		for ($i = 1; $i <= 9; $i++) {
			$key = 'aperiodic_banner_area_' . $i;
			$banner = $m_spotlight->getSpotlights($key);

			$this->assign($key, $banner);
		}

		$m_content = new \m_content();
        $settingsBlock = $m_content->getBlockContent('aperiodic_blocks_area_1');
        if(! empty($settingsBlock['content'])) {
			$this->assign('settingsBlock', json_decode($settingsBlock['content'], true));
		}

		$seoText = $m_content->getBlockContent('aperiodic_blocks_area_2');
        if(! empty($seoText['content'])) {
			$this->assign('seoText', $seoText['content']);
		}
    }
}
