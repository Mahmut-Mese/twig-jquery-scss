<?php

/* TODO: Add namespaces */
class widget_edit extends \rG_Widget
{
    public $_name = 'image';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

    }

    public function init()
    {
        parent::init();
        $m_customer = new \m_customer();
        $m_product = new \m_product();
        $this->assign('meta', $m_product->getMetaData('customer_edit'));
        $customer = $m_customer->get();

        foreach ($customer['custom_attributes'] as $attribute) {
            $customer[$attribute['attribute_code']] = $attribute['value'];
        }
        if(! empty($customer['dob'])){
            list($year,$mount,$day) = explode("-",$customer['dob']);
            $customer['dobb']['day'] = $day;
            $customer['dobb']['mount'] = $mount;
            $customer['dobb']['year'] = $year;
        }
        // mobil de input mask statik tanimlamada sıkıntılı
        if(! empty($customer['phone'])){
            $customer["phone_mask"] = substr($m_customer->phoneClear($customer['phone']), -9);
            $customer["phone_mobile_mask"] = substr($m_customer->phoneClear($customer['phone']), -9);
        }
        $customer['phone'] = $m_customer->phoneClear($customer['phone']);

        $uyelikSozlesmesi = $m_customer->getAggrements('register_form', 'uyelik_sozlesmesi', false);
        $updateKVKK = $m_customer->getAggrements('custom', 'account_update', false);
        /*        unset($aggrements['newsletter_sms']);
                unset($aggrements['newsletter_email']);*/

        if(! empty($uyelikSozlesmesi[0]))
            $aggrements['uyelik_sozlesmesi'] = $uyelikSozlesmesi[0];
        if(! empty($updateKVKK[0]))
            $aggrements['account_update'] = $updateKVKK[0];

        $m_saved_card = new \m_saved_card();
        $allCard = $m_saved_card->getCardList();

        $this->assign('cards', $allCard ?? []);

        $this->assign("aggrements", $aggrements);
        $this->assign("customer",$customer);
    }
}

