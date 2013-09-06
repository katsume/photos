define([
	'config',
	'backbone',
	'models/page',
	'models/image/position',
	'jquery-waitAnimation'
], function(
	config,
	Backbone,
	pageModel,
	position){
	
	return Backbone.View.extend({
		DEG_ADJUST: 0,
		tagName: 'li',
		className: 'image',
		initialize: function(){
		
			this.listenTo(this.model, 'trigger', this.trigger);
			this.listenTo(this.model, 'remove', this.remove);
			this.listenTo(this.model, 'out', this._out);
			this.listenTo(pageModel, 'change:page', this._changePageHandler);
		},
		render: function(){

			var model= this.model,
				path= '//'+config.image.host+model.get('name');
			
			var $el= $('<div/>');
			
			$el
				.addClass('image-body')
				.css({
					'background-image': 'url('+path+')'
				});
				
			this.$el.append($el);
			
			return this;
		},
		trigger: function(force){
		
			var model= this.model,
				currentPage= pageModel.get('page'),
				targetPage= model.get('page'),
				initialPosition= position.getInitialPosition(model.get('heading')),
				easing= '',
				duration= 1.5,
				targetPosition;
				
			if(currentPage===targetPage && currentPage!==-1){

				if(force||position.canEnterCurrentPosition(model)){
					
					if(force){
						easing= 'cubic-bezier(0.390, 0.575, 0.565, 1.000)';
						duration= 0.75;
					}

					targetPosition= position.getCurrentPosition(model);
				} else {
					targetPosition= position.getRandomPosition();
				}

			} else {
				targetPosition= position.getRandomPosition();
			}

			this._action({
				position: initialPosition,
				duration: 0,
				callback: function(){
					this._adjustSize();
					this._action({
						position: targetPosition,
						duration: duration,
						easing: easing,
					});
				},
				context: this
			});
			
		},
		_out: function(id){
			if(this.model.id===id || this.model.get('page')!==pageModel.get('page')){
				this._action({
					position: position.getRandomPosition(),
					duration: 1.5
				});
			}
		},
		_changePageHandler: function(pageModel, currentPage){
			
			var model= this.model,
				previousPage= pageModel.previous('page'),
				targetPage= model.get('page');

			if(currentPage===-1){
			
				if(previousPage===targetPage){
					this._action({
						position: position.getRandomPosition()
					});
				}
			
			} else if(currentPage===targetPage){

				if(position.canEnterCurrentPosition(model)){
					this._action({
						position: position.getCurrentPosition(model)
					});
				} else {
					this._action({
						position: position.getRandomPosition()
					});
				}
			}
		},
		_adjustSize: function(){
		
			var model= this.model,
				size= config.image.size,
				borderWidth= config.image.borderWidth;
			
			var rx= size.width/model.get('width'),
				ry= size.height/model.get('height');
					
			var ratio= Math.min(rx, ry);
			
			var width= model.get('width')*ratio,
				height= model.get('height')*ratio;
				
			this.$el.find('.image-body')
				.css({
					width: width+'px',
					height: height+'px',
					marginLeft: -width/2+'px',
					marginTop: -height/2+'px',
					borderWidth: borderWidth+'px'
				});
		},
		_action: function(opt){

			var position= opt.position,
				duration= typeof opt.duration==='number' ? opt.duration : 0.75,
				easing= opt.easing||'cubic-bezier(0.215, 0.610, 0.355, 1.000)',/* ease-out-cubic */
				callback= opt.callback,
				context= opt.context||this;
				
			var css= {
				webkitTransform: 'translate3d('+position.left+'px, '+position.top+'px, 0) rotate('+position.rotate+'deg) skewY('+position.skew+'deg)',
				webkitTransitionDuration: duration+'s',
				webkitTransitionTimingFunction: easing
			};

			if(duration<=0){
				this.$el.css(css);
				if(typeof callback==='function'){
					callback.apply(context);
				}
				return;
			}

			this.$el
				.wait()
				.queue(function(next){
					$(this).css(css);
					next();
				})
				.waitTransition()
				.queue(function(next){
					if(typeof callback==='function'){
						callback.apply(context);
					}
					next();
				});
		}
	});
		
});