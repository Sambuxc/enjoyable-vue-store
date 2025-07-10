import { ref, reactive } from "vue";

export function piniaHistoryPlugin({
  pinia, // pinia instance
  app, // app to register the plugin
  store, // call once when used in store
  options,
}) {
  if(!options.historyEnabled) return
  const doingHistory = ref(false)
  const history = reactive([]) // used to save the complete state at each mutation event using $subscribe
  const future = reactive([])
  history.push(JSON.stringify(store.$state)) // save a copy of the stores starting state

  /**
   * Undoes a previous mutation against the cart state
   */
  const undoLastAction = () => {
    if (history.length === 1) return
    doingHistory.value = true
    // undo the last state change from the history and save for redo
    future.push(history.pop())
    // add the last history item to the state
    store.$state = JSON.parse(history.at(-1))
    doingHistory.value = false
  }

  const redoLastAction = () => {
    const latestState = future.pop()
    if (!latestState) return
    doingHistory.value = true
    history.push(latestState) // keeps history track of the state
    store.$state = JSON.parse(latestState) // updates the store with the redo state
    doingHistory.value = false
  }

  // Subscribers
  // https://pinia.vuejs.org/core-concepts/actions.html#Subscribing-to-actions

  store.$subscribe(
    (
      mutation, // what is being changes, the store, the type
      state, // state after a changed in the store is completed: 'direct' | 'patch object' | 'patch function'
    ) => {
      // save the state in history for future reference
      if (!doingHistory.value) {
        history.push(JSON.stringify(state)) // stringify to prevent objects being accessed by reference
        future.splice(0, future.length) // resets the future state
      }
    })

    return {
      history,
      future,
      undoLastAction,
      redoLastAction,
    }
}