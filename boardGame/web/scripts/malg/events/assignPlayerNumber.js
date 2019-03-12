define(['malg/socket',
	'malg/eventList',
	'malg/client',
	'malg/playerList'
],
function(socket, eventList, client){
	var event = {
		name: "assignPlayerNumber",
		handler: function(){
			if(!client.id){
				client.id = playerList.length;
			}
		},
		alert: function(){},
		endHandler: function(playerName){
			socketSend(this.name, {name:playerName});
		}
	};
	eventList.addEvent(event);
});