define([
	'backbone',
	'./image'
], function(
	Backbone,
	Image){

	return new (Backbone.Collection.extend({
		model: Image,
		initialize: function(){
			
		},
	}))();
	
});