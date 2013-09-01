define([
	'config',
	'backbone',
	'models/viewport'
], function(
	config,
	Backbone,
	viewport){
	
	return Backbone.View.extend({
		tagName: 'li',
		className: 'image',
		initialize: function(){
			this.listenTo(this.model, 'change:heading', this.changeHeadingHandler);
			this.listenTo(this.model, 'remove', this.remove);
		},
		render: function(){
		
			var model= this.model;
			
			this.$el
				.html(
					'<div class="image-body" style="background-image:url('+model.get('data')+');"></div>'
				);
			
			return this;
		},
		changeHeadingHandler: function(model){
			
			var place= _(config.places).shuffle().pop();
			
			if(!model.has('placeId')){
			
				this.initializePosition(model, place);
			}

			model.set('placeId', place);
			
			setTimeout(function(that){

				that.$el
					.css({
						left: place.left+'px',
						top: place.top+'px',
						webkitTransform: 'rotate(0deg)',
						webkitTransitionDuration: '1.5s'
					});

			}, 100, this);
			
		},
		initializePosition: function(model, place){

			var viewportWidth= viewport.get('width'),
				viewportHeight= viewport.get('height'),
				degree,
				radian,
				radius,
				x,
				y,
				ratio,
				width,
				height,
				rotate;
			
			degree= (function(src){
				
				var dst= src;
			
				dst-= 160;
				
				dst-= Math.floor(dst/360.0)*360.0;

				if(180<dst){
					dst-= 360;
				}

				return dst;

			})(model.get('heading'));

			radian= (degree/180.0)*Math.PI;

			radius= (function(){
				
				var getRadius= function(w, h){
						return Math.sqrt(Math.pow(w/2, 2)+Math.pow(h/2, 2));
					};
					
				return getRadius(viewportWidth, viewportHeight)+getRadius(place.width, place.height);
			})();
			
			x= viewportWidth/2+radius*Math.cos(radian);
			y= viewportHeight/2+radius*Math.sin(radian);			
			
			ratio= (function(){
				
				var rx= place.width/model.get('width'),
					ry= place.height/model.get('height');
					
				return Math.min(rx, ry);
			})();
			
			width= model.get('width')*ratio;
			height= model.get('height')*ratio;
			
			rotate= (_.random(2)*360-1*360)+(_.random(360)-180);

			this.$el
				.css({
					left: x+'px',
					top: y+'px',
					webkitTransform: 'rotate('+rotate+'deg)',
					webkitTransitionDuration: 0
				})
				.find('.image-body')
					.css({
						width: width+'px',
						height: height+'px',
						marginLeft: -width/2+'px',
						marginTop: -height/2+'px'
					})

		}
	});
		
});