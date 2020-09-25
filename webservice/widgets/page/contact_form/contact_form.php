<?php

class widget_contact_form extends \rG_Widget
{
    public $_name = 'contact_form';

    /** @var m_static_page $staticPageModel */
    public $staticPageModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

    }

    public function init()
    {
        $m_ticket = new \m_ticket();
        $data["department_list"] = $m_ticket->getDepartmentParents();
        $this->assign('cf_post_time', (int)\rG_GPC::get('cf_post_time'));
        $this->assign('re_captcha', $this->_config->get('env.webservice.re_captcha'));
        $this->assign('contact',$data);
        $this->assign('contact_form', '');
    }
}
