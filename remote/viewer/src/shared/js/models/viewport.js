define([
	'backbone'
], function(
	Backbone){

	return new (Backbone.Model.extend({
		defaults: {
			left: 6,
			top: 84,
			width: 1267,
			height: 677
		},
		initialize: function(){			
		}
	}))();
	
});