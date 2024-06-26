import { Request } from './base'

const baseRequest = new Request({
  prefix: import.meta.env.VITE_API_PREFIX,
})

export const request = baseRequest.request
