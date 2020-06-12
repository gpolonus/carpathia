
const ws = require('ws');

const wss = require('ws').Server;
const s = new wss({
  port: 5001,
  path: '/websocket/game'
});

const getIdMaker = () => {
  let i = 0;
  return () => i++;
};

const connectionId = getIdMaker();

const connections = [];

s.on('connection', (ws) => {
  ws.on('message', (message) => {
    s.clients.forEach(c => {
      c.send(message);
    });
  });
});

// 	private String playerName;
// 	private int playerNum;
// 	private Session session;

// 	private GreenCards greenCards;
// 	private RedCards redCards;

// 	private RedCard redCard;
// 	private GreenCard greenCard;

// 	private Random rand;


// 	@OnOpen
// 	public void start(Session session) {
// 		this.session = session;
// 		String message = String.format("* %s %s", "someone", "has joined.");
// 		broadcast(message);
// 	}
const onStart = (session) => {
  connections.push({
    session,
    id: connectionId()
  });
  broadcast(`* someone has left the chat`);
};


// 	@OnClose
// 	public void end() {
// 		connections.remove(this.playerNum);
// 		String message = String.format("* %s %s",
// 				this.playerName, "has disconnected.");
// 		broadcast(message);
// }
const end = id => () => {
  const connection = connections.find(c => c.id === id)
  connections = connections.filter(c => c.id !== id)
  broadcast(`* ${connection.playerName} has disconnected`);
}

// 	@OnMessage
// 	public void incoming(String message) {
const incoming = connection = (msg) => {
  const [type, ...args] = msg.split('~');
  switch(type) {
    case 'newPlayer':
      break;
}
// 		// Never trust the client
// 		// String filteredMessage = String.format("%s: %s",
// 		// playerName, HTMLFilter.filter(message.toString()));
// 		// broadcast(filteredMessage);
// 		String msg = HTMLFilter.filter(message.toString());
// 		String[] args = msg.split("~");
// 		switch(args[0])
// 		{
// 			case "newPlayer":
// 				this.playerName = args[1];
// 				this.playerNum = connectionIds.getAndIncrement();
// 				connections.add(this);
// 				// if(connections.size() == 1)
// 				// 	return;
// 				tellEveryoneElse("otherNewPlayers~" + this.playerName + '|' + this.playerNum + '~');
// 				String str = "otherNewPlayers~";
// 				for(GameSocket client : connections)
// 				{
// 					print(args[1] + " != " +client.playerName);
// 					if(client.playerNum != this.playerNum)
// 					{
// 						str += client.playerName + '|' + client.playerNum + '~';
// 					}
// 				}
// 				tellMe(str);
// 			break;

// 			case "ready":
// 				broadcast("ready~"+this.playerNum+"~");
// 			break;

// 			case "rolled": case "askAnnoy": case "annoy": case "start": case "yourTurn":
// 				broadcast(msg);
// 			break;

// 			case "greenCard":
// 				print("greenCard Show Start");
// 				greenCard = greenCards.getCard();
// 				// broadcast("greenCard~" + args[1] + "~" + greenCard.question + "~" + greenCard.answers.get(0) + "~" + greenCard.answers.get(1) + "~" + greenCard.answers.get(2) + "~" + greenCard.answers.get(3) + "~");
// 				String[] answers = greenCard.getRandomAnswers();
// 				tellMe("greenCard~" + args[1] + "~" + greenCard.question + "~" + answers[0] + "~" + answers[1] + "~" + answers[2] + "~" + answers[3] + "~");
// 				broadcast("greenCardShow~" + args[1] + "~" + greenCard.question + "~" + answers[0] + "~" + answers[1] + "~" + answers[2] + "~" + answers[3] + "~");
// 				print("greenCard Show End");
// 			break;

// 			case "redCard":
// 				redCard = redCards.getCard();
// 				broadcast("redCard~" + args[1] + "~" + redCard.question + "~");
// 			break;

// 			case "greenCardAnswer":
// 				if(greenCard.getRandomedAnswer(args[1])){
// 					broadcast("greenCardAnswer~" + args[3] + " selected \"" + args[1] + "\" and got the question right!");
// 					broadcast("getTokens~" + args[2] + "~" + 2 + "~");
// 					broadcast("rollAgain~" + args[2] + "~");
// 				}
// 				else {
// 					broadcast("greenCardAnswer~" + args[3] + " selected \"" + args[1] + "\" and got the question wrong!");
// 					broadcast("loseTokens~" + args[2] + "~" + 1 + "~");
// 					tellMe("turnEnd~" + args[2] + "~");
// 				}
// 			break;

// 			default:
// 				broadcast(msg);
// 		}
// 	}




// 	@OnError
// 	public void onError(Throwable t) throws Throwable {
// 		log.error("Chat Error: " + t.toString(), t);
// 	}


// 	private static void broadcast(String msg) {
// 		for (GameSocket client : connections) {
// 			try {
// 				synchronized (client) {
// 					client.session.getBasicRemote().sendText(msg);
// 				}
// 			} catch (IOException e) {
// 				log.debug("Chat Error: Failed to send message to client", e);
// 				connections.remove(client);
// 				try {
// 					client.session.close();
// 				} catch (IOException e1) {
// 					// Ignore
// 				}
// 				String message = String.format("* %s %s",
// 						client.playerName, "has been disconnected.");
// 				broadcast(message);
// 			}
// 		}
// 	}

// 	private void tellEveryoneElse(String msg)
// 	{
// 		for (GameSocket client : connections) {
// 			System.out.println("tellEveryoneElse: " + client.playerName + "; with message: " + msg);
// 			try {
// 				if(client.playerNum != playerNum)
// 					synchronized (client) {
// 						client.session.getBasicRemote().sendText(msg);
// 					}
// 			} catch (IOException e) {
// 				log.debug("Chat Error: Failed to send message to client", e);
// 				connections.remove(client);
// 				try {
// 					client.session.close();
// 				} catch (IOException e1) {
// 					// Ignore
// 				}
// 				String message = String.format("* %s %s",
// 						client.playerName, "has been disconnected.");
// 				broadcast(message);
// 			}
// 		}
// 	}

// 	private void tellMe(String msg)
// 	{
// 		System.out.println("TellMe Called: " + connections.size());
// 		try {
// 			synchronized (this) {
// 				this.session.getBasicRemote().sendText(msg);
// 			}
// 		} catch (IOException e) {
// 			log.debug("Chat Error: Failed to send message to client", e);
// 			connections.remove(this);
// 			try {
// 				this.session.close();
// 			} catch (IOException e1) {
// 				// Ignore
// 			}
// 			String message = String.format("* %s %s",
// 					this.playerName, "has been disconnected.");
// 			broadcast(message);
// 		}
// 	}

// 	private static void print(String str)
// 	{
// 		System.out.println(str);
// 	}
// }
