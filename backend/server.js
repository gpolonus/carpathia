import 'dotenv/config'

import greenCards from './greenCard.js';
import redCards from './redCard.js';
import http from 'http';
import WebsocketServer from 'ws';

const getIdMaker = () => {
  let i = 0;
  return () => i++;
};

const connectionId = getIdMaker();

const connections = [];

const onStart = (client) => {
  console.log('start');
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
        console.log({ playerName, playerNum });
        connections.push({
          client,
          id: playerNum,
          playerNum,
          playerName
        });
        // if(connections.length === 1) {
        //   return;
        // }

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
        const answersMessage = playerNum + "~" + greenCard.question + "~" + options[0] + "~" + options[1] + "~" + options[2] + "~" + options[3] + "~";
        tellMe(playerNum, "greenCard~" + answersMessage);
        broadcast("greenCardShow~" + answersMessage);
        break;

      case "redCard":
        redCard = redCards.getCard();
        broadcast("redCard~" + playerNum + "~" + redCard + "~");
        break;

      case "greenCardAnswer":
        const [ selectedOption ] = args;
        if(selectedOption === greenCard.answer) {
          broadcast("greenCardAnswer~" + playerName + " selected \"" + greenCard.answerValue + "\" and got the question right!");
          broadcast("getTokens~" + playerNum + "~" + 2 + "~");
          broadcast("rollAgain~" + playerNum + "~");
        } else {
          broadcast("greenCardAnswer~" + playerName + " selected \"" + greenCard.answerValue + "\" and got the question wrong!");
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

const broadcast = (msg, conns = connections) => {
  conns.forEach(session => {
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

const server = http.createServer();

const ws = new WebsocketServer({ server });
ws.on('connection', onStart);

const port = process.env.SERVER_PORT
server.listen(port);
console.log(`Server listening on ${port}!`);

