<?php

/* TODO: Add namespaces */
class widget_header extends \rG_Widget
{
    public $_name = 'header';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->menuModel = new \m_menu();
    }

    public function init()
    {
        parent::init();

        $search_query = \rG_GPC::get('q') ?? '';
        $menus = $this->menuModel->getMenuByGroupId(1);
        $menuHtml = $this->menuModel->getMenuHtml('headermenu_dekstop');
        $menuHtmlMobile = $this->menuModel->getMenuHtml('headermenu_mobile');
        $m_spotlight = new \m_spotlight();
        $spotlights = $m_spotlight->getSpotlights('header_bant');
        $m_customer = new \m_customer();

        $this->assign('header_bant', $spotlights[0] ?? []);
        $this->assign('menus', $menus);
        $this->assign('search_query', $search_query);
        $this->assign('menuHtml', $menuHtml['content']);
        $this->assign('menuHtmlMobile', $menuHtmlMobile['content']);
        $this->assign('login_as_customer_message', rG_GPC::cookie('login_as_customer_message', 'string'));
        $this->assign('user_logged_in', (int)$m_customer::isLoggedIn());
        $this->assign('full_name', $m_customer->getFullName());
    }
}

