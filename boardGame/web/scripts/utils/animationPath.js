define([
	'animation',
	'vector'
],
function(makeAnimation, makeNewVector){
	return function(start, end, endCall){
		var location = start;
		var path = makeAnimation(
			// oneframe
			function(){
				var vector = makeNewVector(end.x, end.y, location.x, location.y);
				vector.scale(vector.distance() - 2);
				
			},
			endCall
		);
	};
});