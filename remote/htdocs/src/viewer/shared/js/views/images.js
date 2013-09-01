define([
	'config',
	'backbone',
	'../models/image',
	'../models/images',
	'./image'
], function(
	config,
	Backbone,
	Image,
	collection,
	ImageView){
	
	return new (Backbone.View.extend({
		el: $('#images'),
		events: {
		},
		initialize: function(){
		
			this.listenTo(collection, 'add', this.appendImage);

			_.bindAll(this, 'keydownHandler');
			$(document).keydown(this.keydownHandler);
		},
		appendImage: function(image){
		
			var imageView= new ImageView({
				model: image
			});
			
			$(this.el).append(imageView.render().el);
		},
		keydownHandler: function(event){
			
			switch(event.keyCode){
				case 32:
					this.addStubImage();
					break;
				case 82:
					this.removeImages();
					break;
				default:
					break;
			}
		},
		addStubImage: function(){
		
			var image= new Image(),
				stubs= config.stubs,
				stub= _(stubs).shuffle().pop();
			
			image.set({
				id: 'stub'+(new Date()).getTime(),
				width: stub.width,
				height: stub.height,
				data: stub.data
			});
			
			collection.add(image);
			
			setTimeout(function(that){
				image.set('heading', Math.random()*360.0);
			}, this, 0);
		},
		removeImages: function(){
		
			var model= collection.at(0);
			collection.remove(model);
		}
	}))();
		
});