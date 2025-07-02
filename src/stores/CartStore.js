import { defineStore, acceptHMRUpdate } from "pinia";
import { groupBy, sumBy } from 'lodash';
import { useAuthUserStore } from "./AuthUserStore";

export const useCartStore = defineStore("CartStore", {
  state: () => {
    return {
      items: [],
    }
  },

  getters: {
    count: (state) => state.items.length || 0,
    isEmpty: (state) => state.count === 0,
    grouped: (state) => {
      const grouped = groupBy(state.items, (item) => item.name)
      const sorted = Object.keys(grouped).sort()
      let inOrder = {}
      sorted.forEach((key) => inOrder[key] = grouped[key])
      return inOrder
    },
    groupCount: (state) => (name) => state.grouped[name].length,
    totalPrice: (state) => sumBy(state.items, (item) => item.price)
  },

  actions: {
    checkout() {
      const authUserStore = useAuthUserStore();
      alert(`${authUserStore.username} just bought ${this.count} items for a total of $${this.totalPrice.toFixed(2)}!`)
    },
    
    addItems(count, item) {
      count = parseInt(count)
      for (let i = 0; i < count; i++) {
        this.items.push({ ...item }) // clone the item to avoid ref issues
      }
    },

    /**
     * Removes all quantities of the item
     * @param {*} name Item name to remove
     */
    removeAllItem(name) {
      this.items = this.items.filter((item) => item.name !== name)
    },

    /**
     * Remove a single item
     * @param {*} name Item name to remove
     */
    removeItem(name) {
      const index = this.items.findIndex(item => item.name === name)
      console.log(index)
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },

    /**
     * Set the quantity of an item in the cart.
     * 
     */
    setItemQuantity(item, count) {
      this.removeAllItem(item.name);
      this.addItems(count, item);
    }
  }
});

// make sure to pass the right store definition, `useAuth` in this case.
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCartStore, import.meta.hot))
}