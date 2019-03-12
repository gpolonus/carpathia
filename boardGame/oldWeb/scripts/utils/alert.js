define(['utils/jquery'], function($){
	// $("body").append("<div class='cover'></div><div class='coverContainer' id='alert'><div class='coverContainerContents' id='alertContainer'></div></div>");

	return {
		showing: false,
		up: function(coverFunction, contentFunction){
			if(!this.showing){
				coverFunction($("#alert"));
				contentFunction($("#alertContents"));
				$("#alert, #alertContents").css("display","block");
				this.showing = true;
			}
		},
		down: function(){
			if(this.showing){
				$("#alertContents").html("");
				$("#alert, #alertContents").css("display","none");
				this.showing = false;
			}
		}
	};
});