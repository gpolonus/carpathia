
class AppBase {

  clients = {};

  clientOpened(client, args) {
    console.log('Connection opened:', clientId, client.name)
    console.log('Open connections:', this.clients.map(({ name }) => name))

    this.clients[client.id] = client
    this.onClientOpen(client, args);
  }

  clientClosed(client) {
    delete this.clients[client.id];
    console.log(`${client.name}: ${clientId} Connection closed.`);
    this.onClientClose(client)
  }

  clientMessage(clientId, action, args) {
    this.onMessage(this.clients[clientId], action, args)
  }

  sendMessageToAll(type, data = {}, clients) {
    clients = Object.values(clients || this.clients)
    clients.forEach(client => client.send(type, data))
  }

  onClientOpen() {
    throw Error('`onClientOpen` needs to be implemented in a child class.');
  }

  onClientClose() {
    throw Error('`onClientClose` needs to be implemented in a child class.');
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

  onClientOpen(client, args) {
    this.apps.forEach(app => app.onClientOpen(client))
  }

  onClientClose(client) {
    this.apps.forEach(app => app.onClientClose(client))
  }

  onMessage(client, action, args) {
    this.apps.forEach(app => app.onMessage(client, action, args))
  }

}

export class GameApp extends AppBase {
  players = []
  boardViewClient = 0;

  resetState() {
    this.players = []
    this.boardViewClient = 0;
  }

  onClientOpen(client, args) {
    if (args?.type === 'boardview') {
      this.boardViewClient = client;
    } else {
      this.players.push(client)
    }
  }

  onClientClose(client) {
    this.players = this.players.filter(c => c.id !== client.id)
  }

  onMessage(client, action, args) {

  }
}

export class AdminApp extends AppBase {

  resetState() {

  }

  onClientOpen(client, args) {

  }

  onClientClose(client) {

  }

  onMessage(client, action, args) {

  }
}

export default new ComboApp(new GameApp, new AdminApp)
