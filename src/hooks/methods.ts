import { getRsaApi } from '@/apis/rsa/getRsa'
import { useAES } from '@/singleton/rsa'

/**
 * @description 获取公钥
 * @return {string} publicKey 公钥
 */
export const refreshPublicKey = async (): Promise<string> => {
  const aes = useAES()
  const publicKey = aes.getKey().publicKey || ''
  if (!publicKey.trim()) {
    const rsaResult = await getRsaApi()
    aes.setPublicKey(rsaResult.public)
  }
  return publicKey
}
