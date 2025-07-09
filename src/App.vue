<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
// pinia store
import { useProductStore } from "./stores/ProductStore";
import { useCartStore } from "./stores/CartStore";
import { ref, reactive } from "vue";

const cartStore = useCartStore()
const productStore = useProductStore()
productStore.fill()

const doingHistory = ref(false)
const cartHistory = reactive([]) // used to save the complete state at each mutation event using $subscribe
cartHistory.push(JSON.stringify(cartStore.$state)) // save a copy of the stores starting state

/**
 * Undoes a previous mutation against the cart state
 */
const undoLastAction = () => {
  if(cartHistory.length === 1) return
  doingHistory.value = true
  // undo the last state change from the history
  cartHistory.pop()
  // add the last history item to the state
  cartStore.$state = JSON.parse(cartHistory.at(-1))
  doingHistory.value = false
}

// Subscribers
// https://pinia.vuejs.org/core-concepts/actions.html#Subscribing-to-actions

cartStore.$subscribe(
  (
    mutation, // what is being changes, the store, the type
    state, // state after a changed in the store is completed: 'direct' | 'patch object' | 'patch function'
  ) => {
    // save the state in history for future reference
    if (!doingHistory.value) {
      cartHistory.push(JSON.stringify(state)) // stringify to prevent objects being accessed by reference
    }
})

/**
 * When an action is made within the cart store
 */
cartStore.$onAction (
  ({
    name, // name of the action
    store, // store instance, same as `someStore`
    args, // array of parameters passed to the action
    after, // hook after the action returns or resolves
    onError, // hook if the action throws or rejects  
  }) => {
    // a shared variable for this specific action call
    const startTime = Date.now()
    // this will trigger before an action on `store` is executed
    // console.log(`Start "${name}" with params [${args.join(', ')}].`)

  if (name === 'addItems') {
    after(() => {
      // This will run after the action is completed
      // alert(`Added ${args[0]} items to cart`)
      // here we can implement a toast msg notification, logging to analytics
      // or if onError, then log the error somewhere
    })
  }

  after(() => {
      console.log(
        `Finished "${name}" after ${
          Date.now() - startTime
        }ms.`
      )
  })
  // this will trigger if the action throws or returns a promise that rejects
  onError((error) => {
    console.warn(
      `Failed "${name}" after ${Date.now() - startTime}ms.\nError: ${error}.`
    )
  })
}, true) // true keeps this subscriber alive if component unmounts

</script>

<template>
  <div class="container">
    <TheHeader />
    <AppButton class="text-right mb-2" @click="undoLastAction">Undo</AppButton>
    <ul class="sm:flex flex-wrap lg:flex-nowrap gap-5">
      <ProductCard
        v-for="product in productStore.products"
        :key="product.name"
        :product="product"
        @addToCart="cartStore.addItems($event, product)"
      />
    </ul>
  </div>
</template>
