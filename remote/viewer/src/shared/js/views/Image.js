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
		
			this.place= null;
		
			this.listenTo(this.model, 'trigger', this.trigger);
			this.listenTo(this.model, 'remove', this.remove);
			this.listenTo(pageModel, 'change:page', this.changePageHandler);
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
		trigger: function(){
		
			var model= this.model,
				currentPage= pageModel.get('page'),
				targetPage= model.get('page'),
				initialPosition= position.getInitialPosition(model.get('heading')),
				targetPosition;

			if(currentPage===targetPage && currentPage!==-1){
				targetPosition= position.getCurrentPosition();
			} else {
				targetPosition= position.getRandomPosition();
			}
			
			this.action(initialPosition, 0, function(){
			
				this.adjustSize();
				this.action(targetPosition, 1.5);

			}, this);
			
		},
		changePageHandler: function(model, currentPage){

			var previousPage= model.previous('page'),
				targetPage= this.model.get('page');

			if(currentPage===-1){
			
				if(previousPage===targetPage){
					this.action(position.getRandomPosition());
				}
			
			} else if(currentPage===targetPage){
				this.action(position.getCurrentPosition());
			}
		},
		adjustSize: function(){
		
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
		getInitialPosition: function(heading){

			var	size= config.image.size,
				tableWidth= config.table.size.width,
				tableHeight= config.table.size.height,
				degree,
				radian,
				radius,
				x,
				y,
				rotate;

			degree= heading;
			degree-= this.DEG_ADJUST;
			degree-= Math.floor(degree/360.0)*360.0;
			if(180<degree){
				degree-= 360;
			}			

			radian= (degree/180.0)*Math.PI;

			radius= (function(){
				var getRadius= function(w, h){
						return Math.sqrt(Math.pow(w/2, 2)+Math.pow(h/2, 2));
					};
				return getRadius(tableWidth, tableHeight)+getRadius(size.width, size.height);
			})();
			
			x= tableWidth/2+radius*Math.cos(radian);
			y= tableHeight/2+radius*Math.sin(radian);
			
			//	[-360, 0, 360]+(-180...+180)
			rotate= (_.random(2)*360-1*360)+(Math.random()*360-180);
			
			return {
				left: x,
				top: y,
				rotate: rotate
			};
		},
		action: function(position, duration, callback, context){
		
			duration= typeof duration==='number' ? duration : 0.75;
			context= context||this;

			this.$el
				.wait()
				.queue(function(next){
					$(this).css({
						webkitTransform: 'translate3d('+position.left+'px, '+position.top+'px, 0) rotate('+position.rotate+'deg)',
						webkitTransitionDuration: (duration||0.5)+'s'
					});
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