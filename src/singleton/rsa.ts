class AES {
  private publicKey!: string
  static AESInstance: AES | null

  static getInstance() {
    return AES.AESInstance || (AES.AESInstance = new AES())
  }

  setPublicKey(key: string) {
    this.publicKey = key
  }

  getKey() {
    return {
      publicKey: this.publicKey,
    }
  }

  clear() {
    this.publicKey = ''
  }

  clearInstance() {
    AES.AESInstance = null
  }
}

export const useAES = () => AES.getInstance()
