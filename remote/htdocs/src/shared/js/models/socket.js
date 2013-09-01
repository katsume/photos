define([
	'module',
	'socket.io',
	'./image',
	'./devicesensor'
], function(
	module,
	io,
	image,
	devicesensor){
	
	var _socket= io.connect(module.config().host+'/client');
	
	_socket
		.on('connecting', function(){
			console.log('connecting');
		})
		.on('connect', function(){
			console.log('connect');
		});
	
	image.on('resize', function(model, data){

		if(!data){
			return;
		}

		var width= model.get('width'),
			height= model.get('height');
			
		_socket.emit('post', {
			data: data,
			width: width,
			height: height
		}, function(id){
		
			image.set('id', id);
			
		});
	});
	
	devicesensor.on('throw', function(model, heading){

		_socket.emit('trigger', {
			id: image.get('id'),
			heading: heading
		});
	});
	
});