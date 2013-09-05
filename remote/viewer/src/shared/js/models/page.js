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
		NUM_OF_IMAGES: 4,
		defaults: {
			virtualPage: 0,
			page: 0
		},
		initialize: function(){
				
			this.host= config.album.host;
			this.port= config.album.port;
			this.indexes= this._createIndexes();
		
			_.bindAll(this,
				'_socketConnectingHandler',
				'_socketConnectHandler',
				'_socketConnectFailedHandler',
				'_socketPageHandler',
				'_socketRecconectHandler',
				'_socketDisconnectHandler'
			);
			this.socket= io.connect('//'+this.host+':'+this.port);
			this.socket
				.on('connecting', this._socketConnectingHandler)
				.on('connect', this._socketConnectHandler)
				.on('connect_failed', this._socketConnectFailedHandler)
				.on('page', this._socketPageHandler)
				.on('reconnect', this._socketRecconectHandler)
				.on('disconnect', this._socketDisconnectHandler);
		},
		_createIndexes: function(){
			
			var indexes= [];

			_.times(this.NUM_OF_PAGES, function(){
				indexes.push(0);
			});
			
			return indexes;
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
		_socketPageHandler: function(data){

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
		_socketRecconectHandler: function(){
			console.log(this.host+':'+this.port+' : '+'reconnect');
		},
		_socketDisconnectHandler: function(){
			console.log(this.host+':'+this.port+' : '+'disconnect');
		},
		getIndex: function(){
		
			var currentPage= this.get('page'),
				currentIndex= this.indexes[currentPage];
				
			if(currentIndex<this.NUM_OF_IMAGES-1){
				currentIndex++;
			} else {
				currentIndex= 0;
			}
			
			this.indexes[currentPage]= currentIndex;
		
			return currentIndex;
		}
	}))();

});
