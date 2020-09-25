$(function () {
	$('.category-box a').off('click').click(function () {}).on('click', function (e) {
		var $self = $(this);
		var subjectId = $self.data('subject-id');
		var questionId = $self.data('question-id');

		$('.collapse-toggle[data-question-id="'+ questionId +'"]').trigger('click');
		$('.left-menu a[data-subject-id="'+ subjectId +'"]').trigger('click');
	});

	$('.left-menu a[data-subject-id]').off('click').click(function () {}).on('click', function (e) {
		e.preventDefault();

		$('.left-menu a[data-subject-id]').removeClass('active');

		var $self = $(this);
		var subjectId = $self.data('subject-id');

		var $selectedContainer = $('.main-container').hide().filter('[data-subject-id="'+ subjectId +'"]').fadeIn();
		if (!e.isTrigger) {
			$selectedContainer.find('.collapse-toggle:first').trigger('click');
		}

		$self.addClass('active');
	});

	$('.collapse-toggle[data-question-id]').off('click').click(function () {}).on('click', function (e) {
		e.preventDefault();	

		$('.collapse-toggle[data-question-id]').not(this).removeClass('active');
		$('.collapse').hide();

		var $self = $(this);

		$(self).next('.collapse').fadeIn();

		setTimeout(function () {
			$self.addClass('active');
		}, 200);
	});
});