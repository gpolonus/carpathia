define({
	events: {},
	add : function(name, handler, alert, endHandle){
		var event = {
			name: name,
			handler: handler,
			alert: alert,
			endHandler: endHandle
		};
		this.events[event.name] = event;
	},
	addEvent: function(event){
		this.events[event.name] = event;
	},
	handle : function(name, info){
		this.events[name].handler(info);
	},
	alert : function(name, info){
		this.events[name].alert(info);
	},
	endHandler : function(name, info){
		this.events[name].endHandler(info);
	}
});
