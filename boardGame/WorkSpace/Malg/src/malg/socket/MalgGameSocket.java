package malg.socket;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import game.config.GameConfig;
import game.socket.GameSocket;

@ServerEndpoint(value = "/malg")
public class MalgGameSocket extends GameSocket {

	public MalgGameSocket(GameConfig gameConfig) throws Exception {
		super(gameConfig);
	}

	@OnOpen
	public void open(Session session) throws Exception {
		super.open(session);
	}

	@OnClose
	public void end() {
		super.end();
	}

	@OnMessage
	public void incoming(String message) {
		try {
			defaultIncoming(message);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@OnError
	public void onError(Throwable t) throws Throwable {
		super.onError(t);
	}
}
