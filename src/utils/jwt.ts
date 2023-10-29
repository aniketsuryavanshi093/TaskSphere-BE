import jwt from 'jsonwebtoken'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { resolve } from 'path'
import { generateKeyPairSync } from 'crypto'
import config from '../config/config'
import Logger from '../config/logger'

export interface JWTPayload extends jwt.JwtPayload {
  _id: string
  name: string
  email: string
  userName: string
  role: string
}
const _JWT_SECRET = config.jwt.secret
const _JWT_EXPIRY =
  config.jwt.expireIn?.toString() !== undefined
    ? config.jwt.expireIn?.toString()
    : '1d'

const _keyDir = resolve(`${process.cwd()}/src/keys`)
const _publicKeyPath = resolve(`${_keyDir}/rsa.pub`)
const _privateKeyPath = resolve(`${_keyDir}/rsa`)

export const generateKey = async () => {
  const keyDir = _keyDir
  const publicKeyPath = _publicKeyPath
  const privateKeyPath = _privateKeyPath

  const JWT_SECRET = _JWT_SECRET

  // Throw error if JWT_SECRET is not set
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined.')
  }

  // Check if config/keys exists or not
  if (!existsSync(keyDir)) {
    mkdirSync(keyDir)
  }

  // Check if PUBLIC and PRIVATE KEY exists else generate new
  if (!existsSync(publicKeyPath) && !existsSync(privateKeyPath)) {
    const result = generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: JWT_SECRET,
      },
    })

    const { publicKey, privateKey } = result
    writeFileSync(`${keyDir}/rsa.pub`, publicKey, { flag: 'wx' })
    writeFileSync(`${keyDir}/rsa`, privateKey, { flag: 'wx' })
    Logger.warn('New public and private key generated.')
  }
}

export const generateToken = async (payload: JWTPayload) => {
  try {
    const privateKey = readFileSync(_privateKeyPath)
    console.log(config.jwt.expireIn?.toString(), _JWT_SECRET)
    return jwt.sign(
      payload,
      { key: privateKey.toString(), passphrase: _JWT_SECRET! },
      {
        algorithm: 'RS256',
        //expiresIn: _JWT_EXPIRY,
        expiresIn: `${_JWT_EXPIRY}`,
        subject: `${payload._id}`,
      }
    )
  } catch (err) {
    Logger.error(err)
    throw err
  }
}

export const verifyToken = async (token: string) => {
  try {
    const publicKey = readFileSync(_publicKeyPath)
    return jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    }) as JWTPayload
  } catch (err) {
    Logger.error(err)
    return { error: err }
  }
}
