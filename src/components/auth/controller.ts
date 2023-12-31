/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from 'express'
import AppError from '../../utils/appError'
import {
  createOrganization,
  getMemeber,
  getOrganization,
  updateMember,
  updateOrganization,
} from '../auth/service'
import { generateToken } from '../../utils/jwt'

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

export const isExist = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { userName } = req.body
    const isorgExist = await getOrganization({
      $or: [{ userName }],
    })
    const isMemberExist = await getMemeber({
      $or: [{ userName }],
    })
    if (isorgExist || isMemberExist) {
      return res.status(201).json({
        status: 'success',
        message: 'user found',
        isUserExists: true,
      })
    } else {
      return res.status(201).json({
        status: 'success',
        message: 'user not found',
        isUserExists: false,
      })
    }
  } catch (error: any) {
    if (error.isJoi === true) {
      error.statusCode = 422
    }
    next(error)
  }
}
export const update = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    //   validate req.body for register
    const { Bio, userName, profilePic, email } = req.body
    // const data = await registerInput.validateAsync(req.body)
    // check email is already registered?
    const isExist = await getOrganization({
      $or: [{ email }, { userName }],
    })
    const isMemberExist = await getMemeber({
      $or: [{ email }, { userName }],
    })
    let doc: any = null
    if (isExist) {
      doc = await updateOrganization(
        { Bio, userName, profilePic },
        req.user._id
      )
    }
    if (isMemberExist) {
      doc = await updateMember({ Bio, userName, profilePic }, req.user._id)
    }
    return res
      .status(201)
      .json({ status: 'success', message: 'Update success', data: doc })
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
    const { loginCredential, password, isGoogleLogin } = req.body
    let user: any = {}
    const checkForOrganization = await getOrganization({
      $or: [{ email: loginCredential }, { userName: loginCredential }],
    })

    if (checkForOrganization === null) {
      if (isGoogleLogin) {
        throw new AppError('User not found!', 409)
      }
      const checkForMember = await getMemeber({
        $or: [{ email: loginCredential }, { userName: loginCredential }],
      })
      if (checkForMember === null) {
        throw new AppError('User not found!', 409)
      }
      let confirmPassword = false
      if (isGoogleLogin) {
        confirmPassword = false
      } else {
        confirmPassword = await checkForMember.comparePassword(password)
      }
      if (!confirmPassword && !isGoogleLogin) {
        throw new AppError('Please enter valid credentials!', 400)
      }
      user = checkForMember
    } else {
      let confirmPassword = false
      if (isGoogleLogin) {
        confirmPassword = false
      } else {
        confirmPassword = await checkForOrganization.comparePassword(password)
      }
      if (!confirmPassword && !isGoogleLogin) {
        throw new AppError('Please enter valid credentials!', 400)
      }
      user = checkForOrganization
    }
    const token = await generateToken({
      _id: user._id!,
      email: user.email!,
      userName: user.userName!,
      name: user.name!,
      role: user.role!,
      ticketAdministrator: user.ticketAdministrator
        ? user.ticketAdministrator
        : false,
    })
    console.log(user._doc)

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
