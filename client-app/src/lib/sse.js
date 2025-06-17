
let clientId;
let disconnected = false;
let source;

export const url = import.meta.env.VITE_SERVER_PATH

export const openConnection = (handleMessage, onOpen, onReconnect, onError, fetchState) => {
  console.log('readyState:', source?.readyState)
  if (source?.readyState === EventSource.OPEN) {
    console.log('Already Connected')
    return
  }

  clientId = localStorage.getItem('clientId')
  const clientIdParam = clientId ? `?clientId=${clientId}` : '';

  source = new EventSource(`${url}/connect${clientIdParam}`);

  source.addEventListener("open", (e) => {
    console.log("connected", e);

    onOpen(e);

    if (disconnected && clientId) {
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
      localStorage.setItem('clientId', clientId)
    } else {
      handleMessage(type, data)
    }
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

