
Number.prototype.mod = function(n)
{
	return ((this%n)+n)%n;
}

function UtilityLibrary(){
	this.distance = function(x0,y0,x1,y1) {
		return Math.sqrt(Math.pow(x0-x1,2)+Math.pow(y0-y1,2));
	}

	this.numToHex = function(num){
		hexNum = '';
		modding = 1;
		do
		{
			tempModding = modding * 16;
			place = (num % tempModding)/modding;
			if(place >= 10)
				hexNum = String.fromCharCode(place + 55)+hexNum;
			else
				hexNum = place+hexNum;
			num -= place*modding;
			modding *= 16;
		} while(num >= modding)
		return hexNum;
	}

	this.hexToDecimal = function(hex){

	}


	// returns a random element from the given array
	this.randomEntry = function(array)
	{
		return array[Math.floor(Math.random()*array.length)];
	}

	// starts false
	// can be made true, but once made false again, it must be unlocked to be made true again
	this.BooleanLock = function() {
		var value = false;
		var locked = false;

		this.true = function() {
			if(!locked)
				value = true;
			return value;
		}

		this.lockFalse = function() {
			value = false;
			locked = true;
		}

		this.unlock = function() {
			locked = false;
			value = false;
		}

		this.value = function() {
			return value;
		}
	}

	this.Point = function(x, y) {
		this.x = x == undefined ? 0 : x;
		this.y = y == undefined ? 0 : y;

		this.inc = function(x,y) {
			this.x += x;
			this.y += y;
		}
	}

	this.randomColor = function() {
		return "#" + this.bestConvertToHex(Math.round(Math.random()*255), 16) + this.bestConvertToHex(Math.round(Math.random()*255), 16) + this.bestConvertToHex(Math.round(Math.random()*255), 16);
	}

	this.bestConvertToHex = function(num, base) {
		var result = "";
		var times = Math.ceil(Math.log(num) / Math.log(base));
		if(times < Math.log(num) / Math.log(base))
			times++;
		for(var i = times-1; i >= 0; i--)
		{
			var next = Math.floor(num/Math.pow(base, i));
			num -= Math.pow(base, i) * next;
			if(next >= 10)
				next = String.fromCharCode(next + 55);
			result += next;
		}
		return result == "" ? "0" : result;
	}

	this.rgbFromNum = function(num) {
		if(num > Math.pow(255,3))
			return;
		var val = this.bestConvertToHex(num, 16);
		var len = val.length;
		for(var i = 0; i < 6-len; i++)
			val = "0"+val;
		return "#"+val;
	}

	this.rgb = function(r,g,b) {
		var red = this.bestConvertToHex(r,16);
		red = red.length < 2 ? this.multString("0", 2 - red.length ) + red : red;
		var gre = this.bestConvertToHex(g,16);
		gre = gre.length < 2 ? this.multString("0", 2 - gre.length ) + gre : gre;
		var blu = this.bestConvertToHex(b,16);
		blu = blu.length < 2 ? this.multString("0", 2 - blu.length ) + blu : blu;
		return "#" + red + gre + blu;
	}

	this.multString = function(str, times) {
		var ret = "";
		for(var i = 0 ; i < times ; i++)
			ret += str;
		return ret;
	}
}