define([
	'config',
	'backbone'
], function(
	config,
	Backbone){
	
	return new (Backbone.View.extend({
		el: $('#album'),
		initialize: function(){
		
			var size= config.album.size;
			
			this.$el.css({
				left: '50%',
				top: '50%',
				width: size.width+'px',
				height: size.height+'px',
				marginLeft: -(size.width/2)+'px',
				marginTop: -(size.height/2)+'px'
			});
		}
	}))();

});