import { useAES } from '@/singleton/rsa'
import jsonEncrypt from 'jsencrypt'

export namespace Common {
  type FolderName = 'imgs' | 'icons'

  export enum LocalStorageKey {
    /** 用户短token */
    USER_TOKEN = 'token',
    /** 用户的长token */
    USER_REFRESH_TOKEN = 'refresh_token',
    /** 用户信息 */
    USER_INFO = 'user_info',
  }

  export function getUrl(imgName: string, folderName: FolderName = 'icons') {
    return new URL(`../assets/${folderName}/${imgName}`, import.meta.url).href
  }

  export const rsaEncrypt = (text: string) => {
    const aes = useAES()
    const encrypt = new jsonEncrypt()
    encrypt.setPublicKey(aes.getKey().publicKey)
    return encrypt.encrypt(text) || ''
  }

  export const getType = (value: any) => {
    let type: string = Object.prototype.toString.call(value)
    const reg = /\s.*]/g
    type = reg.exec(type)?.[0] as string
    return type.slice(1, -1)
  }

  /** 判断当前是否为https的网址 */
  export const isHttps = (protocol: string) => {
    return /https/.test(protocol)
  }
}
