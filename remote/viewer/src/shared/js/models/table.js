define([
	'backbone'
], function(
	Backbone){

	return new (Backbone.Model.extend({
		defaults: {
			left: 0,
			top: 0,
			width: 1200,
			height: 800
		},
		initialize: function(){
			this.fetch();
		},
		fetch: function(){
			var json= localStorage.getItem('table');
			if(json){
				this.set(JSON.parse(json));
			}
		},
		save: function(){
			var json= JSON.stringify(this.attributes);
			localStorage.setItem('table', json);
		}
	}))();
	
});