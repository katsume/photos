define([
	'config',
	'socket.io',
	'backbone',
	'./image'
], function(
	config,
	io,
	Backbone,
	Image){

	return new (Backbone.Collection.extend({
		model: Image,
		limit: 100,
		url: function(){
			return '//'+config.host+':'+config.port+'/images?offset='+this.offset+'&limit='+this.limit;
		},
		initialize: function(){
		
			this.offset= 0;

			_.bindAll(this, 'socketPostHandler', 'socketTriggerHandler');
			this.socket= io.connect(config.host+':'+config.port+'/viewer');
			this.socket
				.on('connecting', this.socketConnectingHandler)
				.on('connect', this.socketConnectHandler)
				.on('connect_failed', this.socketConnectFailedHandler)
				.on('post', this.socketPostHandler)
				.on('trigger', this.socketTriggerHandler)
				.on('reconnect', this.socketRecconectHandler)
				.on('disconnect', this.socketDisconnectHandler);

			this.fetch({
				reset: true,
				cache: false
			});
		},
		socketConnectingHandler: function(){
			console.log('connecting');
		},
		socketConnectHandler: function(){
			console.log('connect');
	
			if(typeof callback==='function'){
				callback();
			}
		},
		socketConnectFailedHandler: function(){
			console.log('connect_failed');
		},
		socketPostHandler: function(data){

			var model= new Image();
		
			model.set(data);
		
			this.add(model);
		},
		socketTriggerHandler: function(data){

			var model= this.get(data.id);

			model.set(data, {
				isNew: true
			});
		},
		socketRecconectHandler: function(){
			console.log('reconnect');
		},
		socketDisconnectHandler: function(){
			console.log('disconnect');
		}
	}))();
});
