'use strict'

var express = require('express'),
	http = require('http'),
	socketio = require('socket.io');

var app = express(),
	server = http.Server(app),
	io = socketio.listen(server);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/static', express.static(__dirname + '/bower_components'));
app.use('/static', express.static(__dirname + '/public'));

// Fix for wrong Bootstra.386 font folder location
app.use('*/fonts', express.static(__dirname + '/bower_components/bootstra.386/v2.3.1/fonts'));

app.set('view options', {
	layout : false
});

app.get('/', function(req, res) {
	res.render('index');
});

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), function() {

	io.on('connection', function(socket) {

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

	console.log("Server started on port " + app.get('port'));

});