define([
	'backbone',
	'./image',
	'./devicemotion',
	'./deviceorientation'
], function(
	Backbone,
	image,
	devicemotion,
	deviceorientation){
	
	return new (Backbone.Model.extend({
		initialize: function(){
		
			this.listenTo(image, 'select', this.selectHandler);
			this.listenTo(image, 'post', this.postHandler);
			
			this.listenTo(devicemotion, 'devicemotion', this.devicemotionHandler);
		},
		selectHandler: function(){
			
			devicemotion.start();
			deviceorientation.start();
		},
		postHandler: function(){
			
			devicemotion.set('throwable', true);
		},
		devicemotionHandler: function(){
			
			setTimeout(function(that){

				var orientation= deviceorientation.get('orientation');

				that.trigger('throw', that, orientation);

				deviceorientation.stop();			

			}, 200, this);
		}
	}))();
	
});