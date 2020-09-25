<?php

class widget_password_reset extends \rG_Widget
{
    public $_name = 'list';

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);
    }

    public function init()
    {
        $token = \rG_GPC::get('token');
        $email = \rG_GPC::get('email');

        $customer['token'] = $token;
        $customer['email'] = $email;

        $this->assign("customer",$customer);

    }
}