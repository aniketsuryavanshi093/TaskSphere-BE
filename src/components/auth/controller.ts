import { Request, Response, NextFunction } from 'express'
import AppError from '../../utils/appError'
import { createOrganization, getMemeber, getOrganization } from '@auth/service'
import { generateToken } from '@utils/jwt'

export const registerOrganization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    //   validate req.body for register
    const { email, userName } = req.body
    // const data = await registerInput.validateAsync(req.body)
    // check email is already registered?
    const isExist = await getOrganization({
      $or: [{ email }, { userName }],
    })
    if (isExist) {
      throw new AppError('Email is already registered', 409)
    }
    const isMemberExist = await getMemeber({
      $or: [{ email }, { userName }],
    })
    if (isMemberExist) {
      throw new AppError('Email is already registered', 409)
    }

    const doc = await createOrganization(req.body)
    return res
      .status(201)
      .json({ status: 'success', message: 'Registration success', data: doc })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.statusCode = 422
    }
    next(error)
  }
}

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { loginCredential, password } = req.body
    let user: any = {}
    const checkForOrganization = await getOrganization({
      $or: [{ email: loginCredential }, { userName: loginCredential }],
    })
    if (checkForOrganization === null) {
      const checkForMember = await getMemeber({
        $or: [{ email: loginCredential }, { userName: loginCredential }],
      })
      if (checkForMember === null) {
        throw new AppError('Invalid credentials', 409)
      }
      const isValid = await checkForMember.comparePassword(password)

      if (!isValid) {
        throw new AppError('Incorrect password', 400)
      }
      user = checkForMember
    } else {
      const isValid = await checkForOrganization.comparePassword(password)

      if (!isValid) {
        throw new AppError('Incorrect password', 400)
      }
      user = checkForOrganization
    }
    const token = await generateToken({
      _id: user._id!,
      email: user.email!,
      userName: user.userName!,
      name: user.name!,
      role: user.role!,
    })
    delete user._doc.password
    delete user._doc.__v
    delete user._doc.isDeleted
    delete user._doc.passwordResetToken
    delete user._doc.passwordResetExpired
    return res.status(200).json({
      status: 'success',
      message: 'Login success',
      data: { ...user._doc, authToken: token },
    })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.statusCode = 422
    }
    next(error)
  }
}
