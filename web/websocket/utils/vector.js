function Vector(x, y, x0, y0)
{
	this.init = new Point(x, y);
	this.final = new Point(x0, y0);

	this.distance = function()
	{
		return Math.sqrt(Math.pow(this.init.x - this.final.x,2) + Math.pow(this.init.y - this.final.y,2));
	}

	// returns perpendicular vector from this vector starting at the given coordinates with the same length if not specified
	this.perpVec = function(x, y, l)
	{
		var xx = x;
		var yy = y;
		if(x == undefined || y == undefined)
		{
			xx = this.init.x;
			yy = this.init.y;
		}

		if(l == undefined)
		{
			return new Vector(
				xx,
				yy, 
				-1*(this.final.y - this.init.y) + xx,
				(this.final.x - this.init.x) + yy
			);
		}
		else
		{
			return new Vector(
				xx,
				yy,
				-1*(this.final.y - this.init.y)/this.distance()*l + xx,
				(this.final.x - this.init.x)/this.distance()*l + yy
			);
		}
	}

	this.draw = function(color)
	{
		if(color == undefined)
		{
			if(this.color == undefined)
				this.color = randomColor();
		}
		else
			this.color = color;
		var old = ctx.strokeStyle;
		ctx.strokeStyle = this.color;
		ctx.beginPath();
		ctx.moveTo(this.init.x, this.init.y);
		ctx.lineTo(this.final.x, this.final.y);
		ctx.stroke();
		ctx.strokeStyle = old;
	}

	this.invert = function()
	{
		this.final.x = 2*this.init.x - this.final.x;
		this.final.y = 2*this.init.y - this.final.y;
	}

	this.toString = function()
	{
		return "init: "+this.init.x + ", " + this.init.y + "; final: " + this.final.x + ", " + this.final.y;
	}

	// tests if the given vector crosses this vector
	// this.intersect = function(vec)
	// {
	// 	var v = this;

	// }

	// adds the given vector with this one then possible puts it at x, y and makes it l length
	this.add = function(v, x, y, l)
	{
		var xx = x == undefined ? this.init.x : x;
		var yy = y == undefined ? this.init.y : y;
		if(l != undefined)
		{
			var vv = new Vector(0,0, this.final.x - this.init.x + v.final.x - v.init.x, this.final.y - this.init.y + v.final.y - v.init.y);
			return new Vector(
				xx,
				yy,
				(this.final.x - this.init.x + v.final.x - v.init.x)/vv.distance()*l + xx,
				(this.final.y - this.init.y + v.final.y - v.init.y)/vv.distance()*l + yy
			);
		}
		else
			return new Vector(
				xx,
				yy,
				(this.final.x - this.init.x + v.final.x - v.init.x) + xx,
				(this.final.y - this.init.y + v.final.y - v.init.y) + yy
			);			
	}

	this.newInit = function(x,y)
	{
		this.final.x = this.final.x - this.init.x + x;
		this.final.y = this.final.y - this.init.y + y;
		this.init.x = x;
		this.init.y = y;			
	}

	this.scale = function(l)
	{
		this.final = 
		{
			x: (this.final.x - this.init.x)/this.distance()*l + this.init.x ,
			y: (this.final.y - this.init.y)/this.distance()*l + this.init.y 
		};
	}

	this.dot = function(v)
	{
		return (this.final.x - this.init.x)*(v.final.x - v.init.x) + (this.final.y - this.init.y) * (v.final.y - v.final.y);
	}

	// function takes radian angle
	this.rotate = function(angle)
	{	
		this.final = {
			x: Math.cos(angle) * (this.final.x - this.init.x) - Math.sin(angle) * (this.final.y - this.init.y) + this.init.x,
			y: Math.sin(angle) * (this.final.x - this.init.x) + Math.cos(angle) * (this.final.y - this.init.y) + this.init.y
		};
	}

	this.angleBetween = function(v)
	{	
		return this.angleToOrigin() - v.angleToOrigin();
	}

	this.angleToOrigin = function()
	{
		var origin = new Vector(0,0, 100, 0);
		var multiplier = 1;
		if(this.final.y < this.init.y)
			multiplier = -1;
		return multiplier * Math.acos(origin.dot(this)/(this.distance() * origin.distance()));
	}

	this.returnCopy = function()
	{
		return new Vector(this.init.x, this.init.y, this.final.x, this.final.y);
	}

	function Point(x, y)
	{
		this.x = x;
		this.y = y;
	}
}