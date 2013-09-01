(function($){

	$.fn.waitAnimation= function(elm){
		return this.queue(function(next){
			$(elm||this).one("webkitAnimationEnd", next);
		});
	};

	$.fn.waitTransition= function(elm){
		return this.queue(function(next){
			$(elm||this).one("webkitTransitionEnd", next);
		});
	};
	
})(jQuery);
