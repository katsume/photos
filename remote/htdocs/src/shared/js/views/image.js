define([
	'module',
	"backbone",
	"models/image",
	"models/devicesensor",
	"jquery.waitAnimation"
], function(
	module,
	Backbone,
	image,
	devicesensor){
	
	return new (Backbone.View.extend({
		el: "#image",
		initialize: function(){
		
			this.$frame= $('#frame');
			this.$inner= $('#frame-inner');
			
			this.listenTo(image, 'select', this.selectHandler);
			this.listenTo(image, 'post', this.postHandler);
			
			this.listenTo(devicesensor, 'throw', this.fly);
		},
		selectHandler: function(){
		
			this.$el.addClass('hidden');
			this.$inner.addClass('loading');
		}, 
		postHandler: function(model, id){

			var imageWidth= model.get('width'),
				imageHeight= model.get('height'),
				config= module.config();
			
			var rx= config.width/imageWidth,
				ry= config.height/imageHeight,
				r= rx;
				
			var width= imageWidth*r,
				height= imageHeight*r;
				
			var $el= this.$el;
				
			//	Set image

			$el.attr({
				width: width,
				height: height,
				src: model.get('data')
			});
				
			//	Adjust size
			
			this.$inner
				.queue(function(next){

					$(this).css({
						width: width+"px",
						height: height+"px",
						marginLeft: (-width/2)+"px",
						marginTop: (-height/2)+"px"
					});

					next();
				})
				.waitTransition()
				.queue(function(next){

					$el.removeClass('hidden');
					$(this).removeClass('loading');

					next();
				});

		},
		fly: function(){
		
			var that= this;
			
			that.$frame
				.queue(function(next){

					$(this).addClass("trigger");

					next();
				})
				.waitAnimation()
				.queue(function(next){
					
					setTimeout(that.clear, 0, that);

					next();
				});
		},
		clear: function(that){
			
			that.$inner
				.queue(function(next){

					image.clear();

					$(this).css({
						width: "",
						height: "",
						marginLeft: "",
						marginTop: ""
					});
					
					that.$el
						.attr({
							width: 0,
							height: 0
						})
						.removeAttr("src");

					next();
				})
				.waitTransition()
				.queue(function(next){

					setTimeout(that.restore, 0, that);

					next();
				});
		},
		restore: function(that){

			that.$frame
				.queue(function(next){

					$(this).addClass("restore");

					next();
				})
				.waitAnimation()
				.queue(function(next){

					$(this).removeClass("trigger restore");

					next();
				});
		}
	}))();
});