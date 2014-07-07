var socket;

function initializeSocket() {
	socket = io.connect('7.219.101.137');
	socket.on('chat', function(data) {
		$('#textarea').append(data.message);
		$('#textarea').scrollTop($('#textarea')[0].scrollHeight);
	});
}

$(document).ready(function() {
	
	$('.chat-widget').hide();

	$('#join-chat').click(function() {
		var nickname = $('#nickname').val().trim();
		if(nickname) {
			if(!socket) {
				initializeSocket();
				socket.emit('join', { nickname : nickname });
				$('.chat-widget').show();
				$('#join-chat').html('cambiar nombre');
			} else {
				socket.emit('changename', { nickname : nickname });
			}
		}		
	});

	$('#send-chat').click(function() {
		var message = $('#message').val().trim();
		if(message) {
			socket.emit('clientchat', { message : message });
			$('#message').val('');
		}			
	})

});
