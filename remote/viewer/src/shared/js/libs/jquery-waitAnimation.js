(function($){

	var i;
	
	var animationEventName= (function(undefined){

		var events= [
			window.AnimationEvent,
			window.WebKitAnimationEvent
		];
		
		var eventNames= [
			"animationend",
			"webkitAnimationEnd"
		];
		
		for(var i=0; i<events.length; i++){
			if(events[i]){
				return eventNames[i];
			}
		}
		
		return undefined;

	})();
	
	var transitionEventName= (function(undefined){

		var events= [
			window.TransitionEvent,
			window.WebKitTransitionEvent
		];
		
		var eventNames= [
			"transitionend",
			"webkitTransitionEnd"
		];
		
		for(var i=0; i<events.length; i++){
			if(events[i]){
				return eventNames[i];
			}
		}
		
		return undefined;

	})();
	
	$.fn.wait= function(duration){
		return this.queue(function(next){
			setTimeout(next, duration||0);
		});
	};

	$.fn.waitAnimation= function(elm){
		return this.queue(function(next){
			animationEventName ? $(elm||this).one(animationEventName, next) : setTimeout(next, 0);
		});
	};

	$.fn.waitTransition= function(elm){
		return this.queue(function(next){
			transitionEventName ? $(elm||this).one(transitionEventName, next) : setTimeout(next, 0);
		});
	};
	
})(jQuery);
