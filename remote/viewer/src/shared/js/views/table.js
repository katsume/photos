define([
	'config',
	'backbone'
], function(
	config,
	Backbone){
	
	return new (Backbone.View.extend({
		el: $('#table'),
		initialize: function(){
		
			var position= config.table.position;
				size= config.table.size;
		
			this.$el.css({
				left: position.left+'px',
				top: position.top+'px',
				width: size.width+'px',
				height: size.height+'px'
			});
		}
	}))();

});