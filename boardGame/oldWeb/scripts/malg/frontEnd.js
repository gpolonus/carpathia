define([
	'frontEndProto',
	'alert',
	'jquery',
	'eventList',
	'animation',
	'board',
	'canvas'
],
function(frontEnd, alert, $, eventList, makeAnimation, board, canvas){
	frontEnd.register("readyUpAlert",function(){
		var coverFunction = function($cover){};
		var containerFunction = function($container){
			$container.css("background-color", "purple");
			var html = "<h2 style='color:white'>Are you ready?</h2><br><button style='font-size:50px' id='readyButton'>HELL YEAH</button>";
			$container.html(html);
			$("#readyButton").on("click",function(){
				$container.html("<h3 style='white'>Waiting on other players</h3>");
				eventList.endHandler("readyUp");
			});
		};
		alert.up();
	});

	frontEnd.register("fixBoard", function(){

	});

		// draws the board and all the players
	// frontEnd.register("drawBoard", function(){
	// 	frontEnd.fixBoard();
	// 	var ctx = this.ctx;
	// 	var boardTenth = this.boardTenth;
	// 	var spacesArray = this.spacesArray;
	// 	var players = this.players;
	// 	var carpathia = this.carpathia;
	// 	var startSpot = this.startSpot;
	// 	this.canLib.canvasColor("#ccc");

	// 	ctx.font = (10*boardTenth/8) + "px Courier New";
	// 	ctx.lineWidth = 2;
	// 	ctx.strokeStyle = "#FFF";
	// 	ctx.strokeText("LEFT BEHIND", startSpot.x + boardTenth * 1.5, startSpot.y + boardTenth * 4);

	// 	for(var i in board)
	// 	{
	// 		board[i].draw();
	// 	}
	// 	for(i = 0; i < players.length; i++){
	// 		players[i].space.draw();
	// 		players[i].drawPlayer();
	// 	}
	// });

	// frontEnd.register("drawArrow", function (space, angle, hovering){
	// // x and y and center of space, and hovering for mouse events
	// 	var canvLib = this.canLib;
	// 	var ctx = this.ctx;
	// 	canLib.drawDiscatCenter(space.getX(), space.getY(), spaceWidth/12*5, (hovering ? "#FFF" : "#000"));
	// 	ctx.beginPath();
	// 	points = [
	// 		{x: spaceWidth/-4, y: spaceWidth/4},
	// 		{x: spaceWidth/8, y: spaceWidth/4},
	// 		{x: spaceWidth/8, y: spaceWidth/8*3},
	// 		{x: spaceWidth/8*3, y: 0},
	// 		{x: spaceWidth/8, y: spaceWidth/-8*3},
	// 		{x: spaceWidth/8, y: spaceWidth/-4},
	// 		{x: spaceWidth/-4, y: spaceWidth/-4}
	// 	];
	// 	pointAngle = game.angleToOrigin({x:0,y:0}, points[0]) + angle;
	// 	pointRadius = Math.sqrt(Math.pow(points[0].x, 2) + Math.pow(points[0].y, 2));
	// 	ctx.moveTo(space.getX()+pointRadius*Math.cos(pointAngle), space.getY()+pointRadius*Math.sin(pointAngle));
	// 	for(i = 1; i < points.length; i++)
	// 	{
	// 		// pointAngle = Math.atan((points[i].y)/(points[i].x))+angle;
	// 		pointAngle = game.angleToOrigin({x:0,y:0}, points[i]) + angle;
	// 		pointRadius = Math.sqrt(Math.pow(points[i].x,2)+Math.pow(points[i].y,2));
	// 		ctx.lineTo(space.getX()+pointRadius*Math.cos(pointAngle), space.getY()+pointRadius*Math.sin(pointAngle));
	// 	}
	// 	ctx.closePath();
	// 	ctx.fillStyle = hovering ? "#000" : "#FFF";
	// 	ctx.fill();
	// });

	frontEnd.movePlayer = function(player, nextSpace){
		var location = player;
		var end = nextSpace;
		var animation = makeAnimation(
			// oneFrame
			function(){
				var vector = makeNewVector(end.x, end.y, location.x, location.y);
				vector.scale(vector.distance() - 2);
				player.x = vector.final.x;
				player.y = vector.final.y;
				canvas.drawPlayer(player);
				if(vector.distance() < 2)
					return true;
				return false;
			},
			// endCall
			function(){
				player.space = nextSpace;
				eventList.endHandler("doMove");
			}
		);
	};

	return frontEnd;
});