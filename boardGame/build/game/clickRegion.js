var makeClickRegion = function(x, y, l, w, callback){
	return {
		x : x,
		y : y,
		l : l,
		w : w,
		in : function(x, y){
			return 
				x <= this.x - this.l &&
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

var makeClickRegionList = function(){
	return {
		regions: {},
		counter : 0,
		click : function(x, y){
			for(var i in this.regions){
				if(this.regions[i].in()){
					this.regions[i].callback();
					delete this.regions[i];
					return true;
				}
			}
			return false;
		},
		addCircle : function(x, y, r, callback){
			this.regions[++this.counter] = makeCircleClickRegion(x, y, r, callback, id);
			return this.counter;
		},
		addRectangle : function(x, y, l, w, callback){
			this.regions[++this.counter] = makeClickRegion(x, y, l, w, callback, id);
			return this.counter;
		},
		dispell : function(id){
			delete this.regions.id;
		}
	};
}
