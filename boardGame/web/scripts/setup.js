
// ======================================================
//
// INITIAL INIT THINGS
//
// ======================================================
var socket = makeSocket();


// ======================================================
//
// FRONT END THINGS
//
// ======================================================
// var frontEnd = makeFrontEnd($("canvas").get(0).getContext("2d"));
frontEnd.ctx = ctx;
frontEnd.logHolder = $("#logHolder");
frontEnd.tokenTracker = $("#tokenTracker");
frontEnd.canLib = new CanvasLibrary(frontEnd.ctx);

frontEnd.logHolder.addEventListener("webkitAnimationEnd", function(){
	logHolder.style.animationName = "";
}, false);

frontEnd.ctx.canvas.width = window.innerWidth * 0.69;
frontEnd.ctx.canvas.height = window.innerHeight - 10;

frontEnd.register("fixBoard", function(){

});

	// draws the board and all the players
frontEnd.register("drawBoard", function(){
	frontEnd.fixBoard();
	var ctx = this.ctx;
	var boardTenth = this.boardTenth;
	var spacesArray = this.spacesArray;
	var players = this.players;
	var carpathia = this.carpathia;
	var startSpot = this.startSpot;
	this.canLib.canvasColor("#ccc");

	ctx.font = (10*boardTenth/8) + "px Courier New";
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#FFF";
	ctx.strokeText("LEFT BEHIND", startSpot.x + boardTenth * 1.5, startSpot.y + boardTenth * 4);

	for(var i in board)
	{
		board[i].draw();
	}
	for(i = 0; i < players.length; i++){
		players[i].space.draw();
		players[i].drawPlayer();
	}
});

frontEnd.register("drawArrow", function (space, angle, hovering){
// x and y and center of space, and hovering for mouse events
	var canvLib = this.canLib;
	var ctx = this.ctx;
	canLib.drawDiscatCenter(space.getX(), space.getY(), spaceWidth/12*5, (hovering ? "#FFF" : "#000"));
	ctx.beginPath();
	points = [
		{x: spaceWidth/-4, y: spaceWidth/4},
		{x: spaceWidth/8, y: spaceWidth/4},
		{x: spaceWidth/8, y: spaceWidth/8*3},
		{x: spaceWidth/8*3, y: 0},
		{x: spaceWidth/8, y: spaceWidth/-8*3},
		{x: spaceWidth/8, y: spaceWidth/-4},
		{x: spaceWidth/-4, y: spaceWidth/-4}
	];
	pointAngle = game.angleToOrigin({x:0,y:0}, points[0]) + angle;
	pointRadius = Math.sqrt(Math.pow(points[0].x, 2) + Math.pow(points[0].y, 2));
	ctx.moveTo(space.getX()+pointRadius*Math.cos(pointAngle), space.getY()+pointRadius*Math.sin(pointAngle));
	for(i = 1; i < points.length; i++)
	{
		// pointAngle = Math.atan((points[i].y)/(points[i].x))+angle;
		pointAngle = game.angleToOrigin({x:0,y:0}, points[i]) + angle;
		pointRadius = Math.sqrt(Math.pow(points[i].x,2)+Math.pow(points[i].y,2));
		ctx.lineTo(space.getX()+pointRadius*Math.cos(pointAngle), space.getY()+pointRadius*Math.sin(pointAngle));
	}
	ctx.closePath();
	ctx.fillStyle = hovering ? "#000" : "#FFF";
	ctx.fill();
});

// ======================================================
//
// PROPERTY THINGS
//
// ======================================================
var resolver = makeResolver();

resolver.addProps({
	'gameURL' : '/malg'
});


// ======================================================
//
// EVENTS THINGS
//
// ======================================================
var eventList = makeEventList();
eventList.makeAndAdd("assignNum",
	function(info){
		// handler function
		game.clientNum = info.players[0];
	},
	function(info){},
	function(info){
		socket.socketSend(this.name, {name : game.clientName});
	}
);

eventList.makeAndAdd("readyUp",
	function(info){
		// handler function
		game.clientNum = info.players[0];
	},
	function(info){},
	function(info){
		socket.socketSend(this.name, {name : game.clientName});
	}
);

// ======================================================
//
// OTHER THINGS
//
// ======================================================
var clickRegionList = makeClickRegionList();


// ======================================================
//
// FINAL THINGS
//
// ======================================================
socket.init();
