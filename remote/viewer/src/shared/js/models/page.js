define([
	'config',
	'socket.io',
	'backbone'
], function(
	config,
	io,
	Backbone){

	return new (Backbone.Model.extend({
		NUM_OF_PAGES: 10,
		defaults: {
			page: -1
		},
		initialize: function(){
		
			this.host= config.album.host;
			this.port= config.album.port;
		
			_.bindAll(this,
				'socketConnectingHandler',
				'socketConnectHandler',
				'socketConnectFailedHandler',
				'socketPageHandler',
				'socketRecconectHandler',
				'socketDisconnectHandler'
			);
			this.socket= io.connect('//'+this.host+':'+this.port);
			this.socket
				.on('connecting', this.socketConnectingHandler)
				.on('connect', this.socketConnectHandler)
				.on('connect_failed', this.socketConnectFailedHandler)
				.on('page', this.socketPageHandler)
				.on('reconnect', this.socketRecconectHandler)
				.on('disconnect', this.socketDisconnectHandler);
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
		socketPageHandler: function(data){

			var albumPage= Number(data.page);
			
			if(albumPage===-1){
				this.set('page', -1);
			} else {
			
				var virtualPage= this.get('virtualPage');
					
				if(albumPage!==this.get('previousAlbumPage')){
					
					if(virtualPage<this.NUM_OF_PAGES-1){
						virtualPage++;
					} else {
						virtualPage= 0;
					}

					this.set('previousAlbumPage', albumPage);			
					this.set('virtualPage', virtualPage);
				}
				this.set('page', this.get('virtualPage'));
			}
		},
		socketRecconectHandler: function(){
			console.log(this.host+':'+this.port+' : '+'reconnect');
		},
		socketDisconnectHandler: function(){
			console.log(this.host+':'+this.port+' : '+'disconnect');
		}
	}))();

});
