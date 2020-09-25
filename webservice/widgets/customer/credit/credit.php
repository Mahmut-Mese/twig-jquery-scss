<?php

class widget_credit extends \rG_Widget
{
    public $_name = 'credit';

    public function init()
    {
		parent::init();

		// @TODO[~] : Bu alan dinamikleştirilecek
		$data = [
			[
				'status' => 'Kullanıldı',
				'transformation' => '-6,00',
				'credit' => '0,00',
				'date' => '20.05.2019 - 15.35'
			],
			[
				'status' => 'Kullanıldı',
				'transformation' => '-6,00',
				'credit' => '0,00',
				'date' => '20.05.2019 - 15.35'
			]
		];
		$this->assign('total', '59,00');
		$this->assign('data', $data);

		// @TODO[~] : Bu alan dinamikleştirilecek
    }
}

