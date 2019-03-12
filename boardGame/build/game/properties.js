var makeResolver = function(){
	return {
		properties : {},
		addProp : function(index, value){
			this.properties[index] = value;
		},
		addProps : function(properties){
			this.properties = properties;
		},
		resolve : function(string){
			for (var index in properties){
				if(string.indexOf("#$#" + index + "#$#") >= 0){
					return string.replace( new RegExp("#$#" + index + "#$#", "g"), properties[index].value);
				}
			}
		}
	};
};