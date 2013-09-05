define([
	'config',
	'backbone'
], function(
	config,
	Backbone){

	return new (Backbone.Model.extend({
		GAMMA: 0.25,
		LUT_LENGTH: 100,
		initialize: function(){
		
			this.lut= [];
			this.areaRatios= [];
			
			this.createLut();
			this.setAreaRatios();			
		},
		createLut: function(){
			
			_.times(this.LUT_LENGTH, function(n){
				
				var dst= Math.pow(n/this.LUT_LENGTH, 1.0/this.GAMMA)
				this.lut.push(dst);
				
			}, this);
		},
		getAreas: function(){
			
			var getArea= function(bottom, top, height){
				return (bottom+top)*height/2;
			};
			
			var tableWidth= config.table.size.width,
				tableHeight= config.table.size.height,
				albumWidth= config.album.size.width,
				albumHeight= config.album.size.height,
				albumLeft= albumRight= (tableWidth-albumWidth)/2,
				albumTop= albumBottom= (tableHeight-albumHeight)/2;
		
			return [
				getArea(tableWidth, albumWidth, albumTop),
				getArea(tableHeight, albumHeight, albumRight),
				getArea(tableWidth, albumWidth, albumBottom),
				getArea(tableHeight, albumHeight, albumLeft)
			];
		},
		setAreaRatios: function(){

			var areas= this.getAreas();

			var sumAreas= _.reduce(areas, function(memo, num){ return memo+num; });

			var areaRatios= _.map(areas, function(num){ return num/sumAreas });
			
			var sum= 0;
			
			this.areaRatios= _.map(areaRatios, function(num){ sum+=num; return sum; });				

		},
		getTargetIndex: function(){
			
			var rand= Math.random(),
				targetIndex= this.areaRatios.length-1;

			_.each(this.areaRatios, function(elem, i){
				if(elem<rand){
					targetIndex= i;
				}
			});

			return targetIndex;
		},
		random: function(){
		
			var margin= config.image.size.width/4;
			
			var targetIndex= this.getTargetIndex();

			var rx= Math.random();
				ry= this.lut[Math.floor(Math.random()*this.LUT_LENGTH)];

			var tableWidth= config.table.size.width-margin*2,
				tableHeight= config.table.size.height-margin*2,
				albumWidth= config.album.size.width,
				albumHeight= config.album.size.height,
				albumLeft= albumRight= (tableWidth-albumWidth)/2,
				albumTop= (tableHeight-albumHeight)/2,
				albumBottom= (tableHeight-albumHeight)/2;

/*
			var tableWidth= table.get('width')-margin*2,
				tableHeight= table.get('height')-margin*2,
				albumWidth= album.get('width')+margin*2,
				albumHeight= album.get('height')+margin*2,
				albumTop= album.get('top')-margin*2,
				albumLeft= albumRight= (tableWidth-albumWidth)/2,
				albumBottom= tableHeight-albumTop-albumHeight;
*/
				
			var tmpWidth,
				tmpHeight;
				
			var x, y;

			if(targetIndex===0){
			
				tmpHeight= albumTop;
				y= tmpHeight*ry;

				tmpWidth= albumWidth+(tableWidth-albumWidth)*(1-ry);
				x= tmpWidth*rx+albumLeft*ry;

			} else if(targetIndex===1){
			
				tmpWidth= albumRight;
				x= albumLeft+albumWidth+tmpWidth*(1-ry);
				
				tmpHeight= albumHeight+(tableHeight-albumHeight)*(1-ry);
				y= tmpHeight*rx+albumTop*ry;
				
			} else if(targetIndex===2){

				tmpHeight= albumBottom;
				y= albumTop+albumHeight+tmpHeight*(1-ry);
				
				tmpWidth= albumWidth+(tableWidth-albumWidth)*(1-ry);
				x= tmpWidth*(1-rx)+albumLeft*ry;

			} else {
			
				tmpWidth= albumLeft;
				x= tmpWidth*ry;
				
				tmpHeight= albumHeight+(tableHeight-albumHeight)*(1-ry);
				y= tmpHeight*(1-rx)+albumTop*ry;
			}
			
			return {
				left: x+margin,
				top: y+margin
			};
		}
	}))();
});