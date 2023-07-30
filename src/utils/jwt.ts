import config from '../config/config'
import jwt from 'jsonwebtoken'

interface jwtPayload {
  _id: string
  email: string
  role: string
}
export const GenerateToken = (payload: jwtPayload) => {
  return jwt.sign(payload, config.jwt.secret!, {
    expiresIn: config.jwt.ex,
  })
}

export const VerifyToken = (token: string) => {
  return jwt.verify(token, config.jwt.secret!)
}
