requirejs.config({
	//By default load any module IDs from js/lib
	// baseUrl: 'scripts',
	//except, if the module ID starts with "app",
	//load it from the js/app directory. paths
	//config is relative to the baseUrl, and
	//never includes a ".js" extension since
	//the paths config could be for a directory.
	paths: {
		// app: 'app',
		animation: 'util/animation',
		board: 'malg/board',
		clickRegion: 'utils/clickRegion',
		canvas: 'malg/elements/canvas',
		canvasProto: 'prototype/elements/canvas',
		client: 'malg/client',
		eventList: 'prototype/eventList',
		frontEnd: 'malg/frontEnd',
		frontEndProto: 'prototype/frontEnd',
		jquery: 'utils/jquery',
		player: 'malg/makePlayer',
		playerList: 'prototype/playeList',
		resolver: 'malg/resolver',
		socket: 'prototype/socket',
		vector: 'utils/vector',
	}
});

// Start the main app logic.
requirejs(['jquery', 'frontEnd', 'socket'],
function($, frontEnd, socket){
	socket.init();

});