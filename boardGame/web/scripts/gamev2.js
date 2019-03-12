var game = {
	// init stuff
	ctx : null,
	tokenTracker : null,
	logHolder : null,
	canLib : null,
	utiLib : new UtilityLibrary(),
	winner : false,
	carpathia : null,
	spaceWidth : -1,
	startSpot : {},
	clientName : null,
	clientNum : -1,
	started : false,
	unleashed : false,
	diceImages : [],
	carpathiaWords : ["car","pat","hia"],
	carpathiaDice : [],
	devilFace : new Image(),
	boardImage : new Image(),
	boardImageI : new Image(),
	spacesArray : [],
	players : [],
	activePlayer : null,

	init: function(context, logHolder, tokenTracker){

		this.ctx = context;
		this.logHolder = logHolder;
		this.tokenTracker = tokenTracker;
		this.canLib = new CanvasLibrary(this.ctx);

		this.logHolder.addEventListener("webkitAnimationEnd", function(){
			logHolder.style.animationName = "";
		}, false);

		this.ctx.canvas.width = window.innerWidth * 0.69;
		this.ctx.canvas.height = window.innerHeight - 10;

		for(var i = 0; i < 6; i++){
			this.diceImages[i] = new Image();
			this.diceImages[i].src = "images/" + (i+1) + ".png";
		}

		for(var i = 0 ; i < 3; i++)
		{
			this.carpathiaDice[i] = [];
			for(var j = 0; j < 4; j++){
				this.carpathiaDice[i].push(new Image());
				this.carpathiaDice[i][j].src = "images/" + this.carpathiaWords[i] + "" + j + ".png";
			}
		}

		this.devilFace.src = "images/devil.png";
		this.boardImage.src = "images/board.png";
		this.boardImageI.src ="images/boardi.png";
	},

	fixBoard : function()
	{
		var ctx = this.ctx;
		var logHolder = this.logHolder;
		var tokenTracker = this.tokenTracker;
		$(ctx.canvas).css("width", (""+window.innerWidth * 0.69).split(".")[0] + "px");
		$(ctx.canvas).css("height", window.innerHeight - 10 + "px");
		$(tokenTracker).css("height", parseInt($(ctx.canvas).css("height")) * 0.1 + "px");
		$(logHolder).css("height", parseInt($(ctx.canvas).css("height")) * 0.9 + "px");
		this.startSpot = {x: 0, y: 0};
		if(ctx.canvas.width > ctx.canvas.height)
		{
			this.startSpot.x = (ctx.canvas.width - ctx.canvas.height) / 2;
			if(this.spaceWidth == -1)
				this.spaceWidth = ctx.canvas.height / (11);
			this.boardTenth = ctx.canvas.height / (11);
		}
		else
		{
			this.startSpot.y = (ctx.canvas.height - ctx.canvas.width) / 2;
			if(this.spaceWidth == -1)
				this.spaceWidth = ctx.canvas.width / (11);
			this.boardTenth = ctx.canvas.width / (11);
		}
	},

	drawCarpathiaDieOnce : function(place, isThisADie, hovering, failure)
	{
		var ctx = this.ctx;
		var canLib = this.canLib;
		var boardTenth = this.boardTenth;
		var carpathiaDice = this.carpathiaDice;
		var start = {x: ctx.canvas.width/2 - 4*boardTenth + place*boardTenth*3, y:ctx.canvas.height/2 - boardTenth};
		if(hovering){
			canLib.drawRectangle(start.x - boardTenth*0.09, start.y - boardTenth*0.09, boardTenth*2.18, boardTenth*2.18, "#f00");
			canLib.drawRectangle(start.x - boardTenth*0.06, start.y - boardTenth*0.06, boardTenth*2.12, boardTenth*2.12, "#ff5c00");
			canLib.drawRectangle(start.x - boardTenth*0.03, start.y - boardTenth*0.03, boardTenth*2.06, boardTenth*2.06, "#ff0");
		}
		else{
			canLib.drawRectangle(start.x - boardTenth*0.09, start.y - boardTenth*0.09, boardTenth*2.18, boardTenth*2.18, "white");
			canLib.drawRectangle(start.x - boardTenth*0.06, start.y - boardTenth*0.06, boardTenth*2.12, boardTenth*2.12, "black");
			canLib.drawRectangle(start.x - boardTenth*0.03, start.y - boardTenth*0.03, boardTenth*2.06, boardTenth*2.06, "white");
		}

		if(isThisADie)
			ctx.drawImage(carpathiaDice[place][Math.round(Math.random()*3)], start.x, start.y, boardTenth*2, boardTenth*2);
		else
			canLib.drawRectangle(start.x, start.y, boardTenth*2, boardTenth*2, "black");

		if(failure)
		{
			var old = ctx.lineWidth;
			ctx.lineWidth = 5;
			ctx.strokeStyle = "#800";
			ctx.beginPath();
			ctx.arc(start.x + boardTenth, start.y + boardTenth*1.08, boardTenth/2, 0, Math.PI*2);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(start.x + boardTenth*1.5, start.y + boardTenth*0.58);
			ctx.lineTo(start.x + boardTenth*0.5, start.y + boardTenth*1.58);
			ctx.stroke();
			ctx.strokeStyle = "#f00";
			ctx.beginPath();
			ctx.arc(start.x + boardTenth, start.y + boardTenth, boardTenth/2, 0, Math.PI*2);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(start.x + boardTenth*1.5, start.y + boardTenth*0.5);
			ctx.lineTo(start.x + boardTenth*0.5, start.y + boardTenth*1.5);
			ctx.stroke();
			ctx.lineWidth = old;
		}
	},

	drawCarpathiaDie : function(place, isThisADie)
	{
		var ctx = this.ctx;
		var canLib = this.canLib;
		var boardTenth = this.boardTenth;
		var start = {x: ctx.canvas.width/2 - 4*boardTenth + place*boardTenth*3, y:ctx.canvas.height/2 - boardTenth};
		var ga = ctx.globalAlpha;
		ctx.globalAlpha = 0.5;
		if(isThisADie)
			ctx.drawImage(this.carpathiaDice[place][Math.round(Math.random()*3)], start.x, start.y, boardTenth*2, boardTenth*2);
		else
			canLib.drawRectangle(start.x, start.y, boardTenth*2, boardTenth*2, "black");
		ctx.globalAlpha = ga;
	},

	getScaler : function()
	{
		var ctx = this.ctx;
		return {x: parseInt($(ctx.canvas).css("width"))/ctx.canvas.width, y: parseInt($(ctx.canvas).css("height"))/ctx.canvas.height};
	},

	angleToOrigin : function(init, finl)
	{
		var multiplier = 1;
		if(finl.y < init.y)
			multiplier = -1;
		var dot = (finl.x - init.x)*(100);
		var distance = Math.sqrt((finl.x - init.x)*(finl.x - init.x) + (finl.y - init.y)*(finl.y - init.y));
		return multiplier * Math.acos(dot/(distance * 100));
	},

	// draws the board and all the players
	drawBoard : function()
	{
		this.fixBoard();
		var ctx = this.ctx;
		var boardTenth = this.boardTenth;
		var spacesArray = this.spacesArray;
		var players = this.players;
		var carpathia = this.carpathia;
		var startSpot = this.startSpot;
		// this.canLib.whiteCanvas();
		this.canLib.canvasColor("#ccc");

		// if(!unleashed)
		// 	ctx.drawImage(this.boardImage, startSpot.x, startSpot.y, boardTenth*(11), boardTenth*(11));
		// else
		// 	ctx.drawImage(this.boardImageI, startSpot.x, startSpot.y, boardTenth*(11), boardTenth*(11));

		ctx.font = (10*boardTenth/8) + "px Courier New";
		// ctx.strokeStyle = unleashed ? "black" : "white";
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#FFF";
		ctx.strokeText("LEFT BEHIND", startSpot.x + boardTenth * 1.5, startSpot.y + boardTenth * 4);
		
		for(var i = 0; i < spacesArray.length; i++)
		{
			spacesArray[i].draw(false);
		}
		for(var i = 0; i < players.length; i++){
			players[i].space.draw(true);
			players[i].drawPlayer();
		}

		// if(unleashed && carpathia.space)
		// {
		// 	carpathia.space.draw(true);
		// 	carpathia.drawPlayer();
		// }
	},

	determineNextSpace : function()
	{
		var players = this.players;
		var clientNum = this.clientNum;
		var ctx = this.ctx;
		var utiLib = this.utiLib;
		var p = players[clientNum];
		var spaceWidth = this.spaceWidth;
		var canLib = this.canLib;
		$(ctx.canvas).on("mousemove", function(){
			for(var i in p.space.nbs)
			{
				if(utiLib.distance(event.layerX, event.layerY, p.space.nbs[i].getX(), p.space.nbs[i].getY()) < spaceWidth/12*5)
					hovering = true;
				else
					hovering = false;

				drawArrow(
					p.space.nbs[i], 
					(new Vector(
						p.space.getX(), 
						p.space.getY(), 
						p.space.nbs[i].getX(), 
						p.space.nbs[i].getY()
					).angleToOrigin()),
					hovering
				);
			}
		});

		$(ctx.canvas).on("click", function(){
			for(var i in p.space.nbs)
			{
				if(utiLib.distance(event.layerX, event.layerY, p.space.nbs[i].getX(), p.space.nbs[i].getY()) < spaceWidth)
				{
					socket.socketBasicSend("direction", p.space.nbs[i].id, game.roll);
					break;
				}
			}
		});

		// x and y and center of space, and hovering for mouse events
		function drawArrow(space, angle, hovering)
		{
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
		}
	},

	playerOnSpace : function(space){
		for(var i = 0; i < this.players.length; i++)
			if(space.id == this.players[i].space.id)
				return i;
		return -1;
	},

	turnStart : function()
	{
		var clientNum = this.clientNum;
		var player = this.players;

		if(players[clientNum].tokens < 0 && !players[clientNum].dead){
			socket.send("died~" + clientNum + "~" + ((clientNum+1)%players.length) + "~");
			return;
		}
		else if(players[clientNum].tokens > 0 && players[clientNum].dead)
			socket.send("alived~"+ clientNum + "~");

		players[clientNum].roll();
	},

	prepTurnEnd : function()
	{
		var clientNum = this.clientNum;
		var boardTenth = game.boardTenth;
		setTimeout( function(){
			$(".coverContainerContents").css("background-color", "#fff");
			$(".cover").css("background-color", "#000");
			$(".coverContainerContents").html(""+
				"<ul>"+
					"<li><h2><span class='name" + clientNum + "'>" + clientName + "</span>, are you ready to finish your turn?</h2></li>"+
					"<li><button id='endTurnButton' class='bigButton'>Sure</button></li>"+
				"</ul>"+
			"");
			$(".coverContainer h2").css("color", "#000");
			$("#endTurnButton").css("font-size", boardTenth + "px");
			$(".cover, .coverContainer").css("display","block");
			$("#endTurnButton").focus();
			$("#endTurnButton").on("keyup", function(){
				if(event.which != 32)
					return;
				$("#endTurnButton").off("click");
				$("#endTurnButton").off("keyup");
				$(".cover, .coverContainer").css("display","none");
				socket.socketSendWithNum("turnEnd");
			});

			$("#endTurnButton").on("click", function(){
				$("#endTurnButton").off("click");
				$("#endTurnButton").off("keyup");
				$(".cover, .coverContainer").css("display","none");
				socket.socketSendWithNum("turnEnd");
			});
		}, 2000);
	},

	turnEnd : function()
	{
		var players = this.players;
		var result = this.winning();
		var unleashed = this.unleashed;
		var clientNum = this.clientNum;
		if(result === false){
			var alive = false;
			for(var i = 0; i < players.length; i++)
			{
				$("#playerTokens" + i).html(players[i].tokens);
				if(!players[i].dead)
					alive = true;
			}
			if(!alive && unleashed)
			{
				socket.send("allDead~");
			}
			else
				socket.send("yourTurn~" + (clientNum+1)%players.length + "~");
		}
		else{
			socket.send("winner~" + result + "~");
		}
	},

	displayWinner : function(num)
	{
		var players = this.players;
		$(".coverContainerContents").css("background-color", "#000");
		$(".coverContainerContents").css("color", "#fff");
		$(".coverContainerContents").html(""+
			"<ul>"+
				"<li><h1><span class='name" + num + "'>" + players[num].name + "</span></h1></li>"+
				"<li><h2>IS THE WINNER</h2></li>"+
				"<li><h3>FUCK THE REST OF YOU</h3></li>"+
			"</ul>"+
		"");
		$(".coverContainerContents h1").css("color", "#fff");
		$(".coverContainerContents h2").css("color", "#fff");
		$(".coverContainerContents h3").css("color", "#fff");
		$(".cover, .coverContainer").css("display","block");
	},

	winning : function()
	{
		return this.winner;
	},

	addToLogger : function(str)
	{
		var players = this.players;
		var clientNum = this.clientNum;
		var logHolder = this.logHolder;

		function updateStr(text, clas)
		{
			str = str.replace(new RegExp(text, "g"), "<span class='" + clas + "'>" + text + "</span>");
		}

		for(var i = 0; i < players.length; i++)
			if(players[i].dead)
				str = str.replace(new RegExp(players[i].name, "g"), "<span class='name" + i + "'>💀" + players[i].name + "💀</span>");
			else
				str = str.replace(new RegExp(players[i].name, "g"), "<span class='name" + i + "'>" + players[i].name + "</span>");
		updateStr("You", "name" + clientNum);
		updateStr("rolled", "rolled");
		updateStr("token", "token");
		// str = str.replace(new RegExp("^"+clientName, "g"), "You");

		$(logHolder).html("<p>" + str + "</p><hr />" + $(logHolder).html());
		logHolder.style.animationName = "flashLoggerMessage";
	},

	animationList : {
		list : [],
		going : false,
		push : function(functionCall){
			list.push(functionCall);
			if(!going)
				this.next();
		},
		next : function(){
			going = true;
			if(list.length != 0)
				list.splice(0,1)();
			else
				going = false;
		}
	}
};

// returns a player object
function GetNewPlayer(num, name, color, space){

	var player = {
		num : num,
		name : name,
		image : new Image(),
		dead : false,
		// image.src : "images/piece" + num + ".png",
		space : space == undefined ? game.spacesArray[Math.floor((game.spacesArray.length-1) * Math.random())] : game.spacesArray[space],
		// x : this.space.x,
		// y : this.space.y,
		tokens : 0,
		ready : false,
		color : color,

		init : function()
		{
			this.image.src = "images/nc.png";
			this.x = this.space.x;
			this.y = this.space.y;
		},

		getX : function(player){
			player = player == undefined ? game.activePlayer : player;
			return this.x - player.x + game.ctx.canvas.width/2;
		},

		getY : function(player){
			player = player == undefined ? game.activePlayer : player;
			return this.y - player.y + game.ctx.canvas.height/2;
		},

		// puts a roll animation on the screen and rolls dice
		roll : function()
		{
			var ctx = game.ctx;
			var rolling = true;
			var diceImages = game.diceImages;
			var clientNum = game.clientNum;
			var canLib = game.canLib;

			var point = {x: ctx.canvas.width/2 - game.boardTenth*1.5 + game.boardTenth/2, y: ctx.canvas.height/2 - game.boardTenth*1.5 + game.boardTenth*0.2};

			function showDiceNumber(num)
			{
				if(rolling)
				{
					var ga = ctx.globalAlpha;
					ctx.globalAlpha = 0.5;
					ctx.drawImage(diceImages[num], point.x, point.y, game.boardTenth*3, game.boardTenth*3);
					ctx.globalAlpha = ga;
					setTimeout(showDiceNumber, 50, (num + 1)%6);
				}
				else
				{
					socket.send("rolled~" + (num+1) + "~" + clientNum + "~");
				}
			}

			$(ctx.canvas).off().on("click", function(){
				rolling = false;
				$(ctx.canvas).off("click");
				$("body").off("keyup");
			});

			$("body").off().on("keyup", function(){
				if(event.which != 32)
					return;
				rolling = false;
				$(ctx.canvas).off("click");
				$("body").off("keyup");
			});

			canLib.drawRectangle(point.x - game.boardTenth*0.09, point.y - game.boardTenth*0.09, game.boardTenth*3.18, game.boardTenth*3.18, "black");
			canLib.drawRectangle(point.x - game.boardTenth*0.06, point.y - game.boardTenth*0.06, game.boardTenth*3.12, game.boardTenth*3.12, "white");
			canLib.drawRectangle(point.x - game.boardTenth*0.03, point.y - game.boardTenth*0.03, game.boardTenth*3.06, game.boardTenth*3.06, "black");
			showDiceNumber(0);
		},

		move : function(path)
		{
			var pathIndex = 0;
			var that = this;
			var boardTenth = game.boardTenth;
			var ctx = game.ctx;
			var clientNum = game.clientNum;
			var canLib = game.canLib;
			// may be necessary
			// var thisGame = game;
			function drawMove()
			{
				game.drawBoard();
				var center = {x: ctx.canvas.width/2 + boardTenth/2, y: ctx.canvas.height/2 + boardTenth*0.2};
				for(var i = 0 ; i < 5; i++)
				{
					canLib.drawRectangle(
						center.x + boardTenth*2*Math.cos(Math.PI*2/5*i + Math.PI/2) - boardTenth*0.35,
						center.y + boardTenth*2*Math.sin(Math.PI*2/5*i + Math.PI/2) - boardTenth*0.35,
						boardTenth*0.7,
						boardTenth*0.7,
						"#f00"
					);
					canLib.drawRectangle(
						center.x + boardTenth*2*Math.cos(Math.PI*2/5*i + Math.PI/2) - boardTenth*0.3,
						center.y + boardTenth*2*Math.sin(Math.PI*2/5*i + Math.PI/2) - boardTenth*0.3,
						boardTenth*0.6,
						boardTenth*0.6, 
						"black"
					);
					ctx.drawImage(
						diceImages[movesLeft],
						center.x + boardTenth*2*Math.cos(Math.PI*2/5*i + Math.PI/2) - boardTenth*0.25,
						center.y + boardTenth*2*Math.sin(Math.PI*2/5*i + Math.PI/2) - boardTenth*0.25,
						boardTenth*0.5,
						boardTenth*0.5
					);
				}
				var dist = game.utiLib.distance(that.x, that.y, game.spacesArray[path[pathIndex]].x, game.spacesArray[path[pathIndex]].y);
				that.drawPlayer();
				if(dist < 3){
					that.x = game.spacesArray[path[pathIndex]].x;
					that.y = game.spacesArray[path[pathIndex]].y;
					// that.space = game.spacesArray[path[pathIndex]];
					that.setSpace(game.spacesArray[path[pathIndex]]);
					pathIndex++;
					if(pathIndex >= path.length && clientNum == that.num) {
						socketBasicSend("moved", roll);
						return;
					}
					setTimeout(drawMove, 1);
				}
				else{
					that.x += (game.spacesArray[path[pathIndex]].x - that.x)/dist*3;
					that.y += (game.spacesArray[path[pathIndex]].y - that.y)/dist*3;
					setTimeout(drawMove, 1);
				}
			}
		},

		setSpace : function(space)
		{
			this.space.player = undefined;
			this.space = space;
			space.player = this;
		},

		react : function()
		{
			if(this.unleashed){
				socket.send("placeTopToken~" + game.clientNum + "~" + this.space.id + "~");
				// if(this.space.id == carpathia.space.id)
				// 	socket.send("carpathiaHit~" + clientNum + "~");
			}
			this.space.react();
		},

		drawPlayer : function(num)
		{
			num = num == undefined ? this.num : num;
			var spaceWidth = game.spaceWidth;
			var canLib = game.canLib;
			var ctx = game.ctx;
			// ctx.drawImage(this.image, this.x - spaceWidth*0.4, this.y - spaceWidth*0.4, spaceWidth*0.8, spaceWidth*0.8);
			ctx.drawImage(this.image, 0, 0, 419, 516, this.getX() - spaceWidth*0.35, this.getY() - spaceWidth*0.4, spaceWidth*0.7, spaceWidth*0.8);
			ctx.globalAlpha = 0.4;
			canLib.drawRectangle(this.getX() - spaceWidth*0.35, this.getY() - spaceWidth*0.4, spaceWidth*0.7, spaceWidth*0.8, this.color);
			ctx.globalAlpha = 1;
			// if(this.dead)
			// {
			// 	ctx.lineWidth = 5;
			// 	ctx.strokeStyle = "black";
			// 	ctx.beginPath();
			// 	ctx.moveTo(this.getX() - spaceWidth/2, this.getY() - spaceWidth/2);
			// 	ctx.lineTo(this.getX() + spaceWidth/2, this.getY() + spaceWidth/2);
			// 	ctx.closePath();
			// 	ctx.stroke();
			// 	ctx.beginPath();
			// 	ctx.moveTo(this.getX() + spaceWidth/2, this.getY() - spaceWidth/2);
			// 	ctx.lineTo(this.getX() - spaceWidth/2, this.getY() + spaceWidth/2);
			// 	ctx.closePath();
			// 	ctx.stroke();
			// 	ctx.lineWidth = 1;
			// }
		}
	}
	player.init();
	return player;
}

// returns a space object
function GetNewSpace(type, id, x, y, corners){

	var space = {
		name : "Space",
		type : type,
		nbs : {},
		corners : corners,
		x : x,
		y : y,
		topToken : null,
		id : id,
		playerOnTop : null,
		npcOnTop : null,

		init : function()
		{

		},

		getX : function(player)
		{
			player = player == undefined ? game.activePlayer : player;
			return this.x - player.x + game.ctx.canvas.width/2;
		},

		getY : function(player)
		{
			player = player == undefined ? game.activePlayer : player;
			return this.y - player.y + game.ctx.canvas.height/2;
		},

		react : function()
		{
			socket.send("reaction~" + clientName + "~" + this.type + "~");
			this.reactionFunctions[this.type]();
		},

		draw : function(drawingBig)
		{
			var ctx = game.ctx;
			this.drawingSpaceFunction(this.type.toLowerCase(), drawingBig);
			if(this.topToken != undefined){
				ctx.fillStyle = game.players[this.topToken].color;
				ctx.strokeStyle = "black";
				ctx.beginPath();
				ctx.moveTo(this.getX() + 0.1*spaceWidth, this.getY() - spaceWidth/2);
				ctx.lineTo(this.getX() + 0.1*spaceWidth, this.getY() - spaceWidth*0.1);
				ctx.lineTo(this.getX() + 0.5*spaceWidth, this.getY() - spaceWidth*0.1);
				ctx.lineTo(this.getX() + 0.5*spaceWidth, this.getY() + spaceWidth*0.1);
				ctx.lineTo(this.getX() + 0.1*spaceWidth, this.getY() + spaceWidth*0.1);
				ctx.lineTo(this.getX() + 0.1*spaceWidth, this.getY() + spaceWidth/2);
				ctx.lineTo(this.getX() - 0.1*spaceWidth, this.getY() + spaceWidth/2);
				ctx.lineTo(this.getX() - 0.1*spaceWidth, this.getY() + spaceWidth*0.1);
				ctx.lineTo(this.getX() - 0.5*spaceWidth, this.getY() + spaceWidth*0.1);
				ctx.lineTo(this.getX() - 0.5*spaceWidth, this.getY() - spaceWidth*0.1);
				ctx.lineTo(this.getX() - 0.1*spaceWidth, this.getY() - spaceWidth*0.1);
				ctx.lineTo(this.getX() - 0.1*spaceWidth, this.getY() - spaceWidth/2);
				ctx.closePath();
				ctx.fill();
				ctx.stroke();
			}
		},

		placeTopToken : function(num)
		{
			this.topToken = num;
		},

		getTopToken : function()
		{
			return this.topToken;
		},
		drawColoredSpace : function(color, drawingBig)
		{
			var that = this;
			var ctx = game.ctx;
			var canLib = game.canLib;
			var spaceWidth = game.spaceWidth;
			// canLib.drawDiscatCenter(this.getX(), this.getY(), spaceWidth/2, color);
			var spaceWidth = game.spaceWidth;
			if(drawingBig)
				var width = spaceWidth * 1.5;
			else
				var width = spaceWidth;
			if(this.corners.length == 0){
				this.corners = [];

				function saveCorner(x, y)
				{
					var midPoint = {x : (that.x + x)/2, y: (that.y + y)/2};
					var midPointAngle = game.angleToOrigin(that, {x: x, y: y});
					var radius = spaceWidth/3;
					var calcX = midPoint.x + radius * Math.cos(Math.PI/2 + midPointAngle);
					var calcY = midPoint.y + radius * Math.sin(Math.PI/2 + midPointAngle);
					insertCorner({x: calcX, y: calcY, angle: game.angleToOrigin(that, {x: calcX, y: calcY})});
					var calcX = midPoint.x + radius * Math.cos(Math.PI/2*3 + midPointAngle);
					var calcY = midPoint.y + radius * Math.sin(Math.PI/2*3 + midPointAngle);
					insertCorner({x: calcX, y: calcY, angle: game.angleToOrigin(that, {x: calcX, y: calcY})});
				}

				function insertCorner(sc)
				{
					for(var i = 0 ; i < that.corners.length; i++)
					{
						if(that.corners[i].angle > sc.angle)
						{
							that.corners.splice(i, 0, sc);
							return;
						}
					}
					that.corners.push(sc);
				}

				for(var i in this.nbs)
				{
					saveCorner(this.nbs[i].x, this.nbs[i].y);
				}
			}
			ctx.lineWidth = 5;
			ctx.strokeStyle = "#000";
			ctx.fillStyle = color;
			ctx.beginPath();
			// ctx.moveTo(perpVectors[0].init.x, perpVectors[0].init.y);
			// ctx.lineTo(perpVectors[0].final.x, perpVectors[0].final.y);
			// for(var i = 1; i < perpVectors.length; i++)
			// {
			// 	ctx.lineTo(perpVectors[i].init.x, perpVectors[i].init.y);
			// 	ctx.lineTo(perpVectors[i].final.x, perpVectors[i].final.y);
			// }
			ctx.moveTo(getCornerAt(0).x, getCornerAt(0).y);
			for(var i = 1; i < this.corners.length; i++)
			{
				ctx.lineTo(getCornerAt(i).x, getCornerAt(i).y);
			}
			ctx.closePath();
			ctx.fill();
			canLib.drawDiscatCenter(this.getX(), this.getY(), spaceWidth/9.8, "#000");
			// for(var i = 0 ; i < perpVectors.length; i++)
			// {
			// 	ctx.beginPath();
			// 	ctx.moveTo(perpVectors[i].final.x, perpVectors[i].final.y);
			// 	ctx.lineTo(perpVectors[(i+1) % perpVectors.length].final.x, perpVectors[(i+1) % perpVectors.length].final.y);
			// 	ctx.stroke();
			// }

			function getCornerAt(i)
			{
				return {x: that.corners[i].x - game.activePlayer.x + game.ctx.canvas.width/2, y: that.corners[i].y - game.activePlayer.y + game.ctx.canvas.height/2};
			}
		},

		drawingSpaceFunction : function(type, drawingBig){
			var that = this;
			this.drawingFunctions = {
				'green': function(drawingBig){
					that.drawColoredSpace("green", drawingBig);
				},
				'red': function(drawingBig){
					that.drawColoredSpace("red", drawingBig);
				},
				'white': function(drawingBig){
					that.drawColoredSpace("white", drawingBig);
				},
				'blue': function(drawingBig){
					that.drawColoredSpace("blue", drawingBig);
				},
				'penalty': function(drawingBig){
					// if(drawingBig)
					// 	width = spaceWidth * 1.5;
					// else
					// 	width = spaceWidth;
					// canLib.drawRectangle(thisSpace.x - width*0.4, thisSpace.y - width*0.4, width*0.8, width*0.8, "#aaa");
					// canLib.drawRectangle(thisSpace.x - width*0.3, thisSpace.y - width*0.3, width*0.6, width*0.6, "#333");
					// ctx.font = width/3 + "px Courier New";
					// ctx.strokeStyle = "#f00";
					// ctx.fillStyle = "#FF5C00";
					// ctx.fillText("FIRE", thisSpace.x - width*0.4, thisSpace.y - width*0.0);
					// ctx.strokeText("FIRE", thisSpace.x - width*0.4, thisSpace.y - width*0.0);
					that.drawColoredSpace("orange", drawingBig);
				},
				'carpathia': function(drawingBig){
					// if(drawingBig)
					// 	width = spaceWidth * 1.5;
					// else
					// 	width = spaceWidth;
					// canLib.drawRectangle(thisSpace.x - width*0.4, thisSpace.y - width*0.4, width*0.8, width*0.8, "#aaa");
					// canLib.drawRectangle(thisSpace.x - width*0.4, thisSpace.y - width*0.4, width*0.8, width*0.8, "#FF5C00");
					// canLib.drawRectangle(thisSpace.x - width*0.3, thisSpace.y - width*0.3, width*0.6, width*0.6, "#f00");
					// ctx.font = width/2.5 + "px Courier New";
					// ctx.strokeStyle = "#000";
					// ctx.strokeText("CAR", thisSpace.x - width*0.4, thisSpace.y - width*0.2);
					// ctx.strokeText("PAT", thisSpace.x - width*0.4, thisSpace.y + width*0.1);
					// ctx.strokeText("HIA", thisSpace.x - width*0.4, thisSpace.y + width*0.4);
					that.drawColoredSpace("black", drawingBig);
				}
			};
			this.drawingFunctions[type]();
		},

		reactionFunctions : {
			"green": function(){
				game.prepTurnEnd(0);
				return;
				socket.send("greenCard~" + game.clientNum + "~");
			},
			"red": function(){
				game.prepTurnEnd(0);
				return;
				socket.send("redCard~" + game.clientNum + "~");
			},
			"white": function(){
				game.prepTurnEnd(0);
				return;
				game.addToLogger("Roll again!");
				socket.send("broadcast~" + players[game.clientNum].name + " landed on a white space and is rolling again.");
				players[game.clientNum].roll();
			},
			"blue": function(){
				game.prepTurnEnd(0);
				return;
				// make this a store place?
				socket.send("broadcast~" + clientName + " landed on a blue space. They get tokens!");
				socket.send("getTokens~" + game.clientNum + "~" + Math.round(Math.random()*5));
				prepTurnEnd();
			},
			"black": function(){
				game.prepTurnEnd(0);
				return;
				prepTurnEnd();
			},
			"start": function(){
				game.prepTurnEnd(0);
				return;
				game.addToLogger("Roll again!");
				// socket.send("broadcast~" + players[game.clientNum].name + " landed on a start space and is rolling again.");
				alert("YOU ARE GREAT");
				socket.send("broadcast~" + "NEVER HAVE I EVER" + "~");
				players[game.clientNum].roll();
				// prepTurnEnd();
			},
			"penalty": function(){
				game.prepTurnEnd(0);
				return;
				var startLocation = {x: ctx.canvas.width/2 - 4*spaceWidth, y: ctx.canvas.height/2 - spaceWidth};

				function drawOption(text, place, big)
				{
					var start = {x: startLocation.x + place*spaceWidth*3, y:startLocation.y};
					canLib.drawRectangle(start.x - spaceWidth*0.4, start.y - spaceWidth*0.4, spaceWidth*2.8, spaceWidth*2.8, "#FF5C00");
					canLib.drawRectangle(start.x - spaceWidth*0.2, start.y - spaceWidth*0.2, spaceWidth*2.4, spaceWidth*2.4, "#F00");
					canLib.drawRectangle(start.x, start.y, spaceWidth*2, spaceWidth*2, "black");
					ctx.strokeStyle = "#fff";
					if(big){
						ctx.font = spaceWidth*3 + "px Courier New";
						ctx.strokeText((""+text)[0], start.x, start.y + spaceWidth*2);
					}else{
						ctx.font = spaceWidth/3 + "px Courier New";
						var str = '';
						var words = text.split(' ');
						var j = 1;
						for(var i = 0; i < words.length; i++)
						{
							if(str.length + words[i].length > 10){
								ctx.strokeText(str, start.x, start.y + spaceWidth/3*(j++));
								str = "";
								i--;
							}
							else
								str += (str == "" ? "" : " ") + words[i];
						}
						ctx.strokeText(str, start.x, start.y + spaceWidth/3*(j++));
					}
				}

				function drawHovering(text, place, big){

					var start = {x: startLocation.x + place*spaceWidth*3, y:startLocation.y};
					canLib.drawRectangle(start.x - spaceWidth*0.4, start.y - spaceWidth*0.4, spaceWidth*2.8, spaceWidth*2.8, "#FF5C00");
					canLib.drawRectangle(start.x - spaceWidth*0.2, start.y - spaceWidth*0.2, spaceWidth*2.4, spaceWidth*2.4, "#F00");
					canLib.drawRectangle(start.x, start.y, spaceWidth*2, spaceWidth*2, "black");
					ctx.fillStyle = "#fff";
					if(big){
						ctx.font = spaceWidth*3 + "px Courier New";
						ctx.fillText((""+text)[0], start.x, start.y + spaceWidth*2);
					}else{
						ctx.font = spaceWidth/3 + "px Courier New";
						var str = '';
						var words = text.split(' ');
						var j = 1;
						for(var i = 0; i < words.length; i++)
						{
							if(str.length + words[i].length + 1 > 10){
								ctx.fillText(str, start.x, start.y + spaceWidth/3*(j++));
								str = "";
								i--;
							}
							else
								str += (str == "" ? "" : " ") + words[i];
						}
						ctx.fillText(str, start.x, start.y + spaceWidth/3*(j++));
					}	
				}

				function drawChosen(text, place){

					var start = {x: startLocation.x + place*spaceWidth*3, y:startLocation.y};
					canLib.drawRectangle(start.x - spaceWidth*0.4, start.y - spaceWidth*0.4, spaceWidth*2.8, spaceWidth*2.8, "#00F");
					canLib.drawRectangle(start.x - spaceWidth*0.2, start.y - spaceWidth*0.2, spaceWidth*2.4, spaceWidth*2.4, "#0FF");
					canLib.drawRectangle(start.x, start.y, spaceWidth*2, spaceWidth*2, "white");
					ctx.strokeStyle = "#000";
					ctx.font = spaceWidth/3 + "px Courier New";
						var str = '';
						var words = text.split(' ');
						var j = 1;
						for(var i = 0; i < words.length; i++)
						{
							if(str.length + words[i].length > 10){
								ctx.strokeText(str, start.x, start.y + spaceWidth/3*(j++));
								str = "";
								i--;
							}
							else
								str += (str == "" ? "" : " ") + words[i];
						}
						ctx.strokeText(str, start.x, start.y + spaceWidth/3*(j++));
				}

				var possibilities = [
					{
						text: "You got Griffin's website! Good job!",
						func: function(){
							window.open("http://highpie.x10.mx");
							socket.send("broadcast~" + clientName + " got to go to Griffin's website!");
							prepTurnEnd();
						}
					},
					{
						text: "You get 10 confirms!",
						func: function(){
							// var answer = false;
							// socket.send("broadcast~" + clientName + " has to proclaim their stupidity.");
							// for(var i = 0; i < 10; i++){
							// 	answer = confirm("For the "+i+"th time, are you stupid?");
							// 	while(!answer)
							// 		confirm("Again, are you stupid?");
							// }
							// prepTurnEnd();
							alert("You are great!");
							prepTurnEnd();
						}
					},
					{
						text: "You got 10 tokens!",
						func: function(){
							socket.send("getTokens~" + game.clientNum + "~10~");
							prepTurnEnd();
						}
					},
					{
						text: "You lost 10 tokens!",
						func: function(){
							socket.send("loseTokens~" + game.clientNum + "~10~");
							prepTurnEnd();
						}
					},
					{
						text: "You get to roll again!",
						func: function(){
							socket.send("broadcast~" + clientName + " gets to roll again!~");
							players[game.clientNum].roll();
							// prepTurnEnd();
						}
					}	
				];

				var actualities = [possibilities.splice(Math.floor(Math.random()*possibilities.length),1)[0], possibilities.splice(Math.floor(Math.random()*possibilities.length),1)[0], possibilities.splice(Math.floor(Math.random()*possibilities.length),1)[0]];
				var scaler = getScaler();

				$(ctx.canvas).on("click", function(){
					if(event.x*scaler.x < startLocation.x + spaceWidth*2 && event.x*scaler.x > startLocation.x && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						drawChosen(actualities[0].text, 0);
						drawOption(actualities[1].text, 1);
						drawOption(actualities[2].text, 2);
						$(ctx.canvas).off("click");
						$(ctx.canvas).off("mousemove");
						actualities[0].func();
					}else if(event.x*scaler.x < startLocation.x + spaceWidth*5 && event.x*scaler.x > startLocation.x + spaceWidth*3 && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						drawOption(actualities[0].text, 0);
						drawChosen(actualities[1].text, 1);
						drawOption(actualities[2].text, 2);
						$(ctx.canvas).off("click");
						$(ctx.canvas).off("mousemove");
						actualities[1].func();
					}else if(event.x*scaler.x < startLocation.x + spaceWidth*8 && event.x*scaler.x > startLocation.x + spaceWidth*6 && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						drawOption(actualities[0].text, 0);
						drawOption(actualities[1].text, 1);
						drawChosen(actualities[2].text, 2);
						$(ctx.canvas).off("click");
						$(ctx.canvas).off("mousemove");
						actualities[2].func();
					}

				});

				$(ctx.canvas).on("mousemove", function(){
					if(event.x*scaler.x < startLocation.x + spaceWidth*2 && event.x*scaler.x > startLocation.x && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						drawHovering(1, 0, true);
					}else if(event.x*scaler.x < startLocation.x + spaceWidth*5 && event.x*scaler.x > startLocation.x + spaceWidth*3 && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						drawHovering(2, 1, true);
					}else if(event.x*scaler.x < startLocation.x + spaceWidth*8 && event.x*scaler.x > startLocation.x + spaceWidth*6 && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						drawHovering(3, 2, true);
					}else{
						drawOption(1, 0, true);
						drawOption(2, 1, true);
						drawOption(3, 2, true);
					}
				});

				drawOption(1, 0, true);
				drawOption(2, 1, true);
				drawOption(3, 2, true);
				// prepTurnEnd();
			}, 
			"carpathia": function(){
				prepTurnEnd();
				return;
				if(unleashed){
					Chat.socket.send("getTokens~" + game.clientNum + "~5~");
					prepTurnEnd();
					return;
				}
				Chat.socket.send("broadcast~" + clientName + " is rolling the CARPATHIA dice!~");
				var startLocation = {x: ctx.canvas.width/2 - 4*spaceWidth, y: ctx.canvas.height/2 - spaceWidth};
				// drawCarpathiaDie(0);
				// drawCarpathiaDie(1);
				// drawCarpathiaDie(2);

				var rolling = [true, true, true];
				var rollingSuccess = [undefined, undefined, undefined];
				var successes = 0;
				var hovering = [false, false, false];

				function showCarpathiaDice()
				{
					var notRolling = 0;
					for(var i = 0; i < 3; i++)
					{
						if(rolling[i])
						{
							drawCarpathiaDie(i, Math.round(Math.random()*2) == 0, hovering[i]);
						}
						else
						{
							notRolling++;
							if(rollingSuccess[i] == undefined)
							{
								// carpathia Percentage
								if(Math.round(Math.random()*1.5) == 0)
								// if(Math.round(Math.random()*0) == 0)
								{
									rollingSuccess[i] = true;
									successes++;
									Chat.socket.send("carpathiaSuccess~" + i + "~" + game.clientNum + "~");
								}
								else
								{
									rollingSuccess[i] = false;
									Chat.socket.send("carpathiaFailure~" + i + "~" + game.clientNum + "~");
								}
							}
						}
					}

					if(notRolling < 3)
						setTimeout(showCarpathiaDice, 1);
					else if(successes > 0)
					{
						var tempSuccess = 0;
						Chat.socket.send("broadcast~" + clientName + " is still rolling to summon the antiChrist!");
						for(var i = 0; i < 3; i++)
						{
							if(!rollingSuccess[i])
							{
								rolling[i] = true;
								rollingSuccess[i] = undefined;
							}
							else
								tempSuccess++;	
						}
						successes = 0;
						if(tempSuccess == 3)
						{
							$(ctx.canvas).off("click");
							$(ctx.canvas).off("mousemove");
							Chat.socket.send("unleashed~" + game.clientNum + "~");
						}
						else
							setTimeout(showCarpathiaDice, 1);
					}
					else
					{
						Chat.socket.send("broadcast~" + clientName + " failed to summon the antiChrist. Dammit!");
						$(ctx.canvas).off("click");
						$(ctx.canvas).off("mousemove");
						prepTurnEnd();
					}
				}

				var scaler = getScaler();
				$(ctx.canvas).on("click", function(){
					if(event.x*scaler.x < startLocation.x + spaceWidth*2 && event.x*scaler.x > startLocation.x && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						rolling[0] = false;
					}else if(event.x*scaler.x < startLocation.x + spaceWidth*5 && event.x*scaler.x > startLocation.x + spaceWidth*3 && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						rolling[1] = false;
					}else if(event.x*scaler.x < startLocation.x + spaceWidth*8 && event.x*scaler.x > startLocation.x + spaceWidth*6 && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						rolling[2] = false;
					}
				});
				var lastHover;
				$(ctx.canvas).on("mousemove", function(){
					if(rolling[0] && event.x*scaler.x < startLocation.x + spaceWidth*2 && event.x*scaler.x > startLocation.x && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						if(!hovering[0]){
							lastHover = 0;
							hovering[0] = true;
							drawCarpathiaDieOnce(0, true, true);
						}
					}else if(rolling[1] &&event.x*scaler.x < startLocation.x + spaceWidth*5 && event.x*scaler.x > startLocation.x + spaceWidth*3 && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						if(!hovering[1]){
							lastHover = 1;
							hovering[1] = true;
							drawCarpathiaDieOnce(1, true, true);
						}
					}else if(rolling[2] &&event.x*scaler.x < startLocation.x + spaceWidth*8 && event.x*scaler.x > startLocation.x + spaceWidth*6 && event.y*scaler.y > startLocation.y && event.y*scaler.y < startLocation.y + spaceWidth*2)
					{
						if(!hovering[2]){
							lastHover = 2;
							hovering[2] = true;
							drawCarpathiaDieOnce(2, true, true);
						}
					}else{
						hovering = [false, false, false];
						if(lastHover !== undefined)
						{
							drawCarpathiaDieOnce(lastHover, rollingSuccess[lastHover], false);
							lastHover = undefined;
						}
					}
				});

				drawCarpathiaDieOnce(0, false, false);
				drawCarpathiaDieOnce(2, false, false);
				drawCarpathiaDieOnce(1, false, false);
				showCarpathiaDice();
				// prepTurnEnd();
			}
		}
	}
	space.init();
	return space;
}

// function GetNPC(imagePath, getsToRoll, space){

// 	var npc = {
// 		name : "NPC",
// 		image : new Image(),
// 		evilDice : [],
// 		x : 0,
// 		y : 0,
// 		rolling : false,
// 		getsToRoll : getsToRoll,
// 		space : space,
// 		pathGoal : "player",

// 		init : function(){
// 			for(var i = 0; i < 6; i++)
// 			{
// 				this.evilDice.push(new Image());
// 				this.evilDice[i].src = "images/evilDice" + (i+1) + ".png";
// 			}

// 			this.image.src = imagePath == undefined ? "images/ob.png" : imagePath;
// 			// this.space = this.space == undefined ? game.spacesArray[this.newPlaceNum()] ? this.space;
// 			this.setSpace(this.space == undefined ? game.spacesArray[this.newPlaceNum()] ? this.space);
// 		},

// 		getX : function(player){
// 			player = player == undefined ? game.activePlayer : player;
// 			return this.x - player.x + game.ctx.canvas.width/2;
// 		},

// 		getY : function(player){
// 			player = player == undefined ? game.activePlayer : player;
// 			return this.y - player.y + game.ctx.canvas.height/2;
// 		},

// 		setSpace : function(space)
// 		{
// 			this.space.npcOnTop = undefined;
// 			this.space = space;
// 			space.npcOnTop = this;
// 		},

// 		newPlaceNum : function()
// 		{
// 			var unOccupied;
// 			// var space = utiLib.randomEntry(spacesArray)[0];
// 			var spaceNum;
// 			do
// 			{
// 				spaceNum = Math.round(Math.random()*(game.spacesArray.length-1));
// 				unOccupied = true;
// 				for(var i = 0; i < players.length; i++)
// 				{
// 					if(game.players[i].space.id == game.spacesArray[spaceNum][0].id)
// 					{
// 						unOccupied = false;
// 						break;
// 					}
// 				}
// 			} while(!unOccupied)
// 			return spaceNum;
// 		},

// 		drawNPC : function()
// 		{
// 			var spaceWidth = game.spaceWidth;
// 			game.ctx.drawImage(this.image, this.getX() - spaceWidth/2, this.getY() - spaceWidth/2, spaceWidth, spaceWidth);
// 		},

// 		roll : function()
// 		{
// 			var ctx = game.ctx;
// 			var boardTenth = game.boardTenth;
// 			var evilDice = this.evilDice;
// 			var clientNum = game.clientNum;
// 			var canLib = game.canLib;

// 			var point = {x: ctx.canvas.width/2 - boardTenth*1.5 + boardTenth/2, y: ctx.canvas.height/2 - boardTenth*1.5 + boardTenth*0.2};
// 			var dice = 3;
// 			that.rolling = true;
// 			function showDiceNumber(num)
// 			{
// 				var ga = ctx.globalAlpha;
// 				ctx.globalAlpha = 0.5;
// 				ctx.drawImage(evilDice[num], point.x, point.y, boardTenth*3, boardTenth*3);
// 				ctx.globalAlpha = ga;
// 				if(that.rolling)
// 					setTimeout(showDiceNumber, 50, (num + 1)%6);
// 			}

// 			function makeDiceNumber()
// 			{
// 				var tempRoll = Math.round(Math.random()*5)+1;
// 				socket.send("broadcast~Carpathia rolled a " + tempRoll + ".~");
// 				// if(--dice != 0)
// 				// 	setTimeout(makeDiceNumber, 5000);	
// 				// else{
// 					that.rolling = false;
// 					socket.send("carpathiaMove~"+ tempRoll + "~");
// 				// }
// 			}
// 			if(clientNum == 0)
// 				setTimeout(makeDiceNumber,5000);

// 			canLib.drawRectangle(point.x - boardTenth*0.09, point.y - boardTenth*0.09, boardTenth*3.18, boardTenth*3.18, "white");
// 			canLib.drawRectangle(point.x - boardTenth*0.06, point.y - boardTenth*0.06, boardTenth*3.12, boardTenth*3.12, "black");
// 			canLib.drawRectangle(point.x - boardTenth*0.03, point.y - boardTenth*0.03, boardTenth*3.06, boardTenth*3.06, "white");
// 			showDiceNumber(0);
// 		},

// 		react : function(){
// 			var person = game.playerOnSpace(this.space);
// 			if(person != undefined)
// 			{
// 				socket.send("carpathiaHit~" + person + "~");
// 			}
// 			else if(this.space.topToken != undefined)
// 			{
// 				game.winner = this.space.topToken;
// 				game.turnEnd();
// 			}
// 			else
// 			{
// 				socket.send("broadcast~Carpathia missed everyone this time!");
// 				socket.send("yourTurn~0~");
// 			}
// 		},

// 		pathFindingFunctions : {
// 			player : function()
// 				{
// 					var paths = [];
// 					for(var i : that.space.nbs)
// 						paths.push([that.space, that.space.nbs[i]]);
// 					var tempPaths;
// 					var bestPath;
// 					var going = true;
// 					while(going)
// 					{
// 						tempPaths = [];
// 						for(var i = 0; i < paths.length; i++)
// 						{
// 							for(var j : paths[i][paths.length-1].nbs)
// 							{
// 								if(j != paths[i][paths.length-2].id){
// 									tempPaths.push(paths[i].slice().push(paths[i][paths.length-1].nbs[j]));
// 									if(paths[i][paths.length-1].player != undefined && !paths[i][paths.length-1].player.dead){
// 										going = false;
// 										bestPath = tempPaths[tempPaths.length-1];
// 										break;
// 									}
// 								}
// 							}
// 							if(!going){
// 								break;
// 							} else {
// 								paths = tempPaths;
// 							}
// 						}
// 					}
// 					return bestPath;
// 				}

// 			// npc : 

// 			// playerEntity : 
// 		},

// 		move : function(roll)
// 		{
// 			var players = game.players;
// 			var clientNum = game.clientNum;
// 			var that = this;

// 			// made a mistake putting this on the front end.
// 			// change this to a socket call? Probably
// 			var path = this.pathFindingFunctions[this.pathGoal]();

// 			drawMoveInit(roll);

// 			function drawMoveInit(roll)
// 			{
// 				var players = game.players;

// 				if(roll == 0)
// 				{
// 					// do the player message check on the back end
// 					that.react();
// 					return;
// 				}

// 				for(var i = 0; i < players.length; i++)
// 					// if(!players[i].dead && that.space.id == players[i].space.id){
// 					if(!players[i].dead && that.space.player != undefined){
// 						that.react();
// 						return;
// 					}

// 				if(path.length == 0){
// 					alert("The game fucked up. This npc should have hit someone by now.")
// 					that.react();
// 					return;
// 				}
// 				that.setSpace(path.splice(path.length-1));

// 				drawMove(roll-1);
// 			}

// 			function drawMove(roll)
// 			{
// 				drawBoard(that.num);
// 				var center = {x: ctx.canvas.width/2 + spaceWidth/2, y: ctx.canvas.height/2 + spaceWidth*0.2};
// 				for(var i = 0 ; i < 5; i++)
// 				{
// 					canLib.drawRectangle(
// 						center.x + spaceWidth*2*Math.cos(Math.PI*2/5*i + Math.PI/2) - spaceWidth*0.35,
// 						center.y + spaceWidth*2*Math.sin(Math.PI*2/5*i + Math.PI/2) - spaceWidth*0.35,
// 						spaceWidth*0.7,
// 						spaceWidth*0.7,
// 						"black"
// 					);
// 					canLib.drawRectangle(
// 						center.x + spaceWidth*2*Math.cos(Math.PI*2/5*i + Math.PI/2) - spaceWidth*0.3,
// 						center.y + spaceWidth*2*Math.sin(Math.PI*2/5*i + Math.PI/2) - spaceWidth*0.3,
// 						spaceWidth*0.6,
// 						spaceWidth*0.6,
// 						"#f00" 
// 					);
// 					ctx.drawImage(
// 						evilDice[roll],
// 						center.x + spaceWidth*2*Math.cos(Math.PI*2/5*i + Math.PI/2) - spaceWidth*0.25,
// 						center.y + spaceWidth*2*Math.sin(Math.PI*2/5*i + Math.PI/2) - spaceWidth*0.25,
// 						spaceWidth*0.5,
// 						spaceWidth*0.5
// 					);	
// 				}
// 				var dist = utiLib.distance(that.x, that.y, that.space.x, that.space.y);
// 				if(dist < 3){
// 					that.x = that.space.x;
// 					that.y = that.space.y;
// 					that.drawPlayer();
// 					drawMoveInit(roll);
// 				}
// 				else{
// 					that.x += (that.space.x - that.x)/dist*2;
// 					that.y += (that.space.y - that.y)/dist*2;
// 					that.drawPlayer();
// 					setTimeout(drawMove, 1, roll);
// 				}

// 			}

// 		}

// 		this.arrive = function(playerNum, num, newSpace)
// 		{
// 			num = num == undefined ? 1 : num;
// 			if(newSpace != undefined){
// 				this.space = spacesArray[newSpace][0];
// 				this.x = this.space.x;
// 				this.y = this.space.y;
// 			}
// 			if(num > 0)
// 			{
// 				drawBoard();
// 				ctx.globalAlpha = 1 - num;
// 				var distPoint = utiLib.distance(0, 0, that.x - spaceWidth/2, that.y - spaceWidth/2);
// 				var distArea = utiLib.distance(spaceWidth, spaceWidth, spaceWidth*10, spaceWidth*10);
// 				ctx.drawImage(
// 					that.image,
// 					(num)*(spaceWidth/2 - that.x) + that.x - spaceWidth/2,
// 					(num)*(spaceWidth/2 - that.y) + that.y - spaceWidth/2,
// 					(num)*(spaceWidth*(10-1)) + spaceWidth,
// 					(num)*(spaceWidth*(10-1)) + spaceWidth
// 				);
// 				setTimeout(that.arrive, 50, playerNum, num-0.01);
// 			}
// 			else
// 			{
// 				drawBoard();
// 				that.drawPlayer();
// 				ctx.globalAlpha = 1;
// 				if(clientNum == playerNum){
// 					Chat.socket.send("getTokens~" + playerNum + "~5~");
// 					prepTurnEnd();
// 				}
// 			}
// 		}
// 	}
// }

var socket = {
	socket : null,

	init : function(){
		var that = this;
		// connect the socket
		if (window.location.protocol == 'http:') {
			this.connect('ws://' + window.location.host + '/genericBoardGamev2/websocket/game2');
		} else {
			this.connect('wss://' + window.location.host + '/genericBoardGamev2/websocket/game2');
		}

		// show the sign in interface
		$("#signInButton").on("click", signIn);
		$("#signInName").on("keyup", function(){
			if(event.which == 13)
			{
				signIn();
			}	
		});
		$("#signInName").focus();
		$("#alert").on("click", function(){$("#signInName").focus()});

		// function for sending the player name
		function signIn()
		{
			if($("#signInName").val().indexOf('~') > 0){
				alert("You really shouldn't put a tilde in your name.");
				return;
			}
			else if($("#signInName").val() == '')
			{
				alert("Don't be modest, give yourself a name!");
				return;
			}
			else if($("#signInName").val().toLowerCase().indexOf('fuck') != -1 || $("#signInName").val().toLowerCase().indexOf('ass') != -1 || $("#signInName").val().toLowerCase().indexOf('shit') != -1 || $("#signInName").val().toLowerCase().indexOf('cunt') != -1 || $("#signInName").val().toLowerCase().indexOf('fart') != -1)
			{
				if(confirm("Are you sure you really want " + $("#signInName").val() + " to be your name?"))
					alert("Alrighty then. You crass bastard.");
				else
				{
					alert("Great choice! I think it's better for people to have real names too.");
					// return;
				}
			}
			$(".cover, .coverContainer").css("display","none");
			game.clientName = $("#signInName").val().replace(/[^a-zA-Z ]/g, "");
			if(game.clientName.toLowerCase().indexOf("ben") != -1)
				window.open("http://www.youtube.com/watch?v=x5m1A7zoIcc");
			that.socketBasicSend("newPlayer", game.clientNum, game.clientName);
		}
	},

	send : function(str)
	{
		this.socket.send(str);
	},

	socketSendWithNum : function(){
		str = arguments[0] + "~" + game.clientNum + "~";
		for(var i = 1 ; i < arguments.length; i++)
			str += arguments[i] + "~";
		this.socket.send(str);
	},

	socketSendWithNum : function()
	{
		str = arguments[0] + "~" + game.clientNum + "~";
		for(var i = 1 ; i < arguments.length; i++)
			str += arguments[i] + "~";
		this.socket.send(str);
	},

	socketBasicSend : function()
	{
		str = "";
		for(var i = 0 ; i < arguments.length; i++)
			str += arguments[i] + "~";
		this.socket.send(str);
	},

	connect : function(host){
		var socket = this;
		if ('WebSocket' in window) {
			this.socket = new WebSocket(host);
		} else if ('MozWebSocket' in window) {
			this.socket = new MozWebSocket(host);
		} else {
			console.log('Error: WebSocket is not supported by this browser.');
			return;
		}
    
		this.socket.onopen = function () {
			console.log('Info: WebSocket connection opened.');
		};

		this.socket.onclose = function () {
			console.log('Info: WebSocket closed.');
		};

		this.socket.onmessage = function (message) {
			console.log(message.data);
			if(message.data.indexOf("~") == -1)
				return;
			var args = message.data.split("~");
			switch(args[0])
			{
				case "alert":
					alert(args[1]);
				break;

				case "clientNum":
					game.clientNum = 1*args[1];
				break;

				case "start":
					// set up the information that the front end needs to draw things

					var startObject = JSON.parse(args[1]);
					var space;
					for(var i in startObject.board)
					{
						space = startObject.board[i];
						// load up the basic space info and corners
						// game.spacesArray[space.id] = GetNewSpace(space.type, space.id, space.x, space.y, space.corners);
						game.spacesArray[space.id] = GetNewSpace(space.type, space.id, space.x, space.y, []);
					}
					// connect the spaces together
					for(var i in startObject.board)
					{
						space = startObject.board[i];
						for(var j in space.nbs)
							game.spacesArray[space.id].nbs[space.nbs[j]] = game.spacesArray[space.nbs[j]];
					}

					// make all the players
					var player;
					for(var i in startObject.players)
					{
						player = startObject.players[i];
						game.players[player.num] = GetNewPlayer(player.num, player.name, player.color, player.space);
					}
					game.activePlayer = game.players[game.clientNum];
					game.drawBoard();

					// set up token table
					var htmlStr = "<table><thead><tr>";
					for(var i =0; i < game.players.length; i++)
					{
						htmlStr += "<th><span class='name" + i + "'>" + game.players[i].name + "</span></th>";
					}
					htmlStr += "</tr></thead><tbody><tr>";
					for(var i =0; i < game.players.length; i++)
					{
						htmlStr += "<td id='playerTokens" + i + "'>0</td>";
					}
					htmlStr += "</tr></tbody></table>";
					$(game.tokenTracker).html(htmlStr);
					socket.socketSendWithNum("finishStart");
				break;

				// asks each of the playerS if they are ready
				case "ready":
					$(".coverContainerContents").css("background-color", "#000");
					$(".cover").css("background-color", "#000");
					$(".coverContainerContents").html(""+
						"<ul>"+
							"<li><h2>Are you, <span style='font-weight:bold'>" + game.clientName + "</span>, ready to start the game?</h2></li>"+
							"<li><button id='startGameButton' class='bigButton'>Ready!</button></li>"+
						"</ul>"+
					"");
					$(".coverContainerContents h2").css("color", "#FFF");
					$(".coverContainerContents h4").css("color", "#aaa");
					// $("#startGameButton").css("font-size", spaceWidth + "px");
					$(".cover, .coverContainer").css("display","block");

					$("#startGameButton").off("click");
					$("#startGameButton").off("keyup");
					
					$("#startGameButton").focus();

					$("#startGameButton").on("keyup", function(){
						if(event.which != 32)
							return;
						$("#startGameButton").off("click");
						$("#startGameButton").off("keyup");
						$(".cover, .coverContainer").css("display","none");
						game.addToLogger("You are ready!");
						socket.send("ready~" + game.clientNum + '~');
						// countDownToStart(30);
					});

					$("#startGameButton").on("click", function(){
						$("#startGameButton").off("click");
						$("#startGameButton").off("keyup");
						$(".cover, .coverContainer").css("display","none");
						game.addToLogger("You are ready!");
						socket.send("ready~" + game.clientNum + '~');
						// countDownToStart(30);
					});
				break;

				case "notReady":
					$(".coverContainerContents").css("background-color", "#000");
					$(".cover").css("background-color", "#000");
					$(".coverContainerContents").html(""+
						"<ul>"+
							"<li><h1>WAITING ON OTHER PLAYERS</h1></li>"+
						"</ul>"+
					"");
					$(".coverContainerContents h1").css("color", "#FFF");
					// $("#startGameButton").css("font-size", spaceWidth + "px");
					$(".cover, .coverContainer").css("display","block");
				break;

				case "startRoll":
					game.activePlayer = game.players[game.clientNum];
					game.players[game.clientNum].roll();
				break;

				case "isRolling":
					game.activePlayer = game.players[args[1]];
					game.addToLogger(game.players[args[1]].name + " is rolling!");
				break;

				case "hasRolled":
					game.addToLogger(game.players[args[1]].name + " has rolled a " + args[2] + "!");
				break;

				case "whereMove":
					game.drawBoard();
					game.roll = args[1];
					game.determineNextSpace();
				break;

				case "moveTo":
					game.roll = args[2];
					game.players[args[1]].move(args[3].split("+"));
				break;

				case "react":
					game.addToLogger(game.activePlayer.name + " landed on a " + args[1] + " space!");
					socket.socketBasicSend("turnEnd");
				break;

				case "reactOther":
					game.addToLogger(game.activePlayer.name + " landed on a " + args[1] + " space!");
				break;
			}
		}
	}
};
window.onload = function(){
	game.init(
		$("#canvas").get(0).getContext("2d"),
		$("#logger").get(0),
		$("#tokenTracker").get(0)
	);

	$("#spaceWidthSlider").slider({
		animte: "fast",
		min: 5,
		max: game.ctx.canvas.width/5,
		step:5,
		orientation: "horizontal",
		value: game.spaceWidth
	});

	socket.init();
}

