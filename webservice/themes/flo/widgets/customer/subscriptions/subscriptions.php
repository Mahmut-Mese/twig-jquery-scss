<?php

class widget_subscriptions extends \rG_Widget
{
    public $_name = 'subscriptions';
    public $staticPageModel;


    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
        $this->staticPageModel = new \m_static_page();

    }

    public function init()
    {
        $m_customer = new \m_customer();
        $m_product = new \m_product();
        $hasNewsletter = $m_customer->newsletterSubscriberCheck(['subscriber_email' => $m_customer->get('email')]);

        $static_page = $this->staticPageModel->getByUrlOrId('aydinlatma-metni');


        if(empty($hasNewsletter)){
            $this->assign("email",0);
            $this->assign("sms",0);
        } else {
            $this->assign("email",$hasNewsletter['email']);
            $this->assign("sms",$hasNewsletter['sms']);
        }

        $aggrements = $m_customer->getAggrements('register_form', 'subscribed_kvkk');
        $this->assign("aggrements",$aggrements);
        $this->assign('meta',$m_product->getMetaData('customer_subscriptions'));
        $this->assign('static_page', $static_page);
    }
}