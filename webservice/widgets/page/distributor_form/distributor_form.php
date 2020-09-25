<?php

class widget_distributor_form extends \rG_Widget
{
    public $_name = 'distributor_form';

    /** @var m_static_page $staticPageModel */
    public $staticPageModel;
    public $_reCaptcha;
    public $_config;
    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
        $this->_reCaptcha = $this->_config->get('env.webservice.re_captcha');

    }

    public function init()
    {
        $data = [
            'failures_num' => rG_GPC::get('failures_num'),
            'show_fail_num' => $this->_reCaptcha['fail_num'],
            'site_key' => $this->_reCaptcha['site_key'],
            'active' => $this->_reCaptcha['active']
        ];
        $this->assign('distributor_form', $data);
    }
}
