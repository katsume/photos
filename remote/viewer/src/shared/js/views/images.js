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

			this.changePageHandler(page, page.get('page'));
		},
		append: function(model, collection, options){
		
			var view= new View({
				model: model
			});
			this.views.push(view);
			
			$(this.el).append(view.render().el);

			if(model.has('heading')){
				view.trigger();
			}			
		},
		replace: function(collection){
			
			_.each(this.views, function(view){
				view.remove();
			});
			this.views= [];
			
			_.each(collection.models, function(model, i){
				setTimeout(function(that){
					that.append(model, collection);
				}, 16*i, this);
			}, this);
		},
		changePageHandler: function(model, page){
			$("#debug-page").text(page);			
		}
	}))();
		
});