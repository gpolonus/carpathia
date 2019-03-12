var game = {
	// init stuff
	winner : false,
	clientName : null,
	clientNum : -1,
	started : false,
	board : {},
	players : [],

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

	// turnStart : function()
	// {
	// 	var clientNum = this.clientNum;
	// 	var player = this.players;

	// 	if(players[clientNum].tokens < 0 && !players[clientNum].dead){
	// 		socket.send("died~" + clientNum + "~" + ((clientNum+1)%players.length) + "~");
	// 		return;
	// 	}
	// 	else if(players[clientNum].tokens > 0 && players[clientNum].dead)
	// 		socket.send("alived~"+ clientNum + "~");

	// 	players[clientNum].roll();
	// },

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
	}
};

// returns a player object
function getNewPlayer(num, name, color, space){

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
		}
	}
	space.init();
	return space;
}

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

