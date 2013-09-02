var db= require('./db');

/*
 *	express
 */
 
var express= require('express'),
	app= express();

app.configure(function(){
	app.use(express.bodyParser());
	app.use(function(req, res, next){
		res.header('Access-Control-Allow-Origin', "*");
		next();
	});
});

app.get('/', function(req, res){
	res.send(200);
});

app.get('/images', db.index);

app.post('/destroy', db.destroy);

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
	.of("/app")
	.on("connection", function(socket){
	
		socket.on("post", function(data, callback){
		
			db.create(data, function(err, id, name){
			
				if(err){
					callback();
					return;
				}
				
				viewer.emit("post", {
					id: id,
					name: name,
					width: data.width,
					height: data.height
				});

				callback(id);
			});
			
		});
		
		socket.on("trigger", function(data){
		
			db.update(data, function(err){
				
				if(err){
				}
				
				viewer.emit("trigger", data);
			});
		});
	});

var viewer= io
	.of("/viewer")
	.on("connection", function(socket){
	});
