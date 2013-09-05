define([
	'config',
	'socket.io',
	'backbone',
	'./image',
	'./page'
], function(
	config,
	io,
	Backbone,
	Image,
	page){

	return new (Backbone.Collection.extend({
		model: Image,
		limit: 100,
		url: function(){
			return '//'+this.host+':'+this.port+'/images?offset='+this.offset+'&limit='+this.limit;
		},
		initialize: function(){
		
			this.offset= 0;
			this.host= config.image.host;
			this.port= config.image.port;

			_.bindAll(this,
				'socketConnectingHandler',
				'socketConnectHandler',
				'socketConnectFailedHandler',
				'socketPostHandler',
				'socketTriggerHandler',
				'socketRecconectHandler',
				'socketDisconnectHandler'
			);
			this.socket= io.connect(this.host+':'+this.port+'/viewer');
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
			console.log(this.host+':'+this.port+' : '+'connecting');
		},
		socketConnectHandler: function(){
			console.log(this.host+':'+this.port+' : '+'connect');
		},
		socketConnectFailedHandler: function(){
			console.log(this.host+':'+this.port+' : '+'connect_failed');
		},
		socketPostHandler: function(data){
			var model= new Image(data);		
			this.add(model);
		},
		socketTriggerHandler: function(data, callback){
			var model= this.get(data.id);

			data.page= page.get('page');

			model.set(data);
			model.trigger('trigger');
			
			this.socket.emit('page', data);
		},
		socketRecconectHandler: function(){
			console.log(this.host+':'+this.port+' : '+'reconnect');
		},
		socketDisconnectHandler: function(){
			console.log(this.host+':'+this.port+' : '+'disconnect');
		}
	}))();
});
