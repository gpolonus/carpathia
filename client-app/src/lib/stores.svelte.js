
export const GAME_STATUSES = {
  UNSTARTED: 0,
  STARTED: 1,
  FINISHED: 2,
}

export function writable(initialValue) {
  let val = $state(initialValue);

  return {
    value: val,
    set(v) {
      val = v
    }
  };
}

export const gameStatusStore = writable(GAME_STATUSES.UNSTARTED)

export const alertMessage = writable();

export const openModal = (type, message, actionName, action, showCloseButton = true) => {
  alertMessage.set({ type, message, actionName, action, showCloseButton })
}

export const clearModal = () => {
  alertMessage.set({})
}
