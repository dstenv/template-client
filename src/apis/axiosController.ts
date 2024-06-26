import axios from 'axios'
import { STATUS_CODE } from './enum/result'
import { refreshToken } from './user/refreshToken'
import { useStorage } from '@/singleton/storage'
import { showToast } from 'vant'
import router from '@/router'

axios.interceptors.response.use(
  async (response) => {
    const storage = useStorage()
    // 刷新token
    if (response.data?.status === STATUS_CODE.REFRESH_TOKEN) {
      const refreshResult = await refreshToken()
      storage.set('USER_TOKEN', refreshResult.token)
      response = await axios({
        ...response.config,
        headers: {
          ...response.config.headers,
          Authorization: refreshResult.token,
        },
      })
      return response
    }
    // 未登录
    if (response.data?.status === 401) {
      storage.remove('USER_TOKEN')
      storage.remove('USER_REFRESH_TOKEN')
      storage.remove('USER_INFO')
      showToast('用户登录信息失效或过期')
      router.replace('/other/begin')
      throw new Error('用户登录信息失效或过期')
    }
    if (response.data?.status !== 200) {
      throw new Error(response.data?.msg)
    }
    return response
  },
  (error) => {
    console.log('axios reponse -->', error)
    return Promise.reject(error)
  }
)
