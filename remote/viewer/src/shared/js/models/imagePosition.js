define([
	'./table',
	'./album',
	'backbone'
], function(
	table,
	album,
	Backbone){

	return new (Backbone.Collection.extend({
		initialize: function(){
		
			this.areaRatios= [];
		
			this.listenTo(table, 'change', this.setAreaRatios);
			this.listenTo(album, 'change', this.setAreaRatios);
			
			this.setAreaRatios();
			
			this.random();
		},
		getAreas: function(){
			
			var getArea= function(bottom, top, height){
				return (bottom+top)*height/2;
			};
			
			var tableWidth= table.get('width'),
				tableHeight= table.get('height'),
				albumWidth= album.get('width'),
				albumHeight= album.get('height'),
				albumTop= album.get('top'),
				albumLeft= albumRight= (tableWidth-albumWidth)/2,
				albumBottom= tableHeight-albumTop-albumHeight;
		
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
			
			var targetIndex= this.getTargetIndex();

			var rx= Math.random(),
				ry= Math.random();

			var tableWidth= table.get('width'),
				tableHeight= table.get('height'),
				albumWidth= album.get('width'),
				albumHeight= album.get('height'),
				albumTop= album.get('top'),
				albumLeft= albumRight= (tableWidth-albumWidth)/2,
				albumBottom= tableHeight-albumTop-albumHeight;
				
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
				left: x,
				top: y
			};
		}
	}))();
});