define([
	"eventList",
	"clickRegion",
	"board",
	"frontEnd"
],
function(eventList, makeClickRegion, board){
	var event = {
		name: "decideMove",
		handler: function(info){
			var spacesClickRegions = [];
			for(var i in info.potentialSpaces){
				var spaceId = info.potentialSpaces[i];
				var space = board.spaces[spaceId];
				var clickRegion = makeClickRegion();
				clickRegion.addCircle(space.x, space.y, 20, function(){
					// test that it gets spaceId
					this.endHandler(spaceId);
				});
				spacesClickRegions.push();
			}
			frontEnd.bindRegions(spacesClickRegions);
		},
		alert: function(info){

		},
		endHandler: function(spaceId){
			socket.socketSend(this.name, {nextSpace: spaceId});
		}
	};
	eventList.addEvent(event);
});