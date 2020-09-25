<?php

/* TODO: Add namespaces */
class widget_footer extends \rG_Widget
{

    public $_name = 'footer';

    /** @var m_menu $menuModel */
    public $menuModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->menuModel = new \m_menu();
    }

    public function init()
    {
        $m_customer = new \m_customer();
        $aggrements = $m_customer->getAggrements('newsletter', 'newsletter_kvkk');
        if(!empty($aggrements)){
            $this->assign("aggrement",$aggrements[0]);
        }

        $uri = ltrim($_SERVER['REQUEST_URI'], "/");
        if($uri == ""){
            $product = new \m_product();
            $stmt = $product->getCategoryCmsBlockTextValue('home');
            if (!empty($stmt['content'])) {
                $footer_desc = $stmt['content'];
            }
        }else{
            $footer_desc = \rG_Registry::get('footer_desc') ?: '';
        }
        $this->assign('device',$this->getDevice());
        $this->assign('footer_desc',$footer_desc ?? null);
    }
    protected function getDevice(){
        preg_match("/iPhone|Android|iPad|iPod|webOS/", $_SERVER['HTTP_USER_AGENT'], $matches);
        $os = current($matches);
        return $os;
    }
}