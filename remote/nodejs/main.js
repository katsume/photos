var PATH= '../htdocs/post_images/';

var fs= require('fs'),
	db= require('./db');

var parseDataURL= function(string){
	if(/^data:.+\/(.+);base64,(.*)$/.test(string)){
		return {
			ext: RegExp.$1,
			data: new Buffer(RegExp.$2, 'base64')
		};
	}
	return;
};

/*
 *	express
 */
 
var express= require('express'),
	app= express();

/*
app.configure(function(){
	app.use(express.bodyParser());
});
*/

app.get('/', function(req, res){
	res.send(200);
});

app.get('/images', db.index);

app.get('/destroy', db.destroy);

app.get('*', function(req, res){
	res.send(404);
});

/*
 *	http
 */
 
var server= require('http').createServer(app).listen(8080);

/*
 *	socket.io
 */
 
var io= require('socket.io').listen(server);

io.enable('browser client minification');
io.enable('browser client etag');
io.enable('browser client gzip');
io.set('log level', 1);

var client= io
	.of("/client")
	.on("connection", function(socket){
	
		socket.on("post", function(data, callback){
		
			var id= db.create({
				width: data.width,
				height: data.height
			});
			
			data.id= id;
			viewer.emit("post", data);

			callback(id);
			
			var parsedData= parseDataURL(data.data);

			fs.writeFile(PATH+id+'.'+parsedData.ext, parsedData.data,
				function(err){
				}
			);
		});
		
		socket.on("trigger", function(data){
			viewer.emit("trigger", data);
		});
	});

var viewer= io
	.of("/viewer")
	.on("connection", function(socket){
	});
