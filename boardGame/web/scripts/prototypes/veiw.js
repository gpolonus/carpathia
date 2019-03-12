define([
	'jquery'
],
function($){
	return {
		new: function(id){
			return {
				id: id,
				object: $('#' + id),
				show: function(){
					this.object.css('display', 'block');
				},
				hide: function(){
					this.object.css('display', 'none');
				}
			};
		}
	};
});