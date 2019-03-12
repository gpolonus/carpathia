define([
	'jquery',
	'resolver',
	'eventList',
	'client'
],
function($, resolver, eventList, client){
	return {
		socket : null,
		init : function(){
			var that = this;
			// connect the socket
			var gameURL = resolver.resolve("#$#gameURL#$#");
			if (window.location.protocol == 'http:') {
				this.socket.connect('ws://' + window.location.host + gameURL);
			} else {
				this.socket.connect('wss://' + window.location.host + gameURL);
			}

			$("body").on("onunload",function(){
				socket.close();
			});

			// show the sign in interface
			$("#signInButton").on("click", signIn);
			$("#signInName").on("keyup", function(){
				if(event.which == 13)
				{
					signIn();
				}
			});
			$("#signInName").focus();
			$("#alert").on("click", function(){$("#signInName").focus();});

			// function for sending the player name
			function signIn(){
				if($("#signInName").val().indexOf('~') > 0){
					alert("You really shouldn't put a tilde in your name.");
					return;
				}
				else if($("#signInName").val() === '')
				{
					alert("Don't be modest, give yourself a name!");
					return;
				}
				else if($("#signInName").val().toLowerCase().indexOf('fuck') != -1 || $("#signInName").val().toLowerCase().indexOf('ass') != -1 || $("#signInName").val().toLowerCase().indexOf('shit') != -1 || $("#signInName").val().toLowerCase().indexOf('cunt') != -1 || $("#signInName").val().toLowerCase().indexOf('fart') != -1)
				{
					if(confirm("Are you sure you really want " + $("#signInName").val() + " to be your name?"))
						alert("Alrighty then. You crass bastard.");
					else
					{
						alert("Great choice! I think it's better for people to have real names too.");
						// return;
					}
				}
				$(".cover, .coverContainer").css("display","none");
				client.name = $("#signInName").val().replace(/[^a-zA-Z ]/g, "");
				if(client.name.toLowerCase().indexOf("ben") != -1)
					window.open("http://www.youtube.com/watch?v=x5m1A7zoIcc");
				eventList.endHandler("assignPlayerNumber");
			}
		},

		send : function(str)
		{
			this.socket.send(str);
		},

		socketSend : function(handle, extraInfo, alerting)
		{
			var sending = {};
			var message;
			if(alerting){
				sending.alerting = {};
				message = sending.alerting;
			} else{
				sending.handle = {};
				message = sending.handle;
			}

			message.handle = handle;
			message.fromPlayer = client.id;
			message.extraInfo = extraInfo;
			this.socket.send(JSON.stringify(message));
		},

		connect : function(host){
			var that = this;
			if ('WebSocket' in window) {
				that.socket = new WebSocket(host);
			} else if ('MozWebSocket' in window) {
				that.socket = new MozWebSocket(host);
			} else {
				console.log('Error: WebSocket is not supported by this browser.');
				return;
			}

			this.socket.onopen = function () {
				that.onopen();
			};

			this.socket.onclose = function () {
				that.onclose();
			};

			this.socket.onmessage = function (message) {
				that.onmessage(message);
			};
		},

		onopen: function(){},
		onclose: function(){},
		onmessage: function(message){
			console.log(message.data);
			message = JSON.parse(message);
			if(message.alert){
				this.alert(message.alert);
			} else if(message.handle){
				this.handle(message.handle);
			}
		},

		alert : function(info){
			eventList.alert(info.handle, info);
		},
		handle : function(info){
			eventList.handle(info.handle, info);
		},
	};
});