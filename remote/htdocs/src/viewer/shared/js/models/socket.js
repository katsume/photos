define([
	'config',
	'socket.io',
	'./image',
	'./images'
], function(
	config,
	io,
	Item,
	collection){
	
	var _socket= io.connect(config.socket.host+':'+config.socket.port+'/viewer');

	_socket
		.on('connecting', function(){
			console.log('connecting');
		})
		.on('connect', function(){
			console.log('connect');
	
			if(typeof callback==='function'){
				callback();
			}
		})
		.on('connect_failed', function(){
			console.log('connect_failed');
		})
		.on('post', function(data){
		
			var item= new Item();
		
			item.set({
				id: data.id,
				width: data.width,
				height: data.height,
				data: data.data
			});
		
			collection.add(item);
		})
		.on('trigger', function(data){

			var item= collection.get(data.id);

			item.set('heading', data.heading||0);			
		})
		.on('reconnect', function(){
			console.log('reconnect');
		})
		.on('disconnect', function(){
			console.log('disconnect');
		});
	
});