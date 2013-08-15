var app= require('express')(),
	server= require('http').createServer(app),
	io= require("socket.io").listen(server);

server.listen(8080);

io.enable('browser client minification');
io.enable('browser client etag');
io.enable('browser client gzip');
io.set('log level', 1);

app.get('/', function(req, res){

	console.log(req.query.page);

	if(!req.query.page){
		res.send(404);
		return;
	}

	io.sockets.emit('page', req.query.page);
	res.send(200);

});

io.sockets.on('connection', function(socket){
});
