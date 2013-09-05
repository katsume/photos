define([
	'config',
	'backbone',
	'models/imagePosition',
	'jquery-waitAnimation'
], function(
	config,
	Backbone,
	imagePosition){
	
	return Backbone.View.extend({
		DEG_ADJUST: 0,
		tagName: 'li',
		className: 'image',
		initialize: function(){
		
			this.place= null;
		
			this.listenTo(this.model, 'trigger', this.trigger);
			this.listenTo(this.model, 'remove', this.remove);
		},
		render: function(){

			var model= this.model,
				path= '//'+config.host+model.get('name');
			
			var $el= $('<div/>');
			
			$el
				.addClass('image-body')
				.css({
					'background-image': 'url('+path+')'
				});
				
			this.$el.append($el);
			
			if(model.has('heading')){
				this.trigger(true);
			}
			
			return this;
		},
		trigger: function(isRandom){
		
			this.setTargetPosition(isRandom);
			this.adjustSize();
			this.setInitialPosition();
			this.show();
		},
		setTargetPosition: function(isRandom){
		
			this.place= imagePosition.random();
			
			if(isRandom){
				this.place.rotate= Math.random()*360-180;
			} else {
				this.place.rotate= 0;
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
		setInitialPosition: function(){

			var model= this.model,
				heading= model.get('heading'),
				place= this.place;

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
/*
			x= place.left+radius*Math.cos(radian);
			y= place.top+radius*Math.sin(radian);			
*/
			
			//	[-360, 0, 360]+(-180...+180)
			rotate= (_.random(2)*360-1*360)+(Math.random()*360-180);

			this.$el
				.css({
					webkitTransform: 'translate3d('+x+'px, '+y+'px, 0) rotate('+rotate+'deg)',
					webkitTransitionDuration: 0
				});
		},
		show: function(){

			var place= this.place;

			this.$el
				.wait(100)
				.queue(function(next){
					$(this).css({
						webkitTransform: 'translate3d('+place.left+'px, '+place.top+'px, 0) rotate('+place.rotate+'deg)',
						webkitTransitionDuration: '1.5s'
					});
					next();
				});
		}
	});
		
});