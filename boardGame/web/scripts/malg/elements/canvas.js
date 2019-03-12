define([
	'jquery'
],
function($){
	return {
		object: $("canvas"),
		ctx: $("canvas").get(0).getContext("2d"),
		scaler: 1,
		// measured in canvas pixels
		center: {
			x: 0,
			y: 0
		},
		pointToCanvas: function(x, y){
			return {
				
			};
		},

		pointToGame: function(x, y){

		},

		// malg functions
		drawPlayer: function(player, board){
			this.drawBoard(board);
			this.ctx.fillStyle = player.color;
			this.ctx.beginPath();
			this.ctx.arc(player.x, player.y, 20, 0, Math.PI*2);
			this.ctx.fill();
		},

		drawBoard: function(board){
			var i = 0;
			while(board.spaces[i]){
				var space = board.spaces[i];
				this.ctx.strokeStyle = "black";
				this.ctx.lineWidth = 3;
				this.ctx.beginPath();
				for(var c in spaces.corners){
					this.
				}
				i++;
			}
		}
	};
});