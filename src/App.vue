<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
// pinia store
import { useProductStore } from "./stores/ProductStore";
import { useCartStore } from "./stores/CartStore";

const cartStore = useCartStore()
const productStore = useProductStore()
productStore.fill()

// Subscribers
// https://pinia.vuejs.org/core-concepts/actions.html#Subscribing-to-actions

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
    console.log(`Start "${name}" with params [${args.join(', ')}].`)

  if (name === 'addItems') {
    after(() => {
      // This will run after the action is completed
      alert(`Added ${args[0]} items to cart`)
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
