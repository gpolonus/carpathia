var makeEventList = function(){
	return {
		events: {},
		add : function(event){
			events[event.handle] = event;
		},
		makeAndAdd : function(name, handler, alert, endHandle){
			this.add(makeNewEvent(name, handler, alert, endHandle));
		},
		handle : function(name, info){
			events[name].handler(info);
		},
		alert : function(name, info){
			events[name].alert(info);
		},
		endHandle : function(name, info){
			events[name].endHandle(info);
		}
	};
};

var makeEvent = function(name, handler, alert, endHandle){
	return {
		handle: name,
		handler : handler,
		alert : alert,
		endHandle : endHandle
	};
};