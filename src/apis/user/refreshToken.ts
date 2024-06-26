import { request } from '../controller'

export class RefreshTokenBody {}

export class RefreshTokenRes {
  token!: string
}

export const refreshToken = request<RefreshTokenBody>(
  {
    url: '/user/refreshToken',
    headers: {
      RefreshToken: true,
    },
  },
  RefreshTokenRes
)
