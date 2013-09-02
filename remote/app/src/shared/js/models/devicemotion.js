define([
	"backbone"
], function(
	Backbone){
			
	return new (Backbone.Model.extend({
		THRESHOLD: 1.25*9.8,
		THRESHOLD2: 3.0*9.8,
		initialize: function(){
			_.bindAll(this, 'devicemotionHandler');
		},
		start: function(){

			this.unset('maxKey');
			this.unset('maxVal');
			this.unset('throwable');

			window.addEventListener("devicemotion", this.devicemotionHandler, false);
		},
		devicemotionHandler: function(event){

			if(!this.get('throwable')){
				return;
			}
	
			var thres= this.THRESHOLD,
				thres2= this.THRESHOLD2,
				acceleration= event.accelerationIncludingGravity,
				x= acceleration.x,
				y= acceleration.y,
				z= acceleration.z,
				maxKey,
				maxVal;
				
			if(	Math.abs(x)>thres2 || Math.abs(y)>thres2 || Math.abs(z)>thres2){
				return;
			}
			
			if(	Math.abs(x)>thres || Math.abs(y)>thres || Math.abs(z)>thres){
						
				if(!this.has('maxKey')){
						
					maxKey= x>(y>z?y:z) ? "x" : (y>z?"y":"z");
					maxVal= acceleration[this.maxKey];
					
					this.set({
						maxKey: maxKey,
						maxVal: maxVal
					});
							
				} else {

					maxKey= this.get('maxKey');
					maxVal= acceleration[maxKey];

					if(this.get('maxVal')<maxVal){
					
						this.set('maxVal', maxVal);

					} else {
					
						this.trigger('devicemotion', this);
						
						this.unset('throwable');

						setTimeout(function(that){
							window.removeEventListener("devicemotion", that.devicemotionHandler, false);
						}, 1000, this);
					}
				}
						
			} else {
			
				this.unset('maxKey');
				this.unset('maxVal');
			}
		}
	}))();
	
});