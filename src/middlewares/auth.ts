import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/appError'
import { verifyToken } from '@utils/jwt'

export const userAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      throw new AppError('Unauthorized', 401)
    }

    const token = req.headers.authorization.split(' ')[1]
    const decode = await verifyToken(token)
    if (!decode) {
      throw new AppError('Unauthorized', 401)
    }
    req.user = decode
    next()
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      error.statusCode = 401
      error.message = 'Session expired! please login again'
    }
    if (error.name === 'JsonWebTokenError') {
      error.statusCode = 401
      error.message = 'Unauthorized'
    }
    next(error)
  }
}
