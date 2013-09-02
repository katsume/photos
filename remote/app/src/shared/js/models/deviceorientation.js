define([
	'backbone'
], function(
	Backbone){

	return new (Backbone.Model.extend({
		initialize: function(){
			_.bindAll(this, 'deviceorientationHandler');			
		},
		start: function(){
		
			this.unset('orientation');
		
			window.addEventListener("deviceorientation", this.deviceorientationHandler, false);
		},
		deviceorientationHandler: function(event){
			this.set('orientation', event.webkitCompassHeading/*+7*/);
		},
		stop: function(){
			window.removeEventListener("deviceorientation", this.deviceorientationHandler, false);		
		}
	}))();

});