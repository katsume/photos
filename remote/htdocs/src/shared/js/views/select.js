define([
	'backbone',
	'models/image'
], function(
	Backbone,
	image){
	
	return new (Backbone.View.extend({
		el: '#select',
		events: {
			'touchstart input[type="file"]': 'touchstart',
			'touchend input[type="file"]': 'touchend',
			'touchcancel input[type="file"]': 'touchend',
			'change input[type="file"]': 'change'
		},
		initialize: function(){
			
			this.listenTo(image, 'select', this.selectHandler);
			this.listenTo(image, 'clear', this.clearHandler);

		},
		touchstart: function(){

			this.$el.addClass('highlighted');

		},
		touchend: function(){

			this.$el.removeClass('highlighted');

		},
		change: function(event){
		
			var file= event.target.files[0];

			image.set('file', file);
			
		},
		selectHandler: function(){

			this.$el.hide();

		},
		clearHandler: function(){
			
			this.$el.show();
		}
	}))();
});