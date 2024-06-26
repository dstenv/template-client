import { request } from '../controller'

export class GetRsaResponse {
  public!: string
}

export const getRsaApi = request<null>(
  {
    url: 'rsa/getRSA',
  },
  GetRsaResponse
)
