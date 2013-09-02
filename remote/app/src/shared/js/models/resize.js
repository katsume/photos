define([
	'module',
	'canvasResize',
	'./image'
], function(
	module,
	canvasResize,
	image){
	
	image.on('select', function(model, file){

		var config= module.config();
					
		canvasResize(file, {
			width: config.width,
			height: config.height,
			callback: function(data, width, height){

				image.set({
					data: data,
					width: width,
					height: height
				});
			}
		});
	});
});
