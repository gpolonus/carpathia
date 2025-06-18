import * as ds from './sse.js';
import {
  gameStatusStore,
  openModal,
  clearModal,
  playerInputStore,
  playerName,
  GAME_STATUSES,
  resetState
} from './stores.svelte.js';

const handleMessage = (type, data) => {
  switch(type) {
    // Runtime events
    case 'start':
      gameStatusStore.value = GAME_STATUSES.STARTED
      break;

    case 'finished':
      resetState()
      gameStatusStore.value = GAME_STATUSES.FINISHED
      break;

    case 'reset':
      gameStatusStore.value = GAME_STATUSES.UNSTARTED
      break;

    case 'requestPlayerInput':
      playerInputStore.value = data;
      break;

    case 'closePlayerInput':
      playerInputStore.value = null;
      break;
  }
}

const onOpen = (e) => {

}

const onReconnect = (e) => {
  console.log('RECONNECTED')
  openModal('message', "You've been reconnected! Just hit Resume to continue:",
    'Resume',
    () => {
      setTimeout(async () => {
        ds.sendMessage('setName', { name: playerName.value });
        clearModal()
      })
    },
    // Don't show the close button
    false
  )
}

// Best thing to do in the onError is to wait for the connection to reopen. If
// it doesn't, that means something is wrong with the server.
// TODO LATER: if the thing tries to reconnect too many times, tell the user that
// the server is down.
const onError = (e) => {
  openModal(
    'error',
    // 'You have been disconnected from the server, hit the Reconnect button or refresh the page and reselect your character(s) to get back in.',
    // 'Reconnect',
    'You have been disconnected from the server, please wait to be reconnected or refresh the page and start over.',
    'Reload',
    () => {
      // Calling `connect` here will open a whole nother connection when the
      // original one is trying to stay alive, thus creating more than one
      // connection per tab.
      location.reload();
      clearModal();
    }
  )
}

export const openConnection = () => {
  return ds.openConnection(handleMessage, onOpen, onReconnect, onError)
}

export { sendMessage, url } from './sse.js'

export * from './stores.svelte.js'
