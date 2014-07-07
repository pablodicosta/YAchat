'use strict'

var express = require('express'),
	socketio = require('socket.io');

var app = express.createServer(),
	io = socketio.listen(app);

app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.use(express.static(__dirname + '/public'));
});

app.set('view options', {
	layout : false
});

app.get('/', function(req, res) {
	res.render('index');
});

app.listen(3000);

io.sockets.on('connection', function(socket) {

	socket.on('join', function(data) {
		socket.nickname = data.nickname;
		socket.emit('chat', { message : socket.nickname + ' ha entrado...\n' });
		socket.broadcast.emit('chat', { message : socket.nickname + ' ha entrado...\n' });
	});

	socket.on('changename', function(data) {
		var oldname = socket.nickname;
		socket.emit('chat', { message : oldname + ' ha cambiado el nombre a ' + data.nickname + '\n' });
		socket.broadcast.emit('chat', { message : oldname + ' ha cambiado el nombre a ' + data.nickname + '\n' });		
		socket.nickname = data.nickname;
	});

	socket.on('clientchat', function(data) {
		var message = socket.nickname + ': ' + data.message + '\n';
		socket.emit('chat', { message : message });
		socket.broadcast.emit('chat', { message : message });
	});

	socket.on('disconnect', function(data) {
		if(socket.nickname) 
			socket.broadcast.emit('chat', { message : socket.nickname + ' ha salido...' + '\n' });		
	});

});
