define(['malg/eventList', 'malg/frontEnd', 'malg/socket'] ,function(eventList, frontEnd, socket){
	var event = {
		name:"readyUp",
		handler:function(){
			frontEnd.readyUpAlert();
		},
		alert:function(){},
		endHandler:function(){
			socket.socketSend(this.name);
		}
	};
	eventList.add(event);
});