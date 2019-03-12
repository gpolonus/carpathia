var frontEnd = {
	register : function(name, func){
		this[name] = func();
	}
};