import { defineStore } from "pinia";

export const useCartStore = defineStore("CartStore", {
  state: () => {
    return {
      items: [],
    }
  },

  getters: {
    count: (state) => state.Ìitems.length || 0,
    isEmpty: (state) => state.count === 0,
  },

  actions: {
    addItems(count, item) {
      count = parseInt(count)
      for (let i = 0; i < count; i++) {
        this.items.push({ ...item }) // clone the item to aviod ref issues
      }
    }
  }
});