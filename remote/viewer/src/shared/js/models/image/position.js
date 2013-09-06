define([
	'config',
	'backbone',
	'../images',
	'../page'
], function(
	config,
	Backbone,
	collection,
	page){

	return new (Backbone.Model.extend({
		GAMMA: 0.25,
		LUT_LENGTH: 100,
		DEG_ADJUST: 0,
		initialize: function(){
			this.positions= this._createPositions();
			this.lut= this._createLut();
			this.areaRatios= this._createAreaRatios();			
		},
		_createPositions: function(){
			
			var positions= [],
				templates= config.album.positionTemplates;
				
			_.times(page.NUM_OF_PAGES, function(){
				var position= _.shuffle(templates).pop();
				positions.push(position);
			});
			
			return positions;
		},
		_createLut: function(){
			
			var lut= [];
			
			_.times(this.LUT_LENGTH, function(n){
				
				var dst= Math.pow(n/this.LUT_LENGTH, 1.0/this.GAMMA)
				lut.push(dst);
				
			}, this);
			
			return lut;
		},
		_getAreas: function(){
			
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
		_createAreaRatios: function(){

			var areas= this._getAreas();

			var sumAreas= _.reduce(areas, function(memo, num){ return memo+num; });

			var areaRatios= _.map(areas, function(num){ return num/sumAreas });
			
			var sum= 0;
			
			return _.map(areaRatios, function(num){ sum+=num; return sum; });
			
		},
		_getTargetIndex: function(){
			
			var rand= Math.random(),
				targetIndex= this.areaRatios.length-1;

			_.each(this.areaRatios, function(elem, i){
				if(elem<rand){
					targetIndex= i;
				}
			});

			return targetIndex;
		},
		getInitialPosition: function(heading){

			var	size= config.image.size,
				tableWidth= config.table.size.width,
				tableHeight= config.table.size.height,
				degree,
				radian,
				radius,
				x,
				y,
				rotate;

			degree= heading;
			degree-= this.DEG_ADJUST;
			degree-= Math.floor(degree/360.0)*360.0;
			if(180<degree){
				degree-= 360;
			}			

			radian= (degree/180.0)*Math.PI;

			radius= (function(){
				var getRadius= function(w, h){
						return Math.sqrt(Math.pow(w/2, 2)+Math.pow(h/2, 2));
					};
				return getRadius(tableWidth, tableHeight)+getRadius(size.width, size.height);
			})();
			
			x= tableWidth/2+radius*Math.cos(radian);
			y= tableHeight/2+radius*Math.sin(radian);
			
			//	[-360, 0, 360]+(-180...+180)
			rotate= (_.random(2)*360-1*360)+(Math.random()*360-180);
			
			return {
				left: x,
				top: y,
				skew: 0,
				rotate: rotate
			};
		},
		getRandomPosition: function(){
		
			var margin= config.image.size.width/4;
			
			var targetIndex= this._getTargetIndex();

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
				top: y+margin,
				skew: 0,
				rotate: Math.random()*360-180
			};
		},
		canEnterCurrentPosition: function(model){
		
			var currentPage= page.get('page');

			var models= collection.filter(function(model){
				return model.get('page')===currentPage;
			});
						
			models= _.first(models, page.NUM_OF_IMAGES);
			
			return _.contains(models, model);
		},
		getCurrentPosition: function(model){

			var positions= this.positions[page.get('page')],
				index= page.getIndex(model);
				
			var position= positions[index];
			
			var skews= [2, 4, -4, -2];

			return {
				left: position.left,
				top: position.top,
				skew: skews[index],
				rotate: Math.random()*10-5
			};
		}
	}))();
});