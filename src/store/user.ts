import type { LoginResponse } from '@/apis/user/login'
import { useStorage } from '@/singleton/storage'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const token = ref('')
  const refreshToken = ref('')
  const userInfo = ref<LoginResponse | null>(null)

  const storage = useStorage()

  const setToken = (value: string) => {
    token.value = value
    storage.set('USER_TOKEN', value)
  }

  const setRefreshToken = (token: string) => {
    refreshToken.value = token
    storage.set('USER_REFRESH_TOKEN', token)
  }

  const setUserInfo = (info: LoginResponse) => {
    userInfo.value = userInfo.value ? { ...userInfo.value, ...info } : info
    storage.set('USER_INFO', userInfo.value)
  }

  const getUserInfo = () => {
    if (userInfo.value) {
      return userInfo
    } else {
      const storage = useStorage()
      try {
        const user = JSON.parse(storage.get('USER_INFO'))
        setUserInfo(user)
        return userInfo
      } catch (error) {
        return null
      }
    }
  }

  const getToken = () => {
    if (token.value) {
      return token
    } else {
      const storage = useStorage()
      const localToken = JSON.parse(storage.get('USER_TOKEN'))
      setToken(localToken)
      return token
    }
  }

  const getRefreshToken = () => {
    if (refreshToken.value) {
      return refreshToken
    } else {
      const storage = useStorage()
      const token = JSON.parse(storage.get('USER_TOKEN'))
      setRefreshToken(token)
      return refreshToken
    }
  }

  return {
    setToken,
    setUserInfo,
    setRefreshToken,
    getUserInfo,
    getToken,
    getRefreshToken,
  }
})
