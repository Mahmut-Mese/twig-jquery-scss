<?php

/* TODO: Add namespaces */

class widget_head_scripts extends rG_Widget
{
    public $_name = 'head_scripts';
    private $_aggs = [];

    public function init()
    {
        parent::init();

        $this->assign('disable_external_scripts', $_GET['disable_external_scripts'] ?? false);
    }
}

