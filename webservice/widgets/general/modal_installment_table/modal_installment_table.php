<?php

class widget_modal_installment_table extends \rG_Widget
{
    /**
     * @var m_product $productModel
     */
    private $productModel;

    public function __construct($categoryName, $widgetName, $params)
    {
        parent::__construct($categoryName, $widgetName, $params);

        $this->productModel = new \m_product();
    }

    public function init()
    {
        $price = \rG_GPC::get('price') ?? 0;
        $price = $this->widgetParams['price'] ?? $price;

        $installments = $this->productModel->getInstallmentData($price);
        $installments = $this->prepareInstallmentData($installments, $price);

        $this->assign('installments', $installments);

    }

    public function prepareInstallmentData($installments, $price)
    {
        foreach ($installments as $key => $installment) {
            $totalPrice = (($installment['rate'] / 100) + 1) * $price;
            $calcNum = $totalPrice / intval($installment['installment']);
            $installments[$key]['installment_price'] = number_format($calcNum, 2);
        }
        return $installments;
    }

}
