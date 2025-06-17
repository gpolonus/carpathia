
import { sendMessage } from './index.js'

export const GAME_STATUSES = {
  UNSTARTED: 1,
  STARTED: 2,
  FINISHED: 3,
}

const allStores = [];

export function resumableStore(initialValue) {
  const storeIndex = allStores.length
  // TODO LATER: Make sure these are cleared out when the game is over
  const oldValue = localStorage.getItem(`store-${storeIndex}`)
  initialValue = oldValue !== null ? JSON.parse(oldValue) : initialValue
  const store = $state({ value: initialValue });

  if (store.value)
    localStorage.setItem(`store-${storeIndex}`, JSON.stringify(store.value))
  else
    localStorage.removeItem(`store-${storeIndex}`)

  // const store = {
  //   value: val,
  //   set(v) {
  //     if (v)
  //       localStorage.setItem(`store-${storeIndex}`, JSON.stringify(v))
  //     else
  //       localStorage.removeItem(`store-${storeIndex}`)

  //     val = v
  //   }
  // };

  $effect.root(() => {
    $effect(() => {
      console.log(`store-${storeIndex} value changed: `, store.value);
      if (store.value)
        localStorage.setItem(`store-${storeIndex}`, JSON.stringify(store.value))
      else
        localStorage.removeItem(`store-${storeIndex}`)
    })

    return () => {}
  })

  allStores.push(store)

  return store
}

export function writable(initialValue) {
  // Have to do this variable assignment bc of Svelte magic
  const s = $state({ value: initialValue });
  return s
}

export const gameStatusStore = resumableStore(GAME_STATUSES.UNSTARTED)

export const playerInputStore = resumableStore();

export const sendPlayerInput = (type, data = {}, options = {}) => {
  data.type = type
  sendMessage('playerInput', data);

  if (options.keep) return;

  playerInputStore.value = null
}

export const alertMessage = writable({});

export const playerName = resumableStore();

export const openModal = (type, message, actionName, action, showCloseButton = true) => {
  alertMessage.value = { type, message, actionName, action, showCloseButton }
}

export const clearModal = () => {
  alertMessage.value = {}
}
