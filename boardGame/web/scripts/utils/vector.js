define(
	function(){
		var makeNewVector = function (x, y, x0, y0)
		{
			var vector = {};
			vector.init = new Point(x, y);
			vector.final = new Point(x0, y0);

			vector.distance = function()
			{
				return Math.sqrt(Math.pow(vector.init.x - vector.final.x,2) + Math.pow(vector.init.y - vector.final.y,2));
			};

			// returns perpendicular vector from vector vector starting at the given coordinates with the same length if not specified
			vector.perpVec = function(x, y, l)
			{
				var xx = x;
				var yy = y;
				if(x === undefined || y === undefined)
				{
					xx = vector.init.x;
					yy = vector.init.y;
				}

				if(l === undefined)
				{
					return makeNewVector(
						xx,
						yy, 
						-1*(vector.final.y - vector.init.y) + xx,
						(vector.final.x - vector.init.x) + yy
					);
				}
				else
				{
					return makeNewVector(
						xx,
						yy,
						-1*(vector.final.y - vector.init.y)/vector.distance()*l + xx,
						(vector.final.x - vector.init.x)/vector.distance()*l + yy
					);
				}
			};

			vector.draw = function(color)
			{
				if(color === undefined)
				{
					if(vector.color === undefined)
						vector.color = randomColor();
				}
				else
					vector.color = color;
				var old = ctx.strokeStyle;
				ctx.strokeStyle = vector.color;
				ctx.beginPath();
				ctx.moveTo(vector.init.x, vector.init.y);
				ctx.lineTo(vector.final.x, vector.final.y);
				ctx.stroke();
				ctx.strokeStyle = old;
			};

			vector.invert = function()
			{
				vector.final.x = 2*vector.init.x - vector.final.x;
				vector.final.y = 2*vector.init.y - vector.final.y;
			};

			vector.toString = function()
			{
				return "init: "+vector.init.x + ", " + vector.init.y + "; final: " + vector.final.x + ", " + vector.final.y;
			};

			// tests if the given vector crosses vector vector
			// vector.intersect = function(vec)
			// {
			// 	var v = vector;

			// }

			// adds the given vector with vector one then possible puts it at x, y and makes it l length
			vector.add = function(v, x, y, l)
			{
				var xx = x === undefined ? vector.init.x : x;
				var yy = y === undefined ? vector.init.y : y;
				if(l !== undefined)
				{
					var vv = makeNewVector(0,0, vector.final.x - vector.init.x + v.final.x - v.init.x, vector.final.y - vector.init.y + v.final.y - v.init.y);
					return makeNewVector(
						xx,
						yy,
						(vector.final.x - vector.init.x + v.final.x - v.init.x)/vv.distance()*l + xx,
						(vector.final.y - vector.init.y + v.final.y - v.init.y)/vv.distance()*l + yy
					);
				}
				else
					return makeNewVector(
						xx,
						yy,
						(vector.final.x - vector.init.x + v.final.x - v.init.x) + xx,
						(vector.final.y - vector.init.y + v.final.y - v.init.y) + yy
					);
			};

			vector.newInit = function(x,y)
			{
				vector.final.x = vector.final.x - vector.init.x + x;
				vector.final.y = vector.final.y - vector.init.y + y;
				vector.init.x = x;
				vector.init.y = y;			
			};

			vector.scale = function(l)
			{
				vector.final = 
				{
					x: (vector.final.x - vector.init.x)/vector.distance()*l + vector.init.x ,
					y: (vector.final.y - vector.init.y)/vector.distance()*l + vector.init.y 
				};
			};

			vector.dot = function(v)
			{
				return (vector.final.x - vector.init.x)*(v.final.x - v.init.x) + (vector.final.y - vector.init.y) * (v.final.y - v.final.y);
			};

			// function takes radian angle
			vector.rotate = function(angle)
			{	
				vector.final = {
					x: Math.cos(angle) * (vector.final.x - vector.init.x) - Math.sin(angle) * (vector.final.y - vector.init.y) + vector.init.x,
					y: Math.sin(angle) * (vector.final.x - vector.init.x) + Math.cos(angle) * (vector.final.y - vector.init.y) + vector.init.y
				};
			};

			vector.angleBetween = function(v)
			{	
				return vector.angleToOrigin() - v.angleToOrigin();
			};

			vector.angleToOrigin = function()
			{
				var origin = makeNewVector(0,0, 100, 0);
				var multiplier = 1;
				if(vector.final.y < vector.init.y)
					multiplier = -1;
				return ((multiplier * Math.acos(origin.dot(vector)/(vector.distance() * origin.distance()))%(Math.PI*2)) + (Math.PI*2))%(Math.PI*2);
			};

			vector.returnCopy = function()
			{
				return makeNewVector(vector.init.x, vector.init.y, vector.final.x, vector.final.y);
			};

			function Point(x, y)
			{
				this.x = x;
				this.y = y;
			}

			return vector;
		};
		return makeNewVector;
	}
);