import { defineStore } from "pinia";

export const useProductStore = defineStore("ProductStore", {
  state: () => {
    console.log("ProductStore loaded");
    return {
      products: [],
    }
  },

  // actions
  actions: {
    async fill() {
      this.products = (await import("@/data/products.json")).default;
    }
  },

  // getters
})