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

		// malg functions
		drawPlayer: function(player, board){
			this.drawBoard(board);
			
		},

		drawBoard: function(board){

		}
	};
});