define([
	'backbone',
	'models/viewport'
], function(
	Backbone,
	model){
	
	return new (Backbone.View.extend({
		el: $('#viewport'),
		events: {
		},
		initialize: function(){

			this.listenTo(model, 'change', this.setRect);

			_.bindAll(this, 'adjustRect');
			$(document).keydown(this.adjustRect);
			
			this.setRect();
		},
		setRect: function(){

			this.$el.css({
				left: model.get('left')+'px',
				top: model.get('top')+'px',
				width: model.get('width')+'px',
				height: model.get('height')+'px'
			});
		},
		adjustRect: function(event){
			
			var key;
			
			switch(event.keyCode){
				case 37:	//	Left
					key= event.shiftKey ? 'width': 'left';
					model.save(key, model.get(key)-1);
					break;
				case 38:	//	Up
					key= event.shiftKey ? 'height': 'top';
					model.save(key, model.get(key)-1);
					break;
				case 39:	//	Right
					key= event.shiftKey ? 'width': 'left';
					model.save(key, model.get(key)+1);
					break;
				case 40:	//	Down
					key= event.shiftKey ? 'height': 'top';
					model.save(key, model.get(key)+1);
					break;
				default:
					break;
			}
		}
	}))();

});