<script setup>
import TheHeader from "@/components/TheHeader.vue";
import ProductCard from "@/components/ProductCard.vue";
// pinia store
import { useProductStore } from "./stores/ProductStore";
import { useCartStore } from "./stores/CartStore";

const cartStore = useCartStore()
const productStore = useProductStore()
productStore.fill()

cartStore.$onAction (({ name, args, after, onError}) => {
  if (name === 'addItems') {
    after(() => {
      // This will run after the action is completed
      alert(`Added ${args[0]} items to cart`)
      // here we can implement a toast msg notification, logging to analytics
      // or if onError, then log the error somewhere
    })
  }
})

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
