define([
	'config',
	'backbone',
	'models/album'
], function(
	config,
	Backbone,
	model){
	
	return new (Backbone.View.extend({
		el: $('#album'),
		events: {
		},
		initialize: function(){

			this.listenTo(model, 'change', this.setRect);

/*
			_.bindAll(this, 'adjustRect');
			$(document).keydown(this.adjustRect);
*/
			
			this.setRect();
		},
		setRect: function(){
		
			var top= model.get('top'),
				width= model.get('width'),
				height= model.get('height');

			this.$el.css({
				top: top+'px',
				width: width+'px',
				height: height+'px',
				marginLeft: (-width/2)+'px'
			});
		},
		adjustRect: function(event){
/*
			
			var key;
			
			switch(event.keyCode){
				case 37:	//	Left
					key= event.shiftKey ? 'width': 'left';
					model.set(key, model.get(key)-1);
					break;
				case 38:	//	Up
					key= event.shiftKey ? 'height': 'top';
					model.set(key, model.get(key)-1);
					break;
				case 39:	//	Right
					key= event.shiftKey ? 'width': 'left';
					model.set(key, model.get(key)+1);
					break;
				case 40:	//	Down
					key= event.shiftKey ? 'height': 'top';
					model.set(key, model.get(key)+1);
					break;
				default:
					break;
			}
			
			model.save();
*/
		}
	}))();

});