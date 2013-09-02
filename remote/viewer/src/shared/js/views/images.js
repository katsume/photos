define([
	'config',
	'backbone',
	'../models/images',
	'./image'
], function(
	config,
	Backbone,
	collection,
	View){
	
	return new (Backbone.View.extend({
		el: $('#images'),
		events: {
		},
		initialize: function(){
		
			this.listenTo(collection, 'add', this.append);
			this.listenTo(collection, 'reset', this.replace);
		},
		append: function(model, collection, options){
		
			var view= new View({
				model: model
			});
			
			$(this.el).append(view.render().el);
		},
		replace: function(collection){
			
			this.$el.empty();
			
			_.each(collection.models, function(model, i){
				setTimeout(function(that){
					that.append(model, collection);
				}, 33*i, this)
			}, this);
		}
	}))();
		
});