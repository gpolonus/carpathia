
const greenCards = requrie('./greenCard')
const redCards = requrie('./redCard')

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

s.on('connection', onStart);

const onStart = (client) => {
  client.on('message', incoming(client));
  client.on('error', onError);
};

//   @OnClose
//   public void end() {
//     connections.remove(this.playerNum);
//     String message = String.format("* %s %s",
//         this.playerName, "has disconnected.");
//     broadcast(message);
// }
const end = id => () => {
  const connection = connections.find(c => c.id === id)
  connections = connections.filter(c => c.id !== id)
  broadcast(`* ${connection.playerName} has disconnected`);
}

const incoming = client => {
  let playerNum, playerName, greenCard, redCard;
  return (msg) => {
    console.log('incoming', msg);
    broadcast(`playerName: ${msg}`);
    const [type, ...args] = msg.split('~');
    switch(type) {
      case 'newPlayer':
        playerName = args[0];
        playerNum = connectionId();
        connections.push({
          client,
          id: playerNum,
          playerNum,
          playerName
        });
        if(connections.length === 1) {
          return;
        }

        tellEveryoneElse(playerNum, `otherNewPlayers~${playerName}|${playerNum}~`);
        const message = connections.filter(c => c.id !== playerNum).reduce((ac, session) => `${ac}${session.playerName}|${session.playerNum}~`, 'otherNewPlayers~');
        tellMe(playerNum, message);
        break;

      case "ready":
        broadcast("ready~" + playerNum + "~");
        break;

      case "rolled": case "askAnnoy": case "annoy": case "start": case "yourTurn":
        broadcast(msg);
        break;

      case "greenCard":
        greenCard = greenCards.getCard();
        const options = greenCard.options;
        const answersMessage = args[1] + "~" + greenCard.question + "~" + options[0] + "~" + options[1] + "~" + options[2] + "~" + options[3] + "~";
        tellMe(playerNum, "greenCard~" + answersMessage);
        broadcast("greenCardShow~" + answersMessage);
        break;

      case "redCard":
        redCard = redCards.getCard();
        broadcast("redCard~" + args[1] + "~" + redCard + "~");
        break;

      case "greenCardAnswer":
        const [ selectedOption ] = args;
        if(selectedOption === greenCard.answerValue) {
          broadcast("greenCardAnswer~" + playerName + " selected \"" + selectedOption + "\" and got the question right!");
          broadcast("getTokens~" + playerNum + "~" + 2 + "~");
          broadcast("rollAgain~" + playerNum + "~");
        } else {
          broadcast("greenCardAnswer~" + playerName + " selected \"" + selectedOption + "\" and got the question wrong!");
          broadcast("loseTokens~" + playerNum + "~" + 1 + "~");
          tellMe(playerNum, "turnEnd~" + playerNum + "~");
        }
        break;

      default:
        broadcast(msg);
    }
  }
}

const onError = (...args) => console.log('error:', JSON.stringify(args));

const broadcast = (msg, connections = connections) => {
  connections.forEach(session => {
    try {
      session.client.send(msg);
    } catch (error) {
      // logic for removing clients
    }
  });
}
//   private static void broadcast(String msg) {
//     for (GameSocket client : connections) {
//       try {
//         synchronized (client) {
//           client.session.getBasicRemote().sendText(msg);
//         }
//       } catch (IOException e) {
//         log.debug("Chat Error: Failed to send message to client", e);
//         connections.remove(client);
//         try {
//           client.session.close();
//         } catch (IOException e1) {
//           // Ignore
//         }
//         String message = String.format("* %s %s",
//             client.playerName, "has been disconnected.");
//         broadcast(message);
//       }
//     }
//   }

const tellEveryoneElse = (playerNum, msg) => {
  broadcast(msg, connections.filter(c => c.id !== playerNum));
}

//   private void tellEveryoneElse(String msg)
//   {
//     for (GameSocket client : connections) {
//       System.out.println("tellEveryoneElse: " + client.playerName + "; with message: " + msg);
//       try {
//         if(client.playerNum != playerNum)
//           synchronized (client) {
//             client.session.getBasicRemote().sendText(msg);
//           }
//       } catch (IOException e) {
//         log.debug("Chat Error: Failed to send message to client", e);
//         connections.remove(client);
//         try {
//           client.session.close();
//         } catch (IOException e1) {
//           // Ignore
//         }
//         String message = String.format("* %s %s",
//             client.playerName, "has been disconnected.");
//         broadcast(message);
//       }
//     }
//   }

const tellMe = (playerNum, msg) => connections.find(c => c.id === playerNum).client.send(msg)
