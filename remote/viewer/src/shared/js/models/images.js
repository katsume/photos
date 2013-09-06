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
		limit: 70,
		url: function(){
			return '//'+this.host+':'+this.port+'/images?offset='+this.offset+'&limit='+this.limit;
		},
		initialize: function(){
		
			this.offset= 0;
			this.host= config.image.host;
			this.port= config.image.port;

			_.bindAll(this,
				'_socketConnectingHandler',
				'_socketConnectHandler',
				'_socketConnectFailedHandler',
				'_socketPostHandler',
				'_socketTriggerHandler',
				'_socketRecconectHandler',
				'_socketDisconnectHandler'
			);
			this.socket= io.connect(this.host+':'+this.port+'/viewer');
			this.socket
				.on('connecting', this._socketConnectingHandler)
				.on('connect', this._socketConnectHandler)
				.on('connect_failed', this._socketConnectFailedHandler)
				.on('post', this._socketPostHandler)
				.on('trigger', this._socketTriggerHandler)
				.on('reconnect', this._socketRecconectHandler)
				.on('disconnect', this._socketDisconnectHandler);

			this.listenTo(page, 'out', this._imageOutHandler);

			this.fetch({
				reset: true,
				cache: false
			});
		},
		_socketConnectingHandler: function(){
			console.log(this.host+':'+this.port+' : '+'connecting');
		},
		_socketConnectHandler: function(){
			console.log(this.host+':'+this.port+' : '+'connect');
		},
		_socketConnectFailedHandler: function(){
			console.log(this.host+':'+this.port+' : '+'connect_failed');
		},
		_socketPostHandler: function(data){
			var model= new Image(data);		
			this.add(model);
		},
		_socketTriggerHandler: function(data, callback){
			var model= this.get(data.id);

			data.page= page.get('page');
			model.set(data);
			model.trigger('trigger', true);
			
			this.socket.emit('page', data);
		},
		_socketRecconectHandler: function(){
			console.log(this.host+':'+this.port+' : '+'reconnect');
		},
		_socketDisconnectHandler: function(){
			console.log(this.host+':'+this.port+' : '+'disconnect');
		},
		_imageOutHandler: function(id){
			setTimeout(function(that){
				that.each(function(model){
					model.trigger('out', id);
				});
			}, 700, this);
		}
	}))();
});
