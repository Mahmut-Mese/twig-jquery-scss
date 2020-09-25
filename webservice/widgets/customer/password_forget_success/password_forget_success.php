<?php

class widget_password_forget_success extends \rG_Widget
{
    public $_name = 'password_forget_success';

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {
        $this->assign('customer_forget_password_email',rG_GPC::get('customer_forget_password_email'));
    }
}