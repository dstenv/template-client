import { useUserStore } from '@/store/user'
import { Common } from '@/utils/common'

export class MyStorage {
  static storageInst: null | MyStorage = null

  set(key: keyof typeof Common.LocalStorageKey, value: any): boolean {
    if (['', null, undefined].includes(value)) {
      // TODO 存储数据为空
      throw new Error(`${key}存储数据为空`)
    }

    const setValue = ['Object', 'Array'].includes(Common.getType(value))
      ? JSON.stringify(value)
      : value

    localStorage.setItem(key, setValue)

    return true
  }
  get(key: keyof typeof Common.LocalStorageKey): any | null {
    const value = localStorage.getItem(key)

    if (value === null) {
      // TODO 无该字段的存储数据
      throw new Error(`无${key}的存储数据`)
    }

    let data: any
    try {
      data = JSON.parse(value)
    } catch (error) {
      data = value
    }

    if (data.time && data.time < +new Date()) {
      // TODO 存储数据过期
      throw new Error(`${key}字段存储数据过期`)
    }

    return data
  }
  remove(key: keyof typeof Common.LocalStorageKey) {
    localStorage.removeItem(key)
  }

  static getInstance() {
    if (!this.storageInst) {
      this.storageInst = new MyStorage()
    }
    return this.storageInst
  }
}

export const useStorage = () => MyStorage.getInstance()
