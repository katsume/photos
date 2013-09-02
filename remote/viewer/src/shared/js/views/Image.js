define([
	'config',
	'backbone',
	'models/viewport'
], function(
	config,
	Backbone,
	viewport){
	
	return Backbone.View.extend({
		DEG_ADJUST: 0,
		tagName: 'li',
		className: 'image',
		initialize: function(){
			this.listenTo(this.model, 'change:heading', this.changeHeadingHandler);
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
				this.changeHeadingHandler(model);
			}
			
			return this;
		},
		changeHeadingHandler: function(model){
			
			var place= _(config.places).shuffle().pop();
			
			this.initializeSize(model, place);
			this.initializePosition(model, place);
			
			setTimeout(function(that){

				that.$el
					.css({
						webkitTransform: 'translate3d('+place.left+'px, '+place.top+'px, 0) rotate(0deg)',
						webkitTransitionDuration: '1.5s'
					});

			}, 100, this);
			
		},
		initializeSize: function(model){
		
			var size= config.imageSize;
			
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
					marginTop: -height/2+'px'
				});
		},
		initializePosition: function(model, place){

			var imageSize= config.imageSize,
				viewportWidth= viewport.get('width'),
				viewportHeight= viewport.get('height'),
				degree,
				radian,
				radius,
				x,
				y,
				rotate;
			
			degree= (function(src, context){
				var dst= src;
				dst-= context.DEG_ADJUST;
				dst-= Math.floor(dst/360.0)*360.0;
				if(180<dst){
					dst-= 360;
				}
				return dst;
			})(model.get('heading'), this);

			radian= (degree/180.0)*Math.PI;

			radius= (function(){
				var getRadius= function(w, h){
						return Math.sqrt(Math.pow(w/2, 2)+Math.pow(h/2, 2));
					};
				return getRadius(viewportWidth, viewportHeight)+getRadius(imageSize.width, imageSize.height);
			})();
			
/*
			x= viewportWidth/2+radius*Math.cos(radian);
			y= viewportHeight/2+radius*Math.sin(radian);			
*/
			x= place.left+radius*Math.cos(radian);
			y= place.top+radius*Math.sin(radian);			
			
			//	[-360, 0, 360]+(-180...+180)
			rotate= (_.random(2)*360-1*360)+(Math.random()*360-180);

			this.$el
				.css({
					webkitTransform: 'translate3d('+x+'px, '+y+'px, 0) rotate('+rotate+'deg)',
					webkitTransitionDuration: 0
				});
		}
	});
		
});