require.config({
	urlArgs: '_='+(new Date()).getTime(),
	shim: {
		'socket.io': {
			exports: 'io'
		},
		'exif': {
			deps: ['binaryajax'],
			exports: 'EXIF'
		},
		'canvasResize': {
			deps: ['binaryajax', 'exif'],
			exports: 'canvasResize'
		},
		'jquery.waitAnimation': {
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
		'socket.io': '//133.242.150.215:8080/socket.io/socket.io',
		'binaryajax': 'libs/binaryajax',
		'exif': 'libs/exif',
		'canvasResize': 'libs/canvasResize',
		'jquery': 'libs/jquery-2.0.0.min',
		'jquery.waitAnimation': 'libs/jquery.waitAnimation',
		'underscore': 'libs/underscore-min',
		'backbone': 'libs/backbone-min'
	},
	config: {
		'models/socket': {
			host: '133.242.150.215:8080'
		},
		'models/resize': {
			width: 640,
			height: 640
		},
		'views/image': {
			width: 240,
			height: 240
		}
	}
});

require([
	'jquery',
	'models/resize',
	'models/socket'
], function(
	jquery){

	$(document).ready(function(){

		require([
			'views/image',
			'views/select'
		], function(){
			window.scrollTo(0, 1);
		});
	});		
});
