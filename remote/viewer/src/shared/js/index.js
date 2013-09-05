require.config({
	urlArgs: '_='+(new Date()).getTime(),
	shim: {
		'socket.io': {
			exports: 'io'
		},
		'jquery-waitAnimation': {
			deps: ['jquery']
		},
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: ['jquery', 'underscore'],
			exports: 'Backbone'
		}
	},
	paths: {
		'socket.io': '//219.94.250.49:8080/socket.io/socket.io',
		'jquery': 'libs/jquery-2.0.0.min',
		'jquery-waitAnimation': 'libs/jquery-waitAnimation',
		'underscore': 'libs/underscore-min',
		'backbone': 'libs/backbone-min'
	}
});

require([
	'jquery'
], function(
	$){

	$(document).ready(function(){
	
		$(this).keydown(function(event){
			if(event.keyCode!==68){
				return;
			}
			$('body').toggleClass('debug');
		});
	
		require([
			'views/table',
			'views/album',
			'views/images',
			'models/page'
		], function(){
			
		});
	
	});		
});
