var io= require("socket.io").listen(8080);
var Puid= require("puid");

io.enable('browser client minification');
io.enable('browser client etag');
io.enable('browser client gzip');
io.set('log level', 1);

var client= io
	.of("/client")
	.on("connection", function(socket){
	
		socket.on("post", function(data, callback){
		
			data.id= (new Puid()).generate();

			viewer.emit("post", data);

			callback(data.id);
		});
		
		socket.on("trigger", function(data){
			viewer.emit("trigger", data);
		});
	});

var viewer= io
	.of("/viewer")
	.on("connection", function(socket){
	});
