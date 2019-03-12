define([
	'canvas'
],
function(canvas){
	return function(oneFrame, endCall){
		return {
			init : function(){
				this.start();
			},
			start : function(){
				if(!this.oneFrame()){
					setTimeout(this.start, 1);
				} else{
					endCall();
				}
			},
			oneFrame : oneFrame,
			endCall: endCall,
		};
	};
});