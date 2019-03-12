define([
	"utils/vector"
],
function(makeVector){

	var makeRectClickRegion = function(x, y, l, w, callback){
		return {
			x : x,
			y : y,
			l : l,
			w : w,
			in : function(x, y){
				return x <= this.x - this.l &&
					x >= this.x + this.l &&
					y <= this.y + this.w &&
					y >= this.y - this.w;
			},
			callback : callback
		};
	};

	var makeCircleClickRegion = function(x, y, r, callback){
		return {
			x : x,
			y : y,
			r : r,
			in : function(x, y){
				return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y,2)) < this.r;
			},
			callback : callback
		};
	};

// ONLY works for convex polygons
	var makePolyClickRegion = function(points, callback){
		function mod(p, n){
			return ((p%n)+n)%n;
		}

		var interior;
		// setup point angles
		for(var i in points){
			var prev = points[mod((1*i) - 1, points.length)];
			var next = points[mod((1*i) + 1, points.length)];
			var point = points[i];
			var prevVector = makeVector(point.x, point.y, prev.x, prev.y);
			point.startAngle = prevVector.angleToOrigin();
			var nextVector = makeVector(point.x, point.y, next.x, next.y);
			point.endAngle = nextVector.angleToOrigin();
			if(i == 0){
				interior = mod(point.endAngle - point.startAngle, Math.PI * 2) > Math.PI;
			}
			if(interior){
				temp = point.startAngle;
				point.startAngle = point.endAngle;
				point.endAngle = temp;
			}
		}

		return {
			points: points,
			// WORKS ONLY FOR CONVEX POLYGONS
			in : function(x, y){
				for(var i in points){
					// rotate everything so that we can use less than signs
					var angle = mod(makeVector(points[i].x, points[i].y, x, y).angleToOrigin() - points[i].startAngle, Math.PI * 2);
					var endAngle = mod(points[i].endAngle - points[i].startAngle, Math.PI * 2);
					var multiplier = endAngle < Math.PI ? 1 : -1;
					if(multiplier * endAngle < multiplier * angle){
						return false;
					}
				}
				return true;
			},
			callback : callback
		};
	};

// makeClickRegion
	return function (){
		return {
			regions: {},
			counter : 0,
			click : function(x, y){
				for(var i in this.regions){
					if(this.regions[i].in(x, y)){
						this.regions[i].callback();
						delete this.regions[i];
						return true;
					}
				}
				return false;
			},
			in: function(x, y){
				for(var i in this.regions){
					if(this.regions[i].in(x, y)){
						return true;
					}
				}
				return false;
			},
			addCircle : function(x, y, r, callback){
				this.regions[++this.counter] = makeCircleClickRegion(x, y, r, callback);
				return this.counter;
			},
			addRectangle : function(x, y, l, w, callback){
				this.regions[++this.counter] = makeRectClickRegion(x, y, l, w, callback);
				return this.counter;
			},
			addPolygon : function(points, callback){
				this.regions[++this.counter] = makePolyClickRegion(points, callback);
				return this.counter;
			},
			dispell : function(id){
				delete this.regions[id];
			}
		};
	};
});
