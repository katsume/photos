define([
	'config',
	'backbone',
	'models/images',
	'models/page',
	'./image'
], function(
	config,
	Backbone,
	collection,
	page,
	View){
	
	return new (Backbone.View.extend({
		el: $('#images'),
		events: {
		},
		initialize: function(){
		
			this.views= [];
		
			this.listenTo(collection, 'add', this.append);
			this.listenTo(collection, 'reset', this.replace);
			
			this.listenTo(page, 'change:page', this.changePageHandler);
		},
		append: function(model, collection, options){
		
			var view= new View({
				model: model
			});
			this.views.push(view);
			
			$(this.el).append(view.render().el);
		},
		replace: function(collection){
			
			_.each(this.views, function(view){
				view.remove();
			});
			this.views= [];
			
			_.each(collection.models, function(model, i){
				setTimeout(function(that){
					that.append(model, collection);
				}, 50*i, this);
			}, this);
		},
		changePageHandler: function(model, page){
		
			if(page===-1){
				_.each(this.views, function(view){
					view.move();
				}, this);
				return;
			}

			$("#debug-page").text(page);			
		}
	}))();
		
});