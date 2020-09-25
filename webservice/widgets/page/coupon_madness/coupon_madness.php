<?php

class widget_coupon_madness extends \rG_Widget
{
    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

    }

    public function init()
    {
		$m_spotlight = new \m_spotlight();
		
		$bannerAliases = ['tum_kampanyalar', 'kadin', 'erkek', 'cocuk', 'spor', 'aksesuar', 'giyim'];

		foreach ($bannerAliases as $alias) {
			$banner = $m_spotlight->getSpotlights('1111_campaign_page_banner_1_' . $alias);

			$this->assign('banner_1_' . $alias, $banner ?? []);
		}

		$banner2 = $m_spotlight->getSpotlights('1111_campaign_page_banner_2');
        $banner3 = $m_spotlight->getSpotlights('1111_campaign_page_banner_3');

        $m_customer = new \m_customer();
        $campaigns = $m_customer->getOctaberCampaign();

        if(\m_customer::isLoggedIn()) {
            $customer_campaigns = $m_customer->getCustomerCampaignCoupon($m_customer->get('id'));
		}
		
        $this->assign('campaigns', $campaigns ?? []);
        $this->assign('customer_campaigns', $customer_campaigns ?? []);
		
        $this->assign('banner_2', $banner2);
		$this->assign('banner_3', $banner3);
		$this->assign('user_logged_in', (int)$m_customer::isLoggedIn());
    }
}
