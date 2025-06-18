
import greenCard from "./greenCard.js";
import redCard from "./redCard.js";

const omap = (o, ...params) => Object.entries(o).map(...params)

class AppBase {

  clients = {}

  resetState() {
    this.sendMessageToAll('reset')
    this.clients = {}
  }

  clientOpened(client, params) {
    this.clients[client.id] = client
    this.onClientOpen(client, params);

    console.log('Connection opened:', client.id, client.name)
    console.log('Open connections:', omap(this.clients, ([id, { name }]) => [id, name]))
  }

  clientClosed(client) {
    delete this.clients[client.id];
    this.onClientClose(client)
    console.log(`${client.name}: ${client.id} Connection closed.`);
    console.log('Open connections:', omap(this.clients, ([id, { name }]) => [id, name]))
  }

  clientMessage(clientId, action, params) {
    return this.onMessage(this.clients[clientId], action, params)
  }

  clientReconnected(client, params) {
    this.clients[client.id] = client
    this.onClientReconnect(client, params)
  }

  sendMessageToAll(type, data = {}, clients) {
    console.log(`Sending message to all:`, type, data)
    clients = Object.values(clients || this.clients)
    clients.forEach(client => client.send(type, data))
  }

  onClientOpen() {
    throw Error('`onClientOpen` needs to be implemented in a child class.');
  }

  onClientClose() {
    throw Error('`onClientClose` needs to be implemented in a child class.');
  }

  onClientReconnect() {
    throw Error('`onClientReconnect` needs to be implemented in a child class.');
  }

  onMessage() {
    throw Error('`onMessage` needs to be implemented in a child class.');
  }
}

class ComboApp extends AppBase {

  apps = [];

  constructor(...apps) {
    super();
    this.apps = apps
  }

  resetState() {
    this.apps.forEach(app => app.resetState())
  }

  onClientOpen(client, params) {
    this.apps.forEach(app => app.onClientOpen(client, params))
  }

  onClientClose(client) {
    this.apps.forEach(app => app.onClientClose(client))
  }

  onClientReconnect(client, params) {
    this.apps.forEach(app => app.onClientReconnect(client, params))
  }

  onMessage(client, action, params) {
    this.apps.forEach(app => app.onMessage(client, action, params))
  }

}

export class GameApp extends AppBase {
  started = false
  players = []
  boardViewClient = 0;
  greenCard;
  redCard;

  resetState() {
    super.resetState()
    this.started = false
    this.players = []
    this.boardViewClient = 0;
    this.redCardReactions = {}
    this.greenCard = {};
    this.redCard = {};
  }

  boardViewSend(...args) {
    if (this.boardViewClient) {
      this.boardViewClient.send(...args)
    } else {
      console.log('THE BOARDVIEW DISCONNECTED FOR SOME REASON.')
      const newBoardView = Object.values(this.clients).find(c => c.name === 'boardview')
      if (newBoardView) {
        this.boardViewClient = newBoardView
        this.boardViewSend(...args)
        console.log('BOARDVIEW FOUND')
      }
    }
  }

  playerSend(p, ...args) {
    if (p.left) {
      console.log(`Player ${p.name} is not connected`)
    } else {
      p.send(...args)
    }
  }

  onClientOpen(client, params) {
    if (params?.type === 'boardview') {
      this.boardViewClient = client;
      client.name = 'boardview'
    } else {
      if (!this.started) {
        this.players.push(client)
      } else {
        client.left = false
      }
    }
  }

  onClientReconnect(client, params) {
    this.onClientOpen(client, params)

    if (client.id === this.boardViewClient.id) {
      this.boardViewSend(
        'playerData',
        this.players.map(
          ({ name, id }, i) => ({ name, id, playerNum: i })
        )
      )
    } else {
      this.boardViewSend(
        'playerReturned',
        {
          clientId: client.id,
          name: client.name
        }
      )
    }
  }

  onClientClose(client) {
    // return the player data so that the system can hold onto the data for reconnection purposes
    // this is very dependent on the data being stored on the client
    // Actually, don't need to do this bc the FE can just hold onto it's own
    // stuff. The BE will just broker the client IDs being consistent.

    if (client === this.boardViewClient) {
      this.boardViewClient = 0
    } else if (!this.started) {
      this.players = this.players.filter(c => c.id !== client.id)

      this.boardViewSend(
        'playerLeft',
        client.id
      );
    } else {
      // Should also mutate the object in the players list
      client.left = true

      this.boardViewSend(
        'playerLeft',
        client.id
      );
    }
  }

  onMessage(client, action, params) {
    console.log(`Got a ${action} message from ${client.name} with data: ${JSON.stringify(params)}`)
    switch (action) {
      case 'setName':
        client.name = params.name
        client.color = params.color
        // TODO: send additional player data
        this.boardViewSend(
          'playerData',
          this.players.map(
            ({ name, id, color }, i) => ({ name, id, color, playerNum: i })
          )
        )
        break;

      case 'start':
        this.started = true
        this.players.forEach(p => this.playerSend(p, 'start'))
        break;

      case 'finished':
        this.started = false
        this.players.forEach(p => this.playerSend(p, 'finished'))
        break;

      case 'requestPlayerInput':
        const playerClientId = params.clientId
        let playersToRequest = [this.players.find(p => p.id === playerClientId)]
        switch (params.type) {
          case 'greenCard':
            params.options = this.greenCard.options
            params.question = this.greenCard.question
            break;
          case 'redCardReactions':
            params.prompt = this.redCard
            const reactedPlayers = Object.keys(this.redCardReactions || {})
            const unreactedPlayers = this.players.filter(p => !reactedPlayers.includes(p.id))
            const answeringPlayerIndex = unreactedPlayers.findIndex(p => p.id === playerClientId)
            const answeringClient = unreactedPlayers.splice(answeringPlayerIndex, 1)[0]
            params.playerName = answeringClient.name
            console.log({ reactions: this.redCardReactions, playerClientId, answeringClient: answeringClient.id, players: this.players.map(({ name, id, left }) => ({ name, id, left })), reactedPlayers, unreactedPlayers })
            playersToRequest = unreactedPlayers
            break;
          case 'redCard':
            params.prompt = this.redCard
            break;
        }

        playersToRequest.forEach(p => this.playerSend(p, action, params));
        break;

      case 'playerInput':
        switch (params.type) {
          case 'greenCard':
            console.log('answer', this.greenCard.answer)
            params.isCorrect = params.answer == this.greenCard.answer
            params.correctAnswer = this.greenCard.answer
            break;
          case 'redCardReactions':
            this.redCardReactions ??= {}
            this.redCardReactions[client.id] = params.result
            console.log('redCardReactions', this.redCardReactions)
            if (Object.values(this.redCardReactions).length !== this.players.length - 1)
              return;
            else {
              params.reactions = this.redCardReactions
              this.redCardReactions = {}
            }
            break;
        }

        this.boardViewSend(action, params);
        break;

      case 'greenCard':
        this.greenCard = greenCard.getCard()
        this.boardViewSend('greenCard', {
          options: this.greenCard.options,
          question: this.greenCard.question
        })
        break;

      case 'redCard':
        this.redCard = redCard.getCard()
        this.boardViewSend('redCard', {
          prompt: this.redCard
        })
        break;
    }
  }
}

export class AdminApp extends AppBase {

  resetState() {

  }

  onClientOpen(client, params) {

  }

  onClientClose(client) {

  }

  onMessage(client, action, params) {

  }
}

// export default new ComboApp(new GameApp, new AdminApp)
export default new GameApp
