define([
	'eventList',
	'playerList',
	'board',
	'socket'
],
function(eventList, playerList, board, socket){
	var event = {
		name: "doMove",
		handler: function(info){
			var player = playerList[info.activePlayer];
			var nextSpace = board.spaces[info.nextSpace];
			frontEnd.movePlayer(player, nextSpace);
		},
		alert: function(info){
			handler(info);
		},
		endHandler: function(){
			socket.socketSend(this.name);
		},
	};
	eventList.addEvent(event);
});