<?php

class widget_black_friday extends \rG_Widget
{
    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

    }

    public function init()
    {
		$m_spotlight = new \m_spotlight();
        $m_product = new \m_product();

		$efsane_head_image = $m_spotlight->getSpotlights('efsane_head_image');
		$efsane_banner = $m_spotlight->getSpotlights('efsane_banner');
		$efsane_bottom_right_banner = $m_spotlight->getSpotlights('efsane_bottom_right_banner');

        // $m_customer = new \m_customer();
        // $campaigns = $m_customer->getOctaberCampaign();

        // if(\m_customer::isLoggedIn()) {
        //     $customer_campaigns = $m_customer->getCustomerCampaignCoupon($m_customer->get('id'));
		// }
        $m_content = new \m_content();
        $cms_page = $m_content->getBlockContent('landing_page_efsane_indirim_gunleri');
        if(! empty($cms_page['content']))
            $landing_page = json_decode($cms_page['content'],true);

        $categoryId = $this->_config->get('env.webservice.efsane_indirim_kategori');

        if(! empty($categoryId)){
            $whereClause = 'category_ids:' . $categoryId;
            $products = $m_product->getSearchResults(null,$whereClause,[]);
        }
		
        $this->assign('campaigns', $efsane_banner ?? []);
        $this->assign('efsane_head_image', $efsane_head_image);
		// $this->assign('efsane_banner', $efsane_banner);
		$this->assign('efsane_bottom_right_banner', $efsane_bottom_right_banner);

		// $this->assign('user_logged_in', (int)$m_customer::isLoggedIn());
		$this->assign('landing_page', $landing_page ?? []);
		$this->assign('products', $products ?? []);
    }
}
