define([
	"backbone",
], function(
	Backbone){

	return new (Backbone.Model.extend({
		initialize: function(){
		
			this.on('change:file', function(model, file){			

				if(file){
					this.trigger('select', this, file);
				} else {
					this.trigger('clear', this);
				}

			});
			
			this.on('change:data', function(model, data){

				if(data){
					this.trigger('resize', this, data);
				}

			});
			
			this.on('change:id', function(model, id){
				
				if(id){
					this.trigger('post', this, id);
				}

			});
		}
	}))();
	
});