
// TODO: Add the ability for other players to chime in with input even when it's not asked for
// The above might be accomplishable without changing this

export function fetchPlayerInput(clientId, type) {
  return new Promise((resolve, reject) => {
    sendMessage('playerInput', {
      clientId,
      type
    });

    const eventHandler = (e) => {
      const data = e.detail
      removeEventListener('playerInput', eventHandler)
      resolve(data);
    };

    addEventListener('playerInput', eventHandler);
  });
}

export function receivedPlayerInput(clientId, input) {
  const e = new CustomEvent('playerInput', { detail: { clientId, input } });
  dispatchEvent(e)
}
