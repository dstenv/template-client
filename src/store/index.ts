import { defineStore } from 'pinia'

export const useIndexStore = defineStore('index', () => {}, {
  persist: {
    enabled: true,
  },
})
