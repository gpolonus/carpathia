define([
	'jquery',
	'canvas',
	'view'
],
function($, canvas, view, config){
	var frontEnd = {
		register : function(name, func){
			this[name] = func();
		},

		bindRegions: function(clickRegions
			// , inCallback
			){
			canvas.object.on("click", function(event){
				for(var i in clickRegions){
					var scaledPoint = scalePoint(event.layerX, event.layerY);
					clickRegions[i].click(scaledPoint.x, scaledPoint.y);
				}
			});

			// if(!inCallback){
			// 	inCallback = function(){
			// 		canvas.style("cursor", hand);
			// 	};
			// }

			// canvas.object.on("mousemove", function(event){
			// 	for(var i in clickRegions){
			// 		if(clickRegions[i].in(event.layerX, event.layerY)){
			// 			inCallback();
			// 		} else{
			// 			// reverse inCallback
			// 		}
			// 	}
			// });
		},

		// scales the point clicked on the canvas to the point on the board
		scalePoint: function(x, y){
			return {
				x: (x - canvas.center.x) / canvas.scaler,
				y: (y - canvas.center.y) / canvas.scaler
			};
		},

		views: {},

		showView: function(id){
			for(var i in this.views)
				this.views[i].hide();
			this.views[id].show();
		},
	};

	for(var i in config.frontEndViews){
		frontEnd.views.push(view.new(config.frontEndViews[i]));
	}

	return frontEnd;
});