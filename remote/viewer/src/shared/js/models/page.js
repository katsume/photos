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
			this.ids= this._createIds();
		
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
		_createIds: function(){
			
			var ids= [];
			
			_.times(this.NUM_OF_PAGES, function(){
				var page= [];
				_.times(this.NUM_OF_IMAGES, function(){
					page.push(null);
				});
				ids.push(page);
			}, this);

			return ids;
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

				setTimeout(function(that){
					that.set('page', -1);
				}, 500, this);

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
		getIndex: function(model){
		
			var currentPage= this.get('page'),
				currentIndex= this.indexes[currentPage],
				oldId;				

			//	index	
			
			if(currentIndex<this.NUM_OF_IMAGES-1){
				this.indexes[currentPage]= currentIndex+1;
			} else {
				this.indexes[currentPage]= 0;
			}
			
			//	id
			oldId= this.ids[currentPage][currentIndex];
			if(oldId){
				this.trigger('out', oldId);
			}
			this.ids[currentPage][currentIndex]= model.id;

			return currentIndex;
		}
	}))();

});
