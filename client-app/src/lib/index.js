import * as ds from './sse.js';
import {
  gameStatusStore,
  openModal,
  clearModal
} from './stores.svelte.js';

const handleMessage = (type, data) => {
  switch(type) {
    // Runtime events
    case 'starting':
      gameStatusStore.set(GAME_STATUSES.STARTED)
      break;
    case 'finished':
      gameStatusStore.set(GAME_STATUSES.FINISHED)
      break;

    case 'reset':
      gameStatusStore.set(GAME_STATUSES.UNSTARTED)
      break;
  }
}

const onOpen = (e) => {

}

const onReconnect = (e) => {
  openModal('message', "You've been reconnected! Just hit Resume to continue:",
    'Resume',
    () => {
      setTimeout(async () => {
        // TODO: Reset the client state, whatever that means
        // selectCharacter(chosenCharacters)
        clearModal()
      })
    },
    // Don't show the close button
    false
  )
}

const onError = (e) => {
  openModal(
    'error',
    // 'You have been disconnected from the server, hit the Reconnect button or refresh the page and reselect your character(s) to get back in.',
    // 'Reconnect',
    'You have been disconnected from the server, please wait to be reconnected or refresh the page and reselect your character(s) to get back in.',
    'Reload',
    () => {
      // Calling `connect` here will open a whole nother connection when the
      // original one is trying to stay alive, thus creating more than one
      // connection per tab.
      // TODO: All that's needed is to resend what character this client is, once the client is connected again.
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
