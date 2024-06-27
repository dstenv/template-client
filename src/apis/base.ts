import axios from 'axios'
import { Tools } from 'dstenv-tools'
import { useLoading } from '@/singleton/loading'
import { useStorage } from '@/singleton/storage'
import { plainToClass, type ClassConstructor } from 'class-transformer'

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT'
type Content = 'application/json'
type HeaderKey = 'Content-Type' | 'Accept' | 'Authorization' | 'RefreshToken'
type keyFn = (payload: Partial<Record<HeaderKey, string | boolean>>) => void
type HeaderKeyFn = Partial<Record<HeaderKey, keyFn>>

export interface RequestBaseType {
  method?: Method
  headers?: Partial<Record<HeaderKey, boolean | string>>
  url?: string
  data?: any
  params?: any
  timeout?: number
  extendConfig?: {
    httpType?: 'api' | 'apis'
    loading?: boolean
    oprateUrl?: () => string
    // 需要进行rsa加密的字段
    rsaEncryptKeys?: string[]
  }
}
export class ResponseBaseType<T> {
  data!: {
    data: T
    status: number
    msg: string
  }
}

export class RequestType {
  prefix!: string
}

const requestBaseConfig: RequestBaseType = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': true,
  },
  url: '',
  timeout: 5000,
  extendConfig: {
    loading: true,
  },
}

const bodyObj: Partial<Record<Method, 'data' | 'params'>> = {
  GET: 'params',
  POST: 'data',
  DELETE: 'data',
}

// 自定义请求头
const customHeaderKey: HeaderKey[] = ['Authorization', 'RefreshToken']
const customHeaderKeyFn: HeaderKeyFn = {
  Authorization: (payload) => {
    const storage = useStorage()
    try {
      payload.Authorization = storage.get('USER_TOKEN')
    } catch (error) {
      payload.Authorization = ''
    }
  },
  RefreshToken: (payload) => {
    const storage = useStorage()
    try {
      payload.RefreshToken = storage.get('USER_REFRESH_TOKEN')
    } catch (error) {
      payload.RefreshToken = ''
    }
  },
}

export class Request {
  /**
   * @description 初步完成
   * @param {RequestBaseType} options 请求配置，如url等
   * @param {U} resp 回参类型
   * @return {*} Promise U 回参
   */
  request: <T, U extends { new (...args: any[]): U } = any>(
    options: RequestBaseType,
    resp: U
  ) => (body?: T) => Promise<U>

  constructor({ prefix }: RequestType) {
    this.request = (options, resp) =>
      async function (body) {
        const requestOptions = { ...options }
        const loading = useLoading()

        const id = loading.requestId++
        loading.addRequest({
          id,
          finish: false,
        })

        requestOptions.method =
          requestOptions.method || requestBaseConfig.method

        requestOptions.headers = {
          ...requestBaseConfig.headers,
          ...requestOptions.headers,
        }
        // 自定义请求头

        // 统一处理的请求头
        for (const key of customHeaderKey) {
          if (requestOptions.headers[key] === true) {
            ;(customHeaderKeyFn[key] as keyFn)(requestOptions.headers)
          }
        }
        requestOptions.timeout =
          requestOptions.timeout || requestBaseConfig.timeout

        if (requestOptions?.extendConfig?.oprateUrl) {
          requestOptions.url = requestOptions.extendConfig.oprateUrl()
        }

        if (requestOptions.url?.startsWith('/')) {
          requestOptions.url = requestOptions.url.slice(1)
        }

        if (prefix === 'api') {
          prefix = `/${prefix}`
        }

        requestOptions.url = `${
          prefix || requestOptions?.extendConfig?.httpType
        }/${requestOptions.url}`

        const bodyKey = bodyObj[requestOptions.method as Method]
        if (bodyKey) {
          requestOptions[bodyKey] = body
        }

        if (requestOptions.method === 'PUT') {
          requestOptions.data = Tools.queryString(
            body as unknown as { [key: string]: string }
          )
        }

        if (
          requestOptions?.extendConfig?.loading ??
          requestBaseConfig.extendConfig?.loading
        ) {
          loading.create()
        }
        let result: ResponseBaseType<typeof resp>

        try {
          result = await axios({
            ...requestOptions,
          })
        } catch (error: any) {
          throw new Error(error.message)
        } finally {
          loading.finishOneRequest(id)

          setTimeout(() => {
            loading.close()
          }, 300)
        }

        result.data.data = plainToClass(resp, result.data.data)
        return result.data.data
      }
  }
}
