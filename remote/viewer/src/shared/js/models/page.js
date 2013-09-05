define([
	'socket.io',
	'backbone'
], function(
	io,
	Backbone){

	return new (Backbone.Model.extend({
		initialize: function(){
		
			this.on('change:page', function(model, value){
				console.log("change : "+value);
			});

			_.bindAll(this, 'socketPageHandler');
			this.socket= io.connect('//localhost:8080');
			this.socket
				.on('connecting', this.socketConnectingHandler)
				.on('connect', this.socketConnectHandler)
				.on('connect_failed', this.socketConnectFailedHandler)
				.on('page', this.socketPageHandler)
				.on('reconnect', this.socketRecconectHandler)
				.on('disconnect', this.socketDisconnectHandler);
		},
		socketConnectingHandler: function(){
			console.log('connecting');
		},
		socketConnectHandler: function(){
			console.log('connect');
		},
		socketConnectFailedHandler: function(){
			console.log('connect_failed');
		},
		socketPageHandler: function(data){

			var page= Number(data.page);
			
			if(page===-1){
				this.set('flipping', true);
			} else {
				this.set('page', page);
				this.set('flipping', false);
			}
		},
		socketRecconectHandler: function(){
			console.log('reconnect');
		},
		socketDisconnectHandler: function(){
			console.log('disconnect');
		}
	}))();

});