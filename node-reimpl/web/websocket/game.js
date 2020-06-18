function Game(context, logHolder, tokenTracker) {

	var ctx = context;
	var log = logHolder;
	logHolder.addEventListener("webkitAnimationEnd", function () {
		logHolder.style.animationName = "";
	}, false);
	ctx.canvas.width = window.innerWidth * 0.69;
	ctx.canvas.height = window.innerHeight - 10;
	// $(ctx.canvas).on("click mousemove", function(){
	// 	ctx.canvas.width = window.innerWidth * 0.69;
	// 	ctx.canvas.height = window.innerHeight - 10;
	// });
	var canLib = new CanvasLibrary(context);
	var utiLib = new UtilityLibrary();
	canLib.blackCanvas();
	var winner = false;
	var board = new Board();
	var carpathia = new Carpathia();
	var activePlayer;
	var carpathiaChance = 2;
	var carpathiaDecreaseAmount = 0.25;
	var nextRollValue = -1;
	window.setNextRollValue = num => nextRollValue = num;
	var spaceWidth;
	var startSpot;
	var clientName;
	var clientNum;
	board.drawBoard();
	var thisGame = this;
	var started = false;
	var unleashed = false;
	var diceImages = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image()];
	for (var i = 0; i < 6; i++)
		diceImages[i].src = "images/" + (i + 1) + ".png";
	var carpathiaWords = ["car", "pat", "hia"];
	var carpathiaDice = [];
	for (var i = 0; i < 3; i++) {
		carpathiaDice[i] = [];
		for (var j = 0; j < 4; j++) {
			carpathiaDice[i].push(new Image());
			carpathiaDice[i][j].src = "images/" + carpathiaWords[i] + "" + j + ".png";
		}

	}
	var devilFace = new Image();
	devilFace.src = "images/devil.png";


	function Board(num) {
		this.sideNum = num == undefined ? 10 : num;
		var that = this;
		this.image = new Image();
		this.image.src = "images/board.png";
		this.imageI = new Image();
		this.imageI.src = "images/boardi.png";
		this.head;
		var spacesArray = [];
		this.spacesArray = spacesArray;
		this.players = [];
		var playerColors = ["#f00", "#0f0", "#00f", "#0ff", "#f0f", "#ff0"];
		var types = [
			"green",
			"red",
			"white",
			"blue",
			"penalty"
			// "carpathia"
		];

		function fixBoard() {
			$(ctx.canvas).css("width", ("" + window.innerWidth * 0.69).split(".")[0] + "px");
			$(ctx.canvas).css("height", window.innerHeight - 10 + "px");
			$(tokenTracker).css("height", parseInt($(ctx.canvas).css("height")) * 0.1 + "px");
			$(logHolder).css("height", parseInt($(ctx.canvas).css("height")) * 0.9 + "px");
			startSpot = {
				x: 0,
				y: 0
			};
			if (ctx.canvas.width > ctx.canvas.height) {
				startSpot.x = (ctx.canvas.width - ctx.canvas.height) / 2;
				spaceWidth = ctx.canvas.height / (that.sideNum + 1);
			} else {
				startSpot.y = (ctx.canvas.height - ctx.canvas.width) / 2;
				spaceWidth = ctx.canvas.width / (that.sideNum + 1);
			}
		}

		function makeBoard() {
			fixBoard();
			that.head = new Space("start", [], [], startSpot.x + spaceWidth / 2, startSpot.y + spaceWidth / 2);
			spacesArray.push([that.head]);
			var temp = that.head;
			for (var i = 0; i < that.sideNum; i++) {
				temp.next.push(new Space(
					determineType(i), [], [temp],
					temp.x + spaceWidth,
					temp.y
				));
				spacesArray.push(temp.next);
				temp = temp.next[0];
			}
			for (var i = 0; i < that.sideNum; i++) {
				temp.next.push(new Space(
					determineType(i), [], [temp],
					temp.x,
					temp.y + spaceWidth
				));
				spacesArray.push(temp.next);
				temp = temp.next[0];
			}
			for (var i = 0; i < that.sideNum; i++) {
				temp.next.push(new Space(
					determineType(i), [], [temp],
					temp.x - spaceWidth,
					temp.y
				));
				spacesArray.push(temp.next);
				temp = temp.next[0];
			}
			for (var i = 0; i < that.sideNum - 1; i++) {
				temp.next.push(new Space(
					determineType(i), [], [temp],
					temp.x,
					temp.y - spaceWidth
				));
				spacesArray.push(temp.next);
				temp = temp.next[0];
			}
			temp.next.push(that.head);
			that.head.prev.push(temp);

			for (var i = 0; i < 6; i++) {
				spacesArray[Math.round(that.sideNum * 2 / 3 * i)][0].type = "start";
				spacesArray[(Math.round(that.sideNum * 2 / 3 * i) + Math.round(that.sideNum / 3)) % (that.sideNum * 4)][0].type = "carpathia";
			}

			function randomType() {
				return types[Math.floor(Math.random() * types.length)];
			}

			function determineType(num) {
				return types[num % types.length];
				// return (num%2 == 0 ? "green" : "red");
			}
		}
		makeBoard();

		this.makeNewPlayer = function (num, name) {
			// need to know num via server
			// will get instantiated and called upon opening of the socket
			// that.players.push(new Player(num, name));
			that.players[num] = new Player(num, name.replace(/[^a-zA-Z ]/g, ""), playerColors[num]);
		}

		// get the start space at the specified number
		this.getStart = function (num) {
			return spacesArray[Math.round(this.sideNum * 2 / 3 * num)][0];
		}

		function drawCarpathiaDieOnce(place, isThisADie, hovering, failure) {
			var start = {
				x: ctx.canvas.width / 2 - 4 * spaceWidth + place * spaceWidth * 3,
				y: ctx.canvas.height / 2 - spaceWidth
			};
			if (hovering) {
				canLib.drawRectangle(start.x - spaceWidth * 0.09, start.y - spaceWidth * 0.09, spaceWidth * 2.18, spaceWidth * 2.18, "#f00");
				canLib.drawRectangle(start.x - spaceWidth * 0.06, start.y - spaceWidth * 0.06, spaceWidth * 2.12, spaceWidth * 2.12, "#ff5c00");
				canLib.drawRectangle(start.x - spaceWidth * 0.03, start.y - spaceWidth * 0.03, spaceWidth * 2.06, spaceWidth * 2.06, "#ff0");
			} else {
				canLib.drawRectangle(start.x - spaceWidth * 0.09, start.y - spaceWidth * 0.09, spaceWidth * 2.18, spaceWidth * 2.18, "white");
				canLib.drawRectangle(start.x - spaceWidth * 0.06, start.y - spaceWidth * 0.06, spaceWidth * 2.12, spaceWidth * 2.12, "black");
				canLib.drawRectangle(start.x - spaceWidth * 0.03, start.y - spaceWidth * 0.03, spaceWidth * 2.06, spaceWidth * 2.06, "white");
			}

			if (isThisADie)
				ctx.drawImage(carpathiaDice[place][Math.round(Math.random() * 3)], start.x, start.y, spaceWidth * 2, spaceWidth * 2);
			else
				canLib.drawRectangle(start.x, start.y, spaceWidth * 2, spaceWidth * 2, "black");

			if (failure) {
				var old = ctx.lineWidth;
				ctx.lineWidth = 5;
				ctx.strokeStyle = "#800";
				ctx.beginPath();
				ctx.arc(start.x + spaceWidth, start.y + spaceWidth * 1.08, spaceWidth / 2, 0, Math.PI * 2);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(start.x + spaceWidth * 1.5, start.y + spaceWidth * 0.58);
				ctx.lineTo(start.x + spaceWidth * 0.5, start.y + spaceWidth * 1.58);
				ctx.stroke();
				ctx.strokeStyle = "#f00";
				ctx.beginPath();
				ctx.arc(start.x + spaceWidth, start.y + spaceWidth, spaceWidth / 2, 0, Math.PI * 2);
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(start.x + spaceWidth * 1.5, start.y + spaceWidth * 0.5);
				ctx.lineTo(start.x + spaceWidth * 0.5, start.y + spaceWidth * 1.5);
				ctx.stroke();
				ctx.lineWidth = old;
			}
		}

		this.drawCarpathiaDieOnce = drawCarpathiaDieOnce;

		function drawCarpathiaDie(place, isThisADie) {
			var start = {
				x: ctx.canvas.width / 2 - 4 * spaceWidth + place * spaceWidth * 3,
				y: ctx.canvas.height / 2 - spaceWidth
			};
			var ga = ctx.globalAlpha;
			ctx.globalAlpha = 0.5;
			if (isThisADie)
				ctx.drawImage(carpathiaDice[place][Math.round(Math.random() * 3)], start.x, start.y, spaceWidth * 2, spaceWidth * 2);
			else
				canLib.drawRectangle(start.x, start.y, spaceWidth * 2, spaceWidth * 2, "black");
			ctx.globalAlpha = ga;
		}

		function getScaler() {
			return {
				x: parseInt($(ctx.canvas).css("width")) / ctx.canvas.width,
				y: parseInt($(ctx.canvas).css("height")) / ctx.canvas.height
			};
		}

		function Space(type, nextSpaces, prevSpaces, x, y) {
			this.type = type;
			this.next = nextSpaces;
			this.prev = prevSpaces;
			this.x = x;
			this.y = y;
			this.topToken;
			this.player = [];
			var thisSpace = this;
			this.id = spacesArray.length;

			this.react = function () {
				// if(activePlayer.num == clientNum)
				// 	str = "You";
				// else
				// 	str = activePlayer.name;
				// addToLogger(str + " landed on a " + this.type + " space.");
				Chat.socket.send("reaction~" + clientName + "~" + this.type + "~");
				reactionFunctions[this.type]();
			}

			this.draw = function (drawingBig) {
				drawingFunctions[this.type](drawingBig);
				if (this.topToken != undefined) {
					ctx.fillStyle = board.players[this.topToken].color;
					ctx.strokeStyle = "black";
					ctx.beginPath();
					ctx.moveTo(this.x + 0.1 * spaceWidth, this.y - spaceWidth / 2);
					ctx.lineTo(this.x + 0.1 * spaceWidth, this.y - spaceWidth * 0.1);
					ctx.lineTo(this.x + 0.5 * spaceWidth, this.y - spaceWidth * 0.1);
					ctx.lineTo(this.x + 0.5 * spaceWidth, this.y + spaceWidth * 0.1);
					ctx.lineTo(this.x + 0.1 * spaceWidth, this.y + spaceWidth * 0.1);
					ctx.lineTo(this.x + 0.1 * spaceWidth, this.y + spaceWidth / 2);
					ctx.lineTo(this.x - 0.1 * spaceWidth, this.y + spaceWidth / 2);
					ctx.lineTo(this.x - 0.1 * spaceWidth, this.y + spaceWidth * 0.1);
					ctx.lineTo(this.x - 0.5 * spaceWidth, this.y + spaceWidth * 0.1);
					ctx.lineTo(this.x - 0.5 * spaceWidth, this.y - spaceWidth * 0.1);
					ctx.lineTo(this.x - 0.1 * spaceWidth, this.y - spaceWidth * 0.1);
					ctx.lineTo(this.x - 0.1 * spaceWidth, this.y - spaceWidth / 2);
					ctx.fill();
					ctx.stroke();
				}
			}

			this.placeTopToken = function (num) {
				this.topToken = num;
			}

			this.getTopToken = function () {
				return topToken;
			}

			var drawingFunctions = {
				'green': function (drawingBig) {
					if (drawingBig)
						width = spaceWidth * 1.5;
					else
						width = spaceWidth;
					canLib.drawRectangle(thisSpace.x - width * 0.4, thisSpace.y - width * 0.4, width * 0.8, width * 0.8, "#aaa");
					canLib.drawDiscatCenter(thisSpace.x, thisSpace.y, width * 0.35, "#0d0");
					canLib.drawDiscatCenter(thisSpace.x, thisSpace.y, width * 0.3, "#0f0");
				},
				'red': function (drawingBig) {
					if (drawingBig)
						width = spaceWidth * 1.5;
					else
						width = spaceWidth;
					canLib.drawRectangle(thisSpace.x - width * 0.4, thisSpace.y - width * 0.4, width * 0.8, width * 0.8, "#aaa");
					canLib.drawDiscatCenter(thisSpace.x, thisSpace.y, width * 0.35, "#d00");
					canLib.drawDiscatCenter(thisSpace.x, thisSpace.y, width * 0.3, "#f00");
				},
				'white': function (drawingBig) {
					if (drawingBig)
						width = spaceWidth * 1.5;
					else
						width = spaceWidth;
					canLib.drawRectangle(thisSpace.x - width * 0.4, thisSpace.y - width * 0.4, width * 0.8, width * 0.8, "#aaa");
					canLib.drawDiscatCenter(thisSpace.x, thisSpace.y, width * 0.35, "#ddd");
					canLib.drawDiscatCenter(thisSpace.x, thisSpace.y, width * 0.3, "#fff");
				},
				'blue': function (drawingBig) {
					if (drawingBig)
						width = spaceWidth * 1.5;
					else
						width = spaceWidth;
					canLib.drawRectangle(thisSpace.x - width * 0.4, thisSpace.y - width * 0.4, width * 0.8, width * 0.8, "#aaa");
					canLib.drawDiscatCenter(thisSpace.x, thisSpace.y, width * 0.35, "#00b");
					canLib.drawDiscatCenter(thisSpace.x, thisSpace.y, width * 0.3, "#00d");
				},
				'black': function (drawingBig) {
					if (drawingBig)
						width = spaceWidth * 1.5;
					else
						width = spaceWidth;
					canLib.drawRectangle(thisSpace.x - width * 0.4, thisSpace.y - width * 0.4, width * 0.8, width * 0.8, "#aaa");
					canLib.drawDiscatCenter(thisSpace.x, thisSpace.y, width * 0.35, "#000");
				},
				'start': function (drawingBig) {
					if (drawingBig)
						width = spaceWidth * 1.5;
					else
						width = spaceWidth;
					canLib.drawRectangle(thisSpace.x - width * 0.4, thisSpace.y - width * 0.4, width * 0.8, width * 0.8, "#aaa");
					canLib.drawRectangle(thisSpace.x - width * 0.3, thisSpace.y - width * 0.3, width * 0.6, width * 0.6, "#ccc");
					ctx.font = width / 4 + "px Courier New";
					ctx.strokeStyle = "#333";
					ctx.strokeText("START", thisSpace.x - width * 0.4, thisSpace.y - width * 0.0);
				},
				'penalty': function (drawingBig) {
					if (drawingBig)
						width = spaceWidth * 1.5;
					else
						width = spaceWidth;
					canLib.drawRectangle(thisSpace.x - width * 0.4, thisSpace.y - width * 0.4, width * 0.8, width * 0.8, "#aaa");
					canLib.drawRectangle(thisSpace.x - width * 0.3, thisSpace.y - width * 0.3, width * 0.6, width * 0.6, "#333");
					ctx.font = width / 3 + "px Courier New";
					ctx.strokeStyle = "#f00";
					ctx.fillStyle = "#FF5C00";
					ctx.fillText("FIRE", thisSpace.x - width * 0.4, thisSpace.y - width * 0.0);
					ctx.strokeText("FIRE", thisSpace.x - width * 0.4, thisSpace.y - width * 0.0);
				},
				'carpathia': function (drawingBig) {
					if (drawingBig)
						width = spaceWidth * 1.5;
					else
						width = spaceWidth;
					canLib.drawRectangle(thisSpace.x - width * 0.4, thisSpace.y - width * 0.4, width * 0.8, width * 0.8, "#aaa");
					canLib.drawRectangle(thisSpace.x - width * 0.4, thisSpace.y - width * 0.4, width * 0.8, width * 0.8, "#FF5C00");
					canLib.drawRectangle(thisSpace.x - width * 0.3, thisSpace.y - width * 0.3, width * 0.6, width * 0.6, "#f00");
					ctx.font = width / 2.5 + "px Courier New";
					ctx.strokeStyle = "#000";
					ctx.strokeText("CAR", thisSpace.x - width * 0.4, thisSpace.y - width * 0.2);
					ctx.strokeText("PAT", thisSpace.x - width * 0.4, thisSpace.y + width * 0.1);
					ctx.strokeText("HIA", thisSpace.x - width * 0.4, thisSpace.y + width * 0.4);
				}
			};

			var reactionFunctions = {
				"green": function () {
					Chat.socket.send("greenCard~" + clientNum + "~");
				},
				"red": function () {
					Chat.socket.send("redCard~" + clientNum + "~");
				},
				"white": function () {
					addToLogger("Roll again!");
					Chat.socket.send("broadcast~" + board.players[clientNum].name + " landed on a white space and is rolling again.");
					board.players[clientNum].roll();
				},
				"blue": function () {
					// make this a store place?
					Chat.socket.send("broadcast~" + clientName + " landed on a blue space. They get tokens!");
					Chat.socket.send("getTokens~" + clientNum + "~" + Math.round(Math.random() * 5));
					prepTurnEnd();
				},
				"black": function () {
					prepTurnEnd();
				},
				"start": function () {
					addToLogger("Roll again!");
					// Chat.socket.send("broadcast~" + board.players[clientNum].name + " landed on a start space and is rolling again.");
					alert("YOU ARE GREAT");
					Chat.socket.send("broadcast~" + "NEVER HAVE I EVER" + "~");
					board.players[clientNum].roll();
					// prepTurnEnd();
				},
				"penalty": function () {
					var startLocation = {
						x: ctx.canvas.width / 2 - 4 * spaceWidth,
						y: ctx.canvas.height / 2 - spaceWidth
					};

					function drawOption(text, place, big) {
						var start = {
							x: startLocation.x + place * spaceWidth * 3,
							y: startLocation.y
						};
						canLib.drawRectangle(start.x - spaceWidth * 0.4, start.y - spaceWidth * 0.4, spaceWidth * 2.8, spaceWidth * 2.8, "#FF5C00");
						canLib.drawRectangle(start.x - spaceWidth * 0.2, start.y - spaceWidth * 0.2, spaceWidth * 2.4, spaceWidth * 2.4, "#F00");
						canLib.drawRectangle(start.x, start.y, spaceWidth * 2, spaceWidth * 2, "black");
						ctx.strokeStyle = "#fff";
						if (big) {
							ctx.font = spaceWidth * 3 + "px Courier New";
							ctx.strokeText(("" + text)[0], start.x, start.y + spaceWidth * 2);
						} else {
							ctx.font = spaceWidth / 3 + "px Courier New";
							var str = '';
							var words = text.split(' ');
							var j = 1;
							for (var i = 0; i < words.length; i++) {
								if (str.length + words[i].length > 10) {
									ctx.strokeText(str, start.x, start.y + spaceWidth / 3 * (j++));
									str = "";
									i--;
								} else
									str += (str == "" ? "" : " ") + words[i];
							}
							ctx.strokeText(str, start.x, start.y + spaceWidth / 3 * (j++));
						}
					}

					function drawHovering(text, place, big) {

						var start = {
							x: startLocation.x + place * spaceWidth * 3,
							y: startLocation.y
						};
						canLib.drawRectangle(start.x - spaceWidth * 0.4, start.y - spaceWidth * 0.4, spaceWidth * 2.8, spaceWidth * 2.8, "#FF5C00");
						canLib.drawRectangle(start.x - spaceWidth * 0.2, start.y - spaceWidth * 0.2, spaceWidth * 2.4, spaceWidth * 2.4, "#F00");
						canLib.drawRectangle(start.x, start.y, spaceWidth * 2, spaceWidth * 2, "black");
						ctx.fillStyle = "#fff";
						if (big) {
							ctx.font = spaceWidth * 3 + "px Courier New";
							ctx.fillText(("" + text)[0], start.x, start.y + spaceWidth * 2);
						} else {
							ctx.font = spaceWidth / 3 + "px Courier New";
							var str = '';
							var words = text.split(' ');
							var j = 1;
							for (var i = 0; i < words.length; i++) {
								if (str.length + words[i].length + 1 > 10) {
									ctx.fillText(str, start.x, start.y + spaceWidth / 3 * (j++));
									str = "";
									i--;
								} else
									str += (str == "" ? "" : " ") + words[i];
							}
							ctx.fillText(str, start.x, start.y + spaceWidth / 3 * (j++));
						}
					}

					function drawChosen(text, place) {

						var start = {
							x: startLocation.x + place * spaceWidth * 3,
							y: startLocation.y
						};
						canLib.drawRectangle(start.x - spaceWidth * 0.4, start.y - spaceWidth * 0.4, spaceWidth * 2.8, spaceWidth * 2.8, "#00F");
						canLib.drawRectangle(start.x - spaceWidth * 0.2, start.y - spaceWidth * 0.2, spaceWidth * 2.4, spaceWidth * 2.4, "#0FF");
						canLib.drawRectangle(start.x, start.y, spaceWidth * 2, spaceWidth * 2, "white");
						ctx.strokeStyle = "#000";
						ctx.font = spaceWidth / 3 + "px Courier New";
						var str = '';
						var words = text.split(' ');
						var j = 1;
						for (var i = 0; i < words.length; i++) {
							if (str.length + words[i].length > 10) {
								ctx.strokeText(str, start.x, start.y + spaceWidth / 3 * (j++));
								str = "";
								i--;
							} else
								str += (str == "" ? "" : " ") + words[i];
						}
						ctx.strokeText(str, start.x, start.y + spaceWidth / 3 * (j++));
					}

					var possibilities = [{
							text: "You got Griffin's website! Good job!",
							func: function () {
								window.open("https://grifstuf.com");
								Chat.socket.send("broadcast~" + clientName + " got to go to Griffin's website!");
								prepTurnEnd();
							}
						},
						// {
						// 	text: "You get 10 confirms!",
						// 	func: function(){
						// 		// var answer = false;
						// 		// Chat.socket.send("broadcast~" + clientName + " has to proclaim their stupidity.");
						// 		// for(var i = 0; i < 10; i++){
						// 		// 	answer = confirm("For the "+i+"th time, are you stupid?");
						// 		// 	while(!answer)
						// 		// 		confirm("Again, are you stupid?");
						// 		// }
						// 		// prepTurnEnd();
						// 		alert("You are great!");
						// 		prepTurnEnd();
						// 	}
						// },
						{
							text: "You got 10 tokens!",
							func: function () {
								Chat.socket.send("getTokens~" + clientNum + "~10~");
								prepTurnEnd();
							}
						},
						{
							text: "You lost 10 tokens!",
							func: function () {
								Chat.socket.send("loseTokens~" + clientNum + "~10~");
								prepTurnEnd();
							}
						},
						{
							text: "You are great! Give yourself a pat on the back!",
							func: function () {
								Chat.socket.send("broadcast~" + clientName + " is having a great day!~");
								board.players[clientNum].roll();
								// prepTurnEnd();
							}
						},
						{
							text: "You get to roll again!",
							func: function () {
								Chat.socket.send("broadcast~" + clientName + " gets to roll again!~");
								board.players[clientNum].roll();
								// prepTurnEnd();
							}
						}
					];

					var actualities = [possibilities.splice(Math.floor(Math.random() * possibilities.length), 1)[0], possibilities.splice(Math.floor(Math.random() * possibilities.length), 1)[0], possibilities.splice(Math.floor(Math.random() * possibilities.length), 1)[0]];
					var scaler = getScaler();

					$(ctx.canvas).on("click", function () {
						if (event.x * scaler.x < startLocation.x + spaceWidth * 2 && event.x * scaler.x > startLocation.x && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							drawChosen(actualities[0].text, 0);
							drawOption(actualities[1].text, 1);
							drawOption(actualities[2].text, 2);
							$(ctx.canvas).off("click");
							$(ctx.canvas).off("mousemove");
							actualities[0].func();
						} else if (event.x * scaler.x < startLocation.x + spaceWidth * 5 && event.x * scaler.x > startLocation.x + spaceWidth * 3 && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							drawOption(actualities[0].text, 0);
							drawChosen(actualities[1].text, 1);
							drawOption(actualities[2].text, 2);
							$(ctx.canvas).off("click");
							$(ctx.canvas).off("mousemove");
							actualities[1].func();
						} else if (event.x * scaler.x < startLocation.x + spaceWidth * 8 && event.x * scaler.x > startLocation.x + spaceWidth * 6 && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							drawOption(actualities[0].text, 0);
							drawOption(actualities[1].text, 1);
							drawChosen(actualities[2].text, 2);
							$(ctx.canvas).off("click");
							$(ctx.canvas).off("mousemove");
							actualities[2].func();
						}

					});

					$(ctx.canvas).on("mousemove", function () {
						if (event.x * scaler.x < startLocation.x + spaceWidth * 2 && event.x * scaler.x > startLocation.x && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							drawHovering(1, 0, true);
						} else if (event.x * scaler.x < startLocation.x + spaceWidth * 5 && event.x * scaler.x > startLocation.x + spaceWidth * 3 && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							drawHovering(2, 1, true);
						} else if (event.x * scaler.x < startLocation.x + spaceWidth * 8 && event.x * scaler.x > startLocation.x + spaceWidth * 6 && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							drawHovering(3, 2, true);
						} else {
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
				"carpathia": function () {
					if (unleashed) {
						Chat.socket.send("getTokens~" + clientNum + "~5~");
						prepTurnEnd();
						return;
					}
					Chat.socket.send("broadcast~" + clientName + " is rolling the CARPATHIA dice!~");
					var startLocation = {
						x: ctx.canvas.width / 2 - 4 * spaceWidth,
						y: ctx.canvas.height / 2 - spaceWidth
					};
					// drawCarpathiaDie(0);
					// drawCarpathiaDie(1);
					// drawCarpathiaDie(2);

					var rolling = [true, true, true];
					var rollingSuccess = [undefined, undefined, undefined];
					var successes = 0;
					var hovering = [false, false, false];

					function showCarpathiaDice() {
						var notRolling = 0;
						for (var i = 0; i < 3; i++) {
							if (rolling[i]) {
								drawCarpathiaDie(i, Math.round(Math.random() * 2) == 0, hovering[i]);
							} else {
								notRolling++;
								if (rollingSuccess[i] == undefined) {
									// carpathia Percentage
									if (Math.round(Math.random() * carpathiaChance) == 0)
									// if(Math.round(Math.random()*0) == 0)
									{
										rollingSuccess[i] = true;
										successes++;
										Chat.socket.send("carpathiaSuccess~" + i + "~" + clientNum + "~");
									} else {
										rollingSuccess[i] = false;
										Chat.socket.send("carpathiaFailure~" + i + "~" + clientNum + "~");
									}
								}
							}
						}

						if (notRolling < 3)
							setTimeout(showCarpathiaDice, 1);
						else if (successes > 0) {
							var tempSuccess = 0;
							Chat.socket.send("broadcast~" + clientName + " is still rolling to summon the antiChrist!");
							for (var i = 0; i < 3; i++) {
								if (!rollingSuccess[i]) {
									rolling[i] = true;
									rollingSuccess[i] = undefined;
								} else
									tempSuccess++;
							}
							successes = 0;
							if (tempSuccess == 3) {
								$(ctx.canvas).off("click");
								$(ctx.canvas).off("mousemove");
								Chat.socket.send("unleashed~" + clientNum + "~");
							} else
								setTimeout(showCarpathiaDice, 1);
						} else {
							Chat.socket.send("broadcast~" + clientName + " failed to summon the antiChrist. Dammit!");
							carpathiaChance -= carpathiaDecreaseAmount;
							$(ctx.canvas).off("click");
							$(ctx.canvas).off("mousemove");
							prepTurnEnd();
						}
					}

					var scaler = getScaler();
					$(ctx.canvas).on("click", function () {
						if (event.x * scaler.x < startLocation.x + spaceWidth * 2 && event.x * scaler.x > startLocation.x && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							rolling[0] = false;
						} else if (event.x * scaler.x < startLocation.x + spaceWidth * 5 && event.x * scaler.x > startLocation.x + spaceWidth * 3 && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							rolling[1] = false;
						} else if (event.x * scaler.x < startLocation.x + spaceWidth * 8 && event.x * scaler.x > startLocation.x + spaceWidth * 6 && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							rolling[2] = false;
						}
					});
					var lastHover;
					$(ctx.canvas).on("mousemove", function () {
						if (rolling[0] && event.x * scaler.x < startLocation.x + spaceWidth * 2 && event.x * scaler.x > startLocation.x && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							if (!hovering[0]) {
								lastHover = 0;
								hovering[0] = true;
								drawCarpathiaDieOnce(0, true, true);
							}
						} else if (rolling[1] && event.x * scaler.x < startLocation.x + spaceWidth * 5 && event.x * scaler.x > startLocation.x + spaceWidth * 3 && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							if (!hovering[1]) {
								lastHover = 1;
								hovering[1] = true;
								drawCarpathiaDieOnce(1, true, true);
							}
						} else if (rolling[2] && event.x * scaler.x < startLocation.x + spaceWidth * 8 && event.x * scaler.x > startLocation.x + spaceWidth * 6 && event.y * scaler.y > startLocation.y && event.y * scaler.y < startLocation.y + spaceWidth * 2) {
							if (!hovering[2]) {
								lastHover = 2;
								hovering[2] = true;
								drawCarpathiaDieOnce(2, true, true);
							}
						} else {
							hovering = [false, false, false];
							if (lastHover !== undefined) {
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
			};
		}

		// draws the board and all the players, but if the dontDraw is supplied then that player is not drawn
		this.drawBoard = function (dontDraw) {
			fixBoard();
			canLib.blackCanvas();
			if (!unleashed)
				ctx.drawImage(this.image, startSpot.x, startSpot.y, spaceWidth * (this.sideNum + 1), spaceWidth * (this.sideNum + 1));
			else
				ctx.drawImage(this.imageI, startSpot.x, startSpot.y, spaceWidth * (this.sideNum + 1), spaceWidth * (this.sideNum + 1));
			ctx.font = (this.sideNum * spaceWidth / 8) + "px Courier New";
			ctx.strokeStyle = unleashed ? "black" : "white";
			ctx.strokeText("LEFT BEHIND", startSpot.x + spaceWidth * 1.5, startSpot.y + spaceWidth * 4);

			for (var i = 0; i < spacesArray.length; i++) {
				for (var j = 0; j < spacesArray[i].length; j++)
					spacesArray[i][j].draw(false);
			}
			for (var i = 0; i < this.players.length; i++) {
				this.players[i].space.draw(true);
				this.players[i].drawPlayer();
			}

			if (unleashed && carpathia.space) {
				carpathia.space.draw(true);
				carpathia.drawPlayer();
			}
		}

		this.playerOnSpace = function (space) {
			for (var i = 0; i < this.players.length; i++)
				if (space.id == this.players[i].space.id)
					return i;
			return;
		};
	}

	function Player(num, name, color) {
		console.log({
			num,
			name,
			color
		});
		this.num = num;
		this.name = name;
		this.image = new Image();
		this.dead = false;
		// this.image.src = "images/piece" + num + ".png";
		this.image.src = "images/nc.png";
		this.space = board.getStart(num);
		var that = this;
		this.x = this.space.x;
		this.y = this.space.y;
		this.tokens = 0;
		this.ready = false;
		this.color = color;
		this.response;

		// puts a roll animation on the screen and rolls dice
		this.roll = function () {
			// var roll = Math.round(Math.random()*5) + 1;
			// var roll;

			var rolling = true;
			var point = {
				x: ctx.canvas.width / 2 - spaceWidth * 1.5 + spaceWidth / 2,
				y: ctx.canvas.height / 2 - spaceWidth * 1.5 + spaceWidth * 0.2
			};

			function showDiceNumber(num) {
				if (rolling) {
					var ga = ctx.globalAlpha;
					ctx.globalAlpha = 0.5;
					ctx.drawImage(diceImages[num], point.x, point.y, spaceWidth * 3, spaceWidth * 3);
					ctx.globalAlpha = ga;
					setTimeout(showDiceNumber, 50, (num + 1) % 6);
				} else {
					const realRollNum = nextRollValue === -1 ? num : nextRollValue;
					Chat.socket.send("rolled~" + (realRollNum + 1) + "~" + clientNum + "~");
					nextRollValue = -1;
				}
			}

			$(ctx.canvas).on("click", function () {
				rolling = false;
				$(ctx.canvas).off("click");
				$("body").off("keyup");
				// if(event.x > parseInt($(ctx.canvas).css("width"))/2-spaceWidth*1.5*parseInt($(ctx.canvas).css("width"))/ctx.canvas.width &&
				// 	event.x < parseInt($(ctx.canvas).css("width"))/2+spaceWidth*1.5*parseInt($(ctx.canvas).css("width"))/ctx.canvas.width &&
				// 	event.y > parseInt($(ctx.canvas).css("height"))/2-spaceWidth*1.5*parseInt($(ctx.canvas).css("height"))/ctx.canvas.height &&
				// 	event.y < parseInt($(ctx.canvas).css("height"))/2+spaceWidth*1.5*parseInt($(ctx.canvas).css("height"))/ctx.canvas.height)
				// {
				// }
			});

			$("body").on("keyup", function () {
				if (event.which != 32)
					return;
				rolling = false;
				$(ctx.canvas).off("click");
				$("body").off("keyup");
			});

			canLib.drawRectangle(point.x - spaceWidth * 0.09, point.y - spaceWidth * 0.09, spaceWidth * 3.18, spaceWidth * 3.18, "black");
			canLib.drawRectangle(point.x - spaceWidth * 0.06, point.y - spaceWidth * 0.06, spaceWidth * 3.12, spaceWidth * 3.12, "white");
			canLib.drawRectangle(point.x - spaceWidth * 0.03, point.y - spaceWidth * 0.03, spaceWidth * 3.06, spaceWidth * 3.06, "black");
			showDiceNumber(0);


			// this.move(roll);
		}

		this.move = function (roll) {
			if (roll == 0) {
				if (this.num == clientNum) {
					// if(unleashed){
					// 	this.space.topToken = this.num;
					// }
					this.react();
				}
			} else if (this.space.next.length > 1) {
				// might add asking functionality for multiple paths
				ask();
			} else {
				this.space = this.space.next[0];
				this.drawMove(roll - 1);
			}
		}

		// this.drawTokens = function(num)
		// {
		// 	color == undefined ? board.playerColors[this.num] : board.playerColors[num];
		// }

		this.react = function () {
			if (unleashed) {
				Chat.socket.send("placeTopToken~" + clientNum + "~" + this.space.id + "~");
				// if(this.space.id == carpathia.space.id)
				// 	Chat.socket.send("carpathiaHit~" + clientNum + "~");
			}
			this.space.react();
		}

		this.drawMove = function (movesLeft) {
			if (movesLeft < 0) {
				alert("The Game Fucked Up. Why Are All These Words capitolized?");
				return;
			}
			board.drawBoard(that.num);
			var center = {
				x: ctx.canvas.width / 2 + spaceWidth / 2,
				y: ctx.canvas.height / 2 + spaceWidth * 0.2
			};
			for (var i = 0; i < 5; i++) {
				canLib.drawRectangle(
					center.x + spaceWidth * 2 * Math.cos(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.35,
					center.y + spaceWidth * 2 * Math.sin(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.35,
					spaceWidth * 0.7,
					spaceWidth * 0.7,
					"#f00"
				);
				canLib.drawRectangle(
					center.x + spaceWidth * 2 * Math.cos(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.3,
					center.y + spaceWidth * 2 * Math.sin(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.3,
					spaceWidth * 0.6,
					spaceWidth * 0.6,
					"black"
				);
				ctx.drawImage(
					diceImages[movesLeft],
					center.x + spaceWidth * 2 * Math.cos(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.25,
					center.y + spaceWidth * 2 * Math.sin(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.25,
					spaceWidth * 0.5,
					spaceWidth * 0.5
				);
			}
			var dist = utiLib.distance(that.x, that.y, that.space.x, that.space.y);
			if (dist < 2) {
				that.x = that.space.x;
				that.y = that.space.y;
				that.drawPlayer();
				that.move(movesLeft);
			} else {
				that.x += (that.space.x - that.x) / dist * 2;
				that.y += (that.space.y - that.y) / dist * 2;
				that.drawPlayer();
				setTimeout(that.drawMove, 1, movesLeft);
			}
		}

		this.drawPlayer = function (num) {
			num = num == undefined ? this.num : num;
			// ctx.drawImage(this.image, this.x - spaceWidth*0.4, this.y - spaceWidth*0.4, spaceWidth*0.8, spaceWidth*0.8);
			ctx.drawImage(this.image, 0, 0, 419, 516, this.x - spaceWidth * 0.35, this.y - spaceWidth * 0.4, spaceWidth * 0.7, spaceWidth * 0.8);
			ctx.globalAlpha = 0.4;
			canLib.drawRectangle(this.x - spaceWidth * 0.35, this.y - spaceWidth * 0.4, spaceWidth * 0.7, spaceWidth * 0.8, this.color);
			ctx.globalAlpha = 1;
			if (this.dead) {
				ctx.lineWidth = 5;
				ctx.strokeStyle = "black";
				ctx.beginPath();
				ctx.moveTo(this.x - spaceWidth / 2, this.y - spaceWidth / 2);
				ctx.lineTo(this.x + spaceWidth / 2, this.y + spaceWidth / 2);
				ctx.closePath();
				ctx.stroke();
				ctx.beginPath();
				ctx.moveTo(this.x + spaceWidth / 2, this.y - spaceWidth / 2);
				ctx.lineTo(this.x - spaceWidth / 2, this.y + spaceWidth / 2);
				ctx.closePath();
				ctx.stroke();
				ctx.lineWidth = 1;
			}
		}
	}

	// goes to the view and makes buttons and waits for an event answer and responds with functional parameters
	// function ask(question, functionArray)
	// {
	// 	// makes buttons and binds them to the functions given with addEventListener
	// 	var str = "<ul><li id='question'>" + question + "</li>";
	// 	for(var i in functionArray){
	// 		str += "<li><button type='button' id='button" + i + "'>" + i + "</button></li>";
	// 	}
	// 	buttons.innerHTML = str + "</ul>";
	// 	for(var i in functionArray) {
	// 		$("#button" + i).on("click", function(){
	// 			if(functionArray[i]())
	// 				$("#question,#button" + i).remove();
	// 		});
	// 	}
	// }

	// part of the turn reactions
	function displayCard(card, type) {
		// uses the view to display the card info to all players
		// 	might give the option for red cards and definitely shows for all green cards and shows what the answer is
		// 	might just show the green card to the next player and have them read it? naah
	}

	function turnStart() {
		// board.drawBoard();
		// activePlayer.roll();
		if (board.players[clientNum].tokens < 0 && !board.players[clientNum].dead) {
			Chat.socket.send("died~" + clientNum + "~" + ((clientNum + 1) % board.players.length) + "~");
			return;
		} else if (board.players[clientNum].tokens > 0 && board.players[clientNum].dead)
			Chat.socket.send("alived~" + clientNum + "~");

		// else if(!board.players[clientNum].dead)
		board.players[clientNum].roll();
	}

	function prepTurnEnd() {
		setTimeout(function () {
			// ask("Are you ready to end your turn?", {"Sure" : function(){
			// 	turnEnd();
			// 	return true;
			// }});
			$(".coverContainerContents").css("background-color", "#fff");
			$(".cover").css("background-color", "#000");
			$(".coverContainer h2").css("color", "#000");
			$(".coverContainer h4").css("color", "#333");
			$(".coverContainerContents").html("" +
				"<ul>" +
				"<li><h2><span class='name" + clientNum + "'>" + clientName + "</span>, are you ready to finish your turn?</h2></li>" +
				"<li><button id='endTurnButton' class='bigButton'>Sure</button></li>" +
				"</ul>" +
				"");
			$("#endTurnButton").css("font-size", spaceWidth + "px");
			$(".cover, .coverContainer").css("display", "block");
			$("#endTurnButton").focus();
			$("#endTurnButton").on("keyup", function () {
				if (event.which != 32)
					return;
				$("#endTurnButton").off("click");
				$("#endTurnButton").off("keyup");
				$(".cover, .coverContainer").css("display", "none");
				turnEnd();
			});

			$("#endTurnButton").on("click", function () {
				$("#endTurnButton").off("click");
				$("#endTurnButton").off("keyup");
				$(".cover, .coverContainer").css("display", "none");
				turnEnd();
			});
		}, 2000);
	}

	function turnEnd() {
		var result = winning();
		if (result === false) {
			var alive = false;
			for (var i = 0; i < board.players.length; i++) {
				$("#playerTokens" + i).html(board.players[i].tokens);
				if (!board.players[i].dead)
					alive = true;
			}
			if (!alive && unleashed) {
				Chat.socket.send("allDead~");
			} else
				Chat.socket.send("yourTurn~" + (clientNum + 1) % board.players.length + "~");
		} else {
			Chat.socket.send("winner~" + result + "~");
		}
	}

	function displayWinner(num) {
		$(".coverContainerContents").css("background-color", "#000");
		$(".coverContainerContents").css("color", "#fff");
		$(".coverContainerContents h1").css("color", "#fff");
		$(".coverContainerContents h2").css("color", "#fff");
		$(".coverContainerContents h3").css("color", "#fff");
		$(".coverContainerContents").html("" +
			"<ul>" +
			"<li><h1><span class='name" + num + "'>" + board.players[num].name + "</span></h1></li>" +
			"<li><h2>IS THE WINNER</h2></li>" +
			"<li><h3>POOP TO THE REST OF YOU</h3></li>" +
			"</ul>" +
			"");
		$(".cover, .coverContainer").css("display", "block");
	}

	function winning() {
		// for(var i  = 0; i < board.players.length; i++)
		// 	if(1*board.players[i].tokens >= 20)
		// 		return i;
		// return false;
		return winner;
	}

	function addToLogger(str) {
		function updateStr(text, clas) {
			str = str.replace(new RegExp(text, "g"), "<span class='" + clas + "'>" + text + "</span>");
		}

		for (var i = 0; i < board.players.length; i++)
			if (board.players[i].dead)
				str = str.replace(new RegExp(board.players[i].name, "g"), "<span class='name" + i + "'>💀" + board.players[i].name + "💀</span>");
			else
				str = str.replace(new RegExp(board.players[i].name, "g"), "<span class='name" + i + "'>" + board.players[i].name + "</span>");
		updateStr("You", "name" + clientNum);
		updateStr("rolled", "rolled");
		updateStr("token", "token");
		// str = str.replace(new RegExp("^"+clientName, "g"), "You");

		$(logHolder).html("<p>" + str + "</p><hr />" + $(logHolder).html());
		logHolder.style.animationName = "flashLoggerMessage";
	}


	function Carpathia() {
		this.image = new Image();
		this.image.src = "images/ob.png";
		var evilDice = [];
		for (var i = 0; i < 6; i++) {
			evilDice.push(new Image());
			evilDice[i].src = "images/evilDice" + (i + 1) + ".png";
		}
		// this.space = this.newPlace();
		this.space;
		// this.x = this.space.x;
		// this.y = this.space.y;
		this.x;
		this.y;
		var that = this;
		this.rolling = false;

		this.newPlace = function () {
			var unOccupied;
			// var space = utiLib.randomEntry(board.spacesArray)[0];
			var spaceNum;
			do {
				spaceNum = Math.round(Math.random() * (board.spacesArray.length - 1));
				unOccupied = true;
				for (var i = 0; i < board.players.length; i++) {
					if (board.players[i].space.id == board.spacesArray[spaceNum][0].id) {
						unOccupied = false;
						break;
					}
				}
			} while (!unOccupied)
			return spaceNum;
		}

		this.drawPlayer = function () {
			ctx.drawImage(this.image, this.x - spaceWidth / 2, this.y - spaceWidth / 2, spaceWidth, spaceWidth);
		}

		this.roll = function () {
			var point = {
				x: ctx.canvas.width / 2 - spaceWidth * 1.5 + spaceWidth / 2,
				y: ctx.canvas.height / 2 - spaceWidth * 1.5 + spaceWidth * 0.2
			};
			var dice = 3;
			that.rolling = true;

			function showDiceNumber(num) {
				var ga = ctx.globalAlpha;
				ctx.globalAlpha = 0.5;
				ctx.drawImage(evilDice[num], point.x, point.y, spaceWidth * 3, spaceWidth * 3);
				ctx.globalAlpha = ga;
				if (that.rolling)
					setTimeout(showDiceNumber, 50, (num + 1) % 6);
			}

			function makeDiceNumber() {
				var tempRoll = Math.round(Math.random() * 5) + 1;
				Chat.socket.send("broadcast~Carpathia rolled a " + tempRoll + ".~");
				// if(--dice != 0)
				// 	setTimeout(makeDiceNumber, 5000);
				// else{
				that.rolling = false;
				Chat.socket.send("carpathiaMove~" + tempRoll + "~");
				// }
			}
			if (clientNum == 0)
				setTimeout(makeDiceNumber, 5000);

			canLib.drawRectangle(point.x - spaceWidth * 0.09, point.y - spaceWidth * 0.09, spaceWidth * 3.18, spaceWidth * 3.18, "white");
			canLib.drawRectangle(point.x - spaceWidth * 0.06, point.y - spaceWidth * 0.06, spaceWidth * 3.12, spaceWidth * 3.12, "black");
			canLib.drawRectangle(point.x - spaceWidth * 0.03, point.y - spaceWidth * 0.03, spaceWidth * 3.06, spaceWidth * 3.06, "white");
			showDiceNumber(0);
		}

		this.react = function () {
			var person = board.playerOnSpace(this.space);
			if (person != undefined) {
				Chat.socket.send("carpathiaHit~" + person + "~");
			} else if (this.space.topToken != undefined) {
				winner = this.space.topToken;
				turnEnd();
			} else {
				Chat.socket.send("broadcast~Carpathia missed everyone this time!");
				Chat.socket.send("yourTurn~0~");
			}
		}

		this.move = function (roll) {
			var direction = determineDirection();

			drawMoveInit(roll);

			function determineDirection() {
				var tempSpaceNext = that.space;
				var tempSpacePrev = that.space;
				while (true) {
					tempSpaceNext = tempSpaceNext.next[0];
					tempSpacePrev = tempSpacePrev.prev[0];
					for (var i = 0; i < board.players.length; i++) {
						if (board.players[i].space.id == tempSpaceNext.id && !board.players[i].dead)
							return true;
						if (board.players[i].space.id == tempSpacePrev.id && !board.players[i].dead)
							return false;
					}
				}

			}

			function drawMoveInit(roll) {
				if (roll == 0) {
					if (clientNum == 0)
						that.react();
					return;
				}

				for (var i = 0; i < board.players.length; i++)
					if (!board.players[i].dead && that.space.id == board.players[i].space.id) {
						if (clientNum == 0)
							that.react();
						return;
					}

				if (direction)
					that.space = that.space.next[0];
				else
					that.space = that.space.prev[0];

				drawMove(roll - 1);
			}

			function drawMove(roll) {
				board.drawBoard(that.num);
				var center = {
					x: ctx.canvas.width / 2 + spaceWidth / 2,
					y: ctx.canvas.height / 2 + spaceWidth * 0.2
				};
				for (var i = 0; i < 5; i++) {
					canLib.drawRectangle(
						center.x + spaceWidth * 2 * Math.cos(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.35,
						center.y + spaceWidth * 2 * Math.sin(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.35,
						spaceWidth * 0.7,
						spaceWidth * 0.7,
						"black"
					);
					canLib.drawRectangle(
						center.x + spaceWidth * 2 * Math.cos(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.3,
						center.y + spaceWidth * 2 * Math.sin(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.3,
						spaceWidth * 0.6,
						spaceWidth * 0.6,
						"#f00"
					);
					ctx.drawImage(
						evilDice[roll],
						center.x + spaceWidth * 2 * Math.cos(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.25,
						center.y + spaceWidth * 2 * Math.sin(Math.PI * 2 / 5 * i + Math.PI / 2) - spaceWidth * 0.25,
						spaceWidth * 0.5,
						spaceWidth * 0.5
					);
				}
				var dist = utiLib.distance(that.x, that.y, that.space.x, that.space.y);
				if (dist < 3) {
					that.x = that.space.x;
					that.y = that.space.y;
					that.drawPlayer();
					drawMoveInit(roll);
				} else {
					that.x += (that.space.x - that.x) / dist * 2;
					that.y += (that.space.y - that.y) / dist * 2;
					that.drawPlayer();
					setTimeout(drawMove, 1, roll);
				}

			}

		}

		this.arrive = function (playerNum, num, newSpace) {
			num = num == undefined ? 1 : num;
			if (newSpace != undefined) {
				this.space = board.spacesArray[newSpace][0];
				this.x = this.space.x;
				this.y = this.space.y;
			}
			if (num > 0) {
				board.drawBoard();
				ctx.globalAlpha = 1 - num;
				var distPoint = utiLib.distance(0, 0, that.x - spaceWidth / 2, that.y - spaceWidth / 2);
				var distArea = utiLib.distance(spaceWidth, spaceWidth, spaceWidth * board.sideNum, spaceWidth * board.sideNum);
				ctx.drawImage(
					that.image,
					(num) * (spaceWidth / 2 - that.x) + that.x - spaceWidth / 2,
					(num) * (spaceWidth / 2 - that.y) + that.y - spaceWidth / 2,
					(num) * (spaceWidth * (board.sideNum - 1)) + spaceWidth,
					(num) * (spaceWidth * (board.sideNum - 1)) + spaceWidth
				);
				setTimeout(that.arrive, 50, playerNum, num - 0.01);
			} else {
				board.drawBoard();
				that.drawPlayer();
				ctx.globalAlpha = 1;
				if (clientNum == playerNum) {
					Chat.socket.send("getTokens~" + playerNum + "~5~");
					prepTurnEnd();
				}
			}
		}

	}

	// procedure = new Procedure([
	// 	turnStart,
	// 	activePlayer.roll,
	// 	activePlayer.move,
	// 	activePlayer.react,
	// 	turnEnd
	// ]);

	// turnStart();

	var Chat = {};

	Chat.socket = null;

	Chat.connect = (function (host) {
		if ('WebSocket' in window) {
			try {
				Chat.socket = new WebSocket(host);
			} catch (err) {
				alert("Well shit");
			}
		} else if ('MozWebSocket' in window) {
			Chat.socket = new MozWebSocket(host);
		} else {
			console.log('Error: WebSocket is not supported by this browser.');
			return;
		}

		Chat.socket.onopen = function () {
			console.log('Info: WebSocket connection opened.');
			this.send("newPlayer~" + clientName + '~');
		};

		Chat.socket.onclose = function () {
			console.log('Info: WebSocket closed.');
			$(".coverContainerContents").css("background-color", "#000");
			$(".cover").css("background-color", "#000");
			$(".coverContainerContents").html("" +
				"<ul>" +
				"<li><h2>SOCKET CLOSED</h2></li>" +
				"<li><h4>SOMETHING COCKED UP THE GAME</h4></li>" +
				"</ul>" +
				"");
			$(".coverContainer h2").css("color", "#F00");
			$(".coverContainer h4").css("color", "#F00");
			$(".cover, .coverContainer").css("display", "block");
		};

		Chat.socket.onmessage = function (message) {
			console.log(message.data);
			if (message.data.indexOf("~") == -1)
				return;
			var args = message.data.split("~");
			switch (args[0]) {
				// at the beginning each person gets all the info about all the other players
				case "otherNewPlayers":
					var num = board.players.length;
					var nameNum;
					for (var i = 1; i < args.length - 1; i++) {
						if (args[i] != "") {
							nameNum = args[i].split('|');
							board.makeNewPlayer(nameNum[1], nameNum[0].replace(/[^a-zA-Z ]/g, ""));
							num++;
						}
					}
					if (clientNum == undefined) {
						if (board.players.filter(p => p.num == 0).length) {
							clientNum = num;
						} else {
							clientNum = 0;
						}

						board.makeNewPlayer(clientNum, clientName);
					}
					if (args[1] != '') {
						// ask("Are you ready to play?", {
						// 	"Start" : function() {
						// 		addToLogger("You are ready!");
						// 		Chat.socket.send("ready~" + clientNum + '~');
						// 		return true;
						// 	}
						// });
						$(".coverContainerContents").css("background-color", board.players[clientNum].color);
						$(".cover").css("background-color", "#000");
						$(".coverContainer h2").css("color", board.players[clientNum].color.replace(/0/g, "F").replace(/f/g, "0"));
						$(".coverContainer h4").css("color", board.players[clientNum].color.replace(/0/g, "F").replace(/f/g, "0"));
						$(".coverContainerContents").html("" +
							"<ul>" +
							"<li><h2>Are you, <span style='font-weight:bold'>" + clientName + "</span>, ready to start the game?</h2></li>" +
							"<li><button id='startGameButton' class='bigButton'>Ready!</button></li>" +
							"</ul>" +
							"");
						// $("#startGameButton").css("font-size", spaceWidth + "px");
						$(".cover, .coverContainer").css("display", "block");
						$("#startGameButton").focus();
						$("#startGameButton").on("keyup", function () {
							if (event.which != 32)
								return;
							$("#startGameButton").off("click");
							$("#startGameButton").off("keyup");
							$(".cover, .coverContainer").css("display", "none");
							addToLogger("You are ready!");
							Chat.socket.send("ready~" + clientNum + '~');
							// countDownToStart(30);
						});

						$("#startGameButton").on("click", function () {
							$("#startGameButton").off("click");
							$("#startGameButton").off("keyup");
							$(".cover, .coverContainer").css("display", "none");
							addToLogger("You are ready!");
							Chat.socket.send("ready~" + clientNum + '~');
							// countDownToStart(30);
						});

						function countDownToStart(num) {
							if (num != -1) {
								$(".coverContainerContents").html("<h2 id='countDown'>" + num + "</h2>");
								setTimeout(countDownToStart, 1000, num - 1);
							} else {
								Chat.socket.send("ready~" + clientNum + '~');
							}
						}
					}
					break;

					// tells you that the game is starting
				case "start":
					if (!started) {
						started = true;
						board.drawBoard();
						if (clientNum == 0)
							turnStart();
					}
					break;

				case "ready":
					board.players[args[1]].ready = true;
					for (var i = 0; i < board.players.length; i++) {
						if (!board.players[i].ready)
							return;
					}
					var htmlStr = "<table><thead><tr>";
					for (var i = 0; i < board.players.length; i++) {
						htmlStr += "<th><span class='name" + i + "'>" + board.players[i].name + "</span></th>";
					}
					htmlStr += "</tr></thead><tbody><tr>";
					for (var i = 0; i < board.players.length; i++) {
						htmlStr += "<td id='playerTokens" + i + "'>0</td>";
					}
					htmlStr += "</tr></tbody></table>";
					$(tokenTracker).html(htmlStr);
					Chat.socket.send("start~");
					break;

				case "died":
					board.players[args[1]].dead = true;
					addToLogger("From a lack of coins, " + board.players[args[1]].name + " has died! Oh no!");

					function diedAnimation(stage, num) {
						switch (stage) {
							case 1:
								if (num >= 0) {
									ctx.drawImage(
										board.players[args[1]].image,
										(1 - num) * (startSpot.x - board.players[args[1]].x - spaceWidth / 2) + board.players[args[1]].x - spaceWidth / 2,
										(1 - num) * (startSpot.y - board.players[args[1]].y - spaceWidth / 2) + board.players[args[1]].y - spaceWidth / 2,
										(1 - num) * (spaceWidth * board.sideNum - spaceWidth * 0.7) + spaceWidth * 0.7,
										(1 - num) * (spaceWidth * board.sideNum - spaceWidth * 0.7) + spaceWidth * 0.7
									);
									ctx.globalAlpha = 0.4;
									canLib.drawRectangle(
										(1 - num) * (startSpot.x - board.players[args[1]].x - spaceWidth / 2) + board.players[args[1]].x - spaceWidth / 2,
										(1 - num) * (startSpot.y - board.players[args[1]].y - spaceWidth / 2) + board.players[args[1]].y - spaceWidth / 2,
										(1 - num) * (spaceWidth * board.sideNum - spaceWidth * 0.7) + spaceWidth * 0.7,
										(1 - num) * (spaceWidth * board.sideNum - spaceWidth * 0.7) + spaceWidth * 0.7,
										board.players[args[1]].color
									);
									ctx.globalAlpha = 1;
									num -= 0.01;
								} else {
									stage = 2;
									num = 100;
								}
								break;

							case 2:
								if (num % 2 == 0) {
									canLib.whiteCanvas();
									ctx.drawImage(devilFace, startSpot.x, startSpot.y, board.sideNum * spaceWidth, board.sideNum * spaceWidth);
								} else {
									canLib.blackCanvas();
									ctx.drawImage(
										board.players[args[1]].image,
										startSpot.x,
										startSpot.y,
										spaceWidth * board.sideNum,
										spaceWidth * board.sideNum
									);
									ctx.globalAlpha = 0.4;
									canLib.drawRectangle(
										startSpot.x,
										startSpot.y,
										spaceWidth * board.sideNum,
										spaceWidth * board.sideNum,
										board.players[args[1]].color
									);
									ctx.globalAlpha = 1;
								}
								num -= 1;

								if (num <= 0) {
									stage = -1;
									num = 1;
								}

								break;
							default:
								board.drawBoard();
						}

						if (stage != -1)
							setTimeout(diedAnimation, 20, stage, num);
						else if (clientNum == 0)
							Chat.socket.send("yourTurn~" + (1 * args[2]) + "~");
					}
					diedAnimation(1, 1);
					break;

				case "allDead":
					$(".coverContainerContents").css("background-color", "#000");
					$(".coverContainerContents").css("color", "#fff");
					$(".coverContainerContents h1").css("color", "#fff");
					$(".coverContainerContents h2").css("color", "#fff");
					$(".coverContainerContents h3").css("color", "#fff");
					$(".coverContainerContents").html("" +
						"<ul>" +
						"<li><h1>CARPATHIA WINS</h1></li>" +
						"<li><h2>HE ATE YOUR SOULS</h2></li>" +
						"<li><h3>YOU ALL SUCK</h3></li>" +
						"</ul>" +
						"");
					$(".cover, .coverContainer").css("display", "block");
					break;

				case "alived":
					board.players[args[1]].dead = false;
					addToLogger("From a surplus of coins, " + board.players[args[1]].name + " has come back to live! Oh yeah!");
					break;

					// tells you that its your turn now
				case "yourTurn":
					board.drawBoard();
					if (unleashed && args[1] == 0 && !carpathia.turning) {
						addToLogger("The turn of Carpathia has commenced! Tremble!");
						carpathia.turning = true;
						carpathia.roll();
					} else if (args[1] == "" + clientNum) {
						carpathia.turning = false;
						// if(activePlayer.num == clientNum)
						// if(board.players[clientNum].tokens < 0)
						// {
						// 	Chat.socket.send("died~" + clientNum + "~");
						// 	Chat.socket.send("yourTurn~" + (clientNum+1) + "~");
						// }
						// else
						if (!board.players[clientNum].dead) {
							Chat.socket.send("broadcast~The turn of " + clientName + " has commenced!");
							turnStart();
						} else {
							// Chat.socket.send("deadTokens~" + clientNum + "~");
							var chance = Math.round(Math.random()) == 0;
							if (chance) {
								Chat.socket.send("getTokens~" + clientNum + "~5~");
								Chat.socket.send("broadcast~" + clientName + " has been gifted 5 tokens by the heavens!");
							} else {
								Chat.socket.send("loseTokens~" + clientNum + "~2~");
								Chat.socket.send("broadcast~" + clientName + " has paid 2 tokens as penance in the afterlife!");
							}

							if ((chance && board.players[clientNum].tokens + 5 > 0) || (!chance && board.players[clientNum].tokens - 2 > 0)) {
								// board.players.dead = false;
								Chat.socket.send("alived~" + clientNum + "~");
								Chat.socket.send("broadcast~The tokens that " + clientName + " had received allowed them to buy their way becak to life!");
							}

							prepTurnEnd();
							// Chat.socket.send("yourTurn~" + (clientNum+1) + "~");
						}
						// else{
						// 	// var response = confirm("YOUR TURN DAMMIT");
						// 	// while(!response){
						// 	// 		response = confirm(utiLib.randomEntry(["SAY WHAT AGAIN MOTHAFUCKA", "DO THEY SPEAK ENGLISH IN WHAT", "DID HE LOOK LIKE A BITCH", "THIS IS A TASTY BURGER"]));
						// 	// }
						// 	// ask("Are you ready to play again?", {"Yeah": function(){
						// 	// 	Chat.socket.send("yourTurn~" + clientNum + "~");
						// 	// 	return true;
						// 	// }});
						// }
					}
					break;

				case "winner":
					displayWinner(args[1]);
					break;

				case "placeTopToken":
					for (var i = 0; i < board.spacesArray.length; i++)
						if (args[2] == board.spacesArray[i][0].id) {
							board.spacesArray[i][0].placeTopToken(args[1]);
							break;
						}
					board.players[args[1]].tokens--;
					// if(board.players[args[1]].tokens < 0 && clientNum == 0)
					// 	Chat.socket.send("died~" + args[1] + "~");
					break;

				case "unleashed":
					addToLogger(board.players[args[1]].name + " unleashed the antiChrist!!! Holy Cow!");
					unleashed = true;
					var ga = 1;

					function changeBoardType() {
						if (ga > 0) {
							ctx.globalAlpha = ga;
							ctx.drawImage(board.image, startSpot.x, startSpot.y, spaceWidth * (board.sideNum + 1), spaceWidth * (board.sideNum + 1));
							ctx.globalAlpha = 1 - ga;
							ctx.drawImage(board.imageI, startSpot.x, startSpot.y, spaceWidth * (board.sideNum + 1), spaceWidth * (board.sideNum + 1));
							ga -= 0.01;
							setTimeout(changeBoardType, 70);
						} else {
							ctx.globalAlpha = 1;
							board.drawBoard();
							carpathia.turning = false;
							if (clientNum == 0)
								Chat.socket.send("carpathiaArrive~" + carpathia.newPlace() + "~" + args[1] + "~");
							// carpathia.arrive(args[1], 1, carpathia.newPlace());
						}
					}
					changeBoardType();
					break;

				case "carpathiaArrive":
					carpathia.arrive(args[2], 1, args[1]);
					break;

				case "carpathiaHit":
					addToLogger(board.players[args[1]].name + " has been hit by Carpathia! They lose <span class='bigArrow'>↓</span>10<span class='bigArrow'>↓</span> tokens!");
					board.players[args[1]].tokens -= 10;
					$("#playerTokens" + args[1]).html(board.players[args[1]].tokens);

					if (board.players[args[1]].tokens < 0 && clientNum == 0 && !board.players[args[1]].dead) {
						Chat.socket.send("died~" + args[1] + "~0~");
					} else if (clientNum == 0) {
						Chat.socket.send("yourTurn~0~");
					}
					break;

				case "carpathiaMove":
					carpathia.rolling = false;
					carpathia.move(1 * args[1]);
					break;

				case "greenCard":
					if (args[1] == clientNum) {
						$(".cover, .coverContainer").css("display", "block");
						$(".coverContainerContents").css("background-color", "#0d0");
						$(".cover").css("background-color", "#777");
						$(".coverContainerContents").html("" +
							"<ul>" +
							"<li><h2>GREEN CARD</h2></li>" +
							"<li><h4>Answer the trivia question:</h4></li>" +
							"<li>" + args[2] + "</li>" +
							"<li><label><input type='radio' name='greenCardAnswer' id='answer0' value='1' />" + args[3] + "</label></li>" +
							"<li><label><input type='radio' name='greenCardAnswer' id='answer1' value='2' />" + args[4] + "</label></li>" +
							"<li><label><input type='radio' name='greenCardAnswer' id='answer2' value='3' />" + args[5] + "</label></li>" +
							"<li><label><input type='radio' name='greenCardAnswer' id='answer3' value='4' />" + args[6] + "</label></li>" +
							"<li><button id='greenCardSubmit' class='bigButton'>Submit</button></li>" +
							"</ul>" +
							"");
						$(".coverContainer h2").css("color", "#fff");
						$(".coverContainer h4").css("color", "#fff");
						$("#greenCardSubmit").on("click", function () {
							Chat.socket.send("greenCardAnswer~" + $("input[name='greenCardAnswer']:checked").val() + "~" + clientNum + "~" + clientName + "~");
							$(".cover, .coverContainer").css("display", "none");
							// turnEnd();
						});
					} else {
						addToLogger(board.players[args[1]].name + " is answering a green card.");
					}
					break;

				case "greenCardShow":
					if (clientNum == args[1])
						return;
					$(".cover, .coverContainer").css("display", "block");
					$(".coverContainerContents").css("background-color", "#0d0");
					$(".cover").css("background-color", "#777");
					$(".coverContainerContents").html("" +
						"<ul>" +
						"<li><h2>GREEN CARD</h2></li>" +
						"<li><h4>Answer the trivia question:</h4></li>" +
						"<li>" + args[2] + "</li>" +
						"<li>" + args[3] + "</li>" +
						"<li>" + args[4] + "</li>" +
						"<li>" + args[5] + "</li>" +
						"<li>" + args[6] + "</li>" +
						"</ul>" +
						"");
					$(".coverContainer h2").css("color", "#fff");
					$(".coverContainer h4").css("color", "#fff");
					break;

				case "greenCardAnswer":
					$(".cover, .coverContainer").css("display", "none");
					addToLogger(args[1]);
					break;

				case "redCard":
					if (args[1] == clientNum) {
						$(".cover, .coverContainer").css("display", "block");
						$(".coverContainerContents").css("background-color", "#f33");
						$(".cover").css("background-color", "#777");
						$(".coverContainer h2").css("color", "#fff");
						$(".coverContainer h4").css("color", "#fff");
						$(".coverContainerContents").html("" +
							"<ul>" +
							"<li><h2>RED CARD</h2></li>" +
							"<li><h4>Respond verbally to the following:</h4></li>" +
							"<li>" + args[2] + "</li>" +
							"<li id='response'></li>" +
							"</ul>" +
							"");
					} else {
						$(".cover, .coverContainer").css("display", "block");
						$(".coverContainerContents").css("background-color", "#f33");
						$(".cover").css("background-color", "#777");
						$(".coverContainer h2").css("color", "#fff");
						$(".coverContainer h4").css("color", "#fff");
						$(".coverContainerContents").html("" +
							"<ul>" +
							"<li><h2>RED CARD</h2></li>" +
							"<li><h4>" + board.players[args[1]].name + " is responding verbally to the following:</h4></li>" +
							"<li>" + args[2] + "</li>" +
							"<li><h3>CHOOSE</h3></li>" +
							"<li id='response'>" +
							"<ul>" +
							"<li><button id='lying' class='bigButton'>Lying</button></li>" +
							"<li><button id='truth' class='bigButton'>Truthing</button></li>" +
							"</ul>" +
							"</li>" +
							"</ul>" +
							"");

						$("#truth").on("click", function () {
							Chat.socket.send("redResponse~truth~" + clientNum + "~" + args[1] + "~");
							addToLogger("You have responded to the red card!");
							$(".cover, .coverContainer").css("display", "none");
						});
						$("#lying").on("click", function () {
							Chat.socket.send("redResponse~lying~" + clientNum + "~" + args[1] + "~");
							addToLogger("You have responded to the red card!");
							$(".cover, .coverContainer").css("display", "none");
						});
						// addToLogger(board.players[args[1]].name + " is answering a red card.");
					}
					break;

				case "carpathiaSuccess":
					addToLogger(board.players[args[2]].name + " got the " + carpathiaWords[args[1]].toUpperCase() + " die!");
					// if(args[2] != clientNum)
					board.drawCarpathiaDieOnce(args[1], true, false);
					ctx.beginPath();
					break;

				case "carpathiaFailure":
					addToLogger(board.players[args[2]].name + " didn't get the " + carpathiaWords[args[1]].toUpperCase() + " die.");
					// if(args[2] != clientNum)
					board.drawCarpathiaDieOnce(args[1], true, false, true);
					break;

				case "redResponse":
					addToLogger(board.players[args[2]].name + " has responded to the red card.");
					if (clientNum != args[3])
						return;
					board.players[args[2]].response = args[1];
					for (var i = 0; i < board.players.length; i++)
						if (board.players[i].response == undefined && i != clientNum) {
							return;
						}

					$("#response").html("All players have responded; were you <button id='lying'>Lying</button> or telling the <button id='truth'>Truth</button>?");
					$("#lying").on("click", function () {
						var lieSuccess = true;
						for (var i = 0; i < board.players.length; i++) {
							if (board.players[i].response == "truth") {
								Chat.socket.send("loseTokens~" + i + "~1~");
							} else if (board.players[i].response == "lying") {
								lieSuccess = false;
								Chat.socket.send("getTokens~" + i + "~1~");
							}
						}

						if (lieSuccess)
							Chat.socket.send("getTokens~" + clientNum + "~2~");

						$(".cover, .coverContainer").css("display", "none");
						prepTurnEnd();
					});

					$("#truth").on("click", function () {
						for (var i = 0; i < board.players.length; i++) {
							if (board.players[i].response == "truth") {
								Chat.socket.send("getTokens~" + i + "~1~");
							} else if (board.players[i].response == "lying") {
								Chat.socket.send("loseTokens~" + i + "~1~");
							}
						}
						Chat.socket.send("getTokens~" + clientNum + "~1~");

						$(".cover, .coverContainer").css("display", "none");
						prepTurnEnd();
					});
					break;

					// an action of another player has caused someone to get tokens, maybe you
				case "getTokens":
					addToLogger((clientNum == args[1] ? "You" : board.players[args[1]].name) + " got <span class='bigArrow'>↑</span>" + args[2] + "<span class='bigArrow'>↑</span> token" + (1 * args[2] != 1 ? "s" : "") + ".");
					board.players[args[1]].tokens += parseInt(args[2]);
					$("#playerTokens" + args[1]).html(board.players[args[1]].tokens);
					break;

				case "loseTokens":
					addToLogger((clientNum == args[1] ? "You" : board.players[args[1]].name) + " lost <span class='bigArrow'>↓</span>" + args[2] + "<span class='bigArrow'>↓</span> token" + (1 * args[2] != 1 ? "s" : "") + ".");
					board.players[args[1]].tokens -= parseInt(args[2]);
					$("#playerTokens" + args[1]).html(board.players[args[1]].tokens);
					// if(board.players[args[1]].tokens < 0 && clientNum == 0)
					// 	Chat.socket.send("died~" + args[1] + "~");
					break;

				case "rolled":
					if (args[2] * 1 == clientNum)
						str = "You";
					else
						str = board.players[args[2]].name;
					addToLogger(str + " rolled a " + args[1] + ".");
					board.players[args[2]].move(args[1]);
					break;

				case "reaction":
					if (args[1] == clientName)
						str = "You";
					else
						str = args[1];
					addToLogger(args[1] + " landed on a " + args[2] + " space.");
					break;

				case "rollAgain":
					if (clientNum == args[1]) {
						addToLogger("You are rolling again!");
						board.players[clientNum].roll();
					} else
						addToLogger(board.players[args[1]].name + " is rolling again!");
					break;

				case "turnEnd":
					if (args[1] * 1 == clientNum)
						prepTurnEnd();
					break;

				default:
					addToLogger(args[1]);
			}
		};
	});

	Chat.initialize = function () {
		if ($("#signInName").val().indexOf('~') > 0) {
			alert("You really shouldn't put a tilde in your name.");
			return;
		} else if ($("#signInName").val() == '') {
			alert("Don't be modest, give yourself a name!");
			return;
		} else if ($("#signInName").val().toLowerCase().indexOf('fuck') != -1 || $("#signInName").val().toLowerCase().indexOf('ass') != -1 || $("#signInName").val().toLowerCase().indexOf('shit') != -1 || $("#signInName").val().toLowerCase().indexOf('cunt') != -1 || $("#signInName").val().toLowerCase().indexOf('fart') != -1) {
			if (confirm("Are you sure you really want " + $("#signInName").val() + " to be your name?"))
				alert("Alrighty then. You crass bastard.");
			else {
				alert("Great choice! I think it's better for people to have real names too.");
				// return;
			}
		}
		$(".cover, .coverContainer").css("display", "none");
		clientName = $("#signInName").val().replace(/[^a-zA-Z ]/g, "");
		if (window.location.protocol == 'http:') {
			// Chat.connect('ws://' + window.location.host + '/genericBoardGame/websocket/game');
			Chat.connect('ws://' + window.location.host);
		} else {
			// Chat.connect('wss://' + window.location.host + '/genericBoardGame/websocket/game');
			Chat.connect('wss://' + window.location.host);
		}
	};

	Chat.sendMessage = (function () {
		Chat.socket.send(message);
		console.log(message);
	});

	// Chat.initialize();
	$("#signInButton").on("click", Chat.initialize);
	$("#signInName").on("keyup", function () {
		if (event.which == 13) {
			Chat.initialize();
		}
	});
	$("#signInName").focus();
	$("#alert").on("click", function () {
		$("#signInName").focus()
	});


	// document.addEventListener("DOMContentLoaded", function() {
	// 	// Remove elements with "noscript" class - <noscript> is not allowed in XHTML
	// 	var noscripts = document.getElementsByClassName("noscript");
	// 	for (var i = 0; i < noscripts.length; i++) {
	// 		noscripts[i].parentNode.removeChild(noscripts[i]);
	// 	}
	// }, false);


	// something to do for the people waiting
	function ZombieGame() {

	}
}

function Procedure(funcArray) {
	var step = 0;
	var steps = funcArray;

	this.nextStep = function () {
		this.steps[(step + 1).mod(steps.length)]();
		step++;
	}
}