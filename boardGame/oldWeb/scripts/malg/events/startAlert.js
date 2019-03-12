define([
	'malg/eventList',
	'utils/alert',
	'malg/game',
	'malg/playerList',
	'malg/board',
	'malg/socket',
	'malg/client'
],
function(eventList, alert, game, playerList, board, socket, client){
	var event = {
		name: "startAlert",
		handler: function(info){
			alert.down();
			board.spaces = info.board;
			playerList = info.players;
			this.endHandler();
		},
		alert: function(){},
		endHandler: function(){
			socket.socketSend(this.name);
		}
	};
	eventList.addEvent(event);
});
