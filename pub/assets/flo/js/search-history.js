// set: function (key, value, session) {
// 	window[session ? 'sessionStorage' : 'localStorage'].setItem('layerData.' + key, JSON.stringify(value));
// },
// get: function (key, session) {
// 	return JSON.parse(window[session ? 'sessionStorage' : 'localStorage'].getItem('layerData.' + key));
// },
// remove: function (key) {
// 	return window.localStorage.removeItem(this.getKey(key));
// }

$(function () {
    var isMobile = $('.mobile-menu').length;

	var HISTORY = [];
	var getHistory = function () {
		HISTORY = (window.localStorage.getItem('search-history') || '')
			.split(',').filter(item => item);
	}

	var addHistory = function (value) {
		HISTORY = [value].concat(HISTORY.slice(0, 9));

		updateHistory();
	}

	var updateHistory = function () {
		localStorage.setItem('search-history', HISTORY.join(','));
	}

	getHistory();

	var positionTop = '100%';
	var delay = 0;
	
	if (isMobile) {
		var $panelHeader = $('.panel-header');
		if ($panelHeader.length) {
			positionTop = $panelHeader.outerHeight(true);
		} else {
			positionTop = 50;
			delay = 200;
		}
	}

	var $searchHistoryContainer = $('<div id="search-history-container"></div>').css({
		position: isMobile ? 'fixed' : 'absolute',
		top: positionTop,
		right: 0,
		left: 0,
		bottom: isMobile ? 0 : null,
		background: '#ffffff',
		border: 'solid 1px #efefef',
		boxShadow: '0px 2px 2px rgba(0,0,0,.1)',
		borderTop: 0,
		padding: '10px 15px',
		zIndex: 999,
	}).html(
		'<div style="margin-bottom: 10px; display:flex; justify-content: space-between; flex-direction: row;"><span style="font-weight:500;color:#ff671b;">Geçmiş Aramalar</span><a href="#" style="color: #000000;" class="search-history-clear">Temizle</a></div>' +
		'<ul style="padding: 0; list-style: none;"></ul>'
	).on('update', function () {
		$(this).find('ul').html(HISTORY.map(function (item) {
			return '<li style="border-bottom: solid 1px #efefef"><a href="/search?q='+ item +'" style="display: block; padding: 5px 0; font-size: 14px; color: #000000;">'+ item +'</a></li>';
		}));
	});

	var showHistoryContainer = function () {
		var width = isMobile ? window.innerWidth : $autoCompleteInput.outerWidth();

		$searchHistoryContainer.css({
			width: width
		}).trigger('update').show().insertAfter($autoCompleteInput);
	}

	var $autoCompleteInput = $('.commerce-autocomplete').on('keyup', function (e) {
		var $self = $(this);
		var value = $self.val();

		if (e.which !== 13) { 
			if (value) {
				$searchHistoryContainer.hide();
			} else {
				showHistoryContainer();
			}

			return; 
		}

		addHistory(value);
	}).on('focus', function () {
		if (!HISTORY.length) {
			return;
		}

		if ($(this).val()) {
			return;
		}

		setTimeout(function () {
			showHistoryContainer();
		}, delay);
	});

	$(document).on('click', function (e) {
		var $target = $(e.target);
		var close = (!$target.closest('#search-history-container').length) 
			&& (!$target.closest('.search-form').length);

		if (close) {
			$searchHistoryContainer.hide();
		}
	});

	$searchHistoryContainer.find('.search-history-clear').off('click').on('click', function (e) {
		e.preventDefault();

		HISTORY = [];

		updateHistory();
		
		$searchHistoryContainer.hide();
	});
});