$(function() {
	// Accordeon-----------------------------------
		$('.acordeon-link').click(function(e) {
			e.preventDefault();
			var $currentItem = $(this).closest('.acordeon-item');
			if($currentItem.hasClass('acordeon-item-with-sublist')){

				$currentItem.find('.acordeon-sublist')
					.stop(true, true)
					.slideToggle();
				$currentItem.siblings()
					
					.find('.acordeon-sublist')
					.stop(true, true)
					.slideUp();

				$currentItem
					.toggleClass('active')
					.siblings()
					.removeClass('active');
			}else{
				return;
			}
		});
		// end Accordeon-----------------------------------
		
});

