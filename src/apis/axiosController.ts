import axios from 'axios'
import { STATUS_CODE } from './enum/result'
import { refreshToken } from './user/refreshToken'
import { useStorage } from '@/singleton/storage'
import { showToast } from 'vant'
import router from '@/router'
import { refreshPublicKey } from '@/hooks/methods'
import { Common } from '@/utils/common'

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

axios.interceptors.request.use(
  async (requestConfig: any) => {
    // 处理请求的扩展配置
    if (requestConfig?.extendConfig) {
      const originData = requestConfig.data || requestConfig.params
      // 进行rsa加密的字段
      if (requestConfig.extendConfig.rsaEncryptKeys.length > 0) {
        await refreshPublicKey()
        for (
          let i = 0;
          i < requestConfig.extendConfig.rsaEncryptKeys.length;
          i++
        ) {
          const originValue =
            originData[requestConfig.extendConfig.rsaEncryptKeys[i]]
          originData[requestConfig.extendConfig.rsaEncryptKeys[i]] =
            Common.rsaEncrypt(originValue)
        }
      }
      delete requestConfig.extendConfig
    }
    return requestConfig
  },
  (error) => {}
)
