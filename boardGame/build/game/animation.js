var makeAnimation = function(oneFrame, context){
	return {
		ctx : context,
		i : 0,
		init : function(){

		}
		start : function(){
			if(this.i == 0){
				this.init();
			}
			if(!this.oneFrame()){
				setTimeout(this.start, 1)
			} else{
				this.i = 0;
			}
		},
		oneFrame : oneFrame
	};
};