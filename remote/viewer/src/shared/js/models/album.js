define([
	'backbone'
], function(
	Backbone){

	return new (Backbone.Model.extend({
		defaults: {
			top: 200,
			width: 600,
			height: 300
		},
		initialize: function(){
			this.fetch();
		},
		fetch: function(){
			var json= localStorage.getItem('album'),
				album;
			if(json){
				album= JSON.parse(json);
				this.set(album);
			}
		},
		save: function(){
			var json= JSON.stringify(this.attributes);
			localStorage.setItem('album', json);
		}
	}))();
	
});