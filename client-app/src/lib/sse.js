// import { clearModal, openModal } from "..";

let clientId;
// Only holding here for reconnection purposes
// TODO: Figure out what data needs to be stored here to indicate that the
// player is playing
let chosenCharacters;
let disconnected = false;

// TODO: Fix this to not use the process
export const url = import.meta.env.VITE_SERVER_PATH

export const openConnection = (handleMessage, onOpen, onReconnect, onError) => {
  const source = new EventSource(`${url}/connect`);

  source.addEventListener("open", (e) => {
    console.log("connected", e);

    onOpen(e);

    if (disconnected && chosenCharacters) {
      disconnected = false

      onReconnect(e);
    }
  });

  source.addEventListener("message", (e) => {
    const { type, data } = JSON.parse(e.data)
    console.log('message:', type, data)
    if (type === 'clientId') {
      console.log('Setting clientId:', data.clientId)
      clientId = data.clientId
    }
    handleMessage(type, data)
  });

  // SSE error or termination
  source.addEventListener("error", (e) => {
    disconnected = true;

    onError(e);

    if (e.eventPhase === EventSource.CLOSED) {
      console.log("disconnected");
    } else {
      console.log("error", e.message);
    }
  });

  window.onbeforeunload = () => {
    console.log('closing bc of unload')
    source.close()
  }
}

export function sendMessage(action, data) {
  return fetch(`${url}/message?id=${clientId}&action=${action}&${Object.entries(data).map(([k, v]) => `${k}=${v}`).join('&')}`)
}

