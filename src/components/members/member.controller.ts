import { Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import AppError from '../../utils/appError'
import {
  forgotPasswordInput,
  loginInput,
  registerInput,
  resetPasswordInput,
  updateUserInput,
} from '../../helpers/validation'
import {
  createMember,
  findAndUpdate,
  forgotPasswordToken,
  getMemeber,
  getProjectAllusersService,
  getorganizationAllusersService,
  resetPasswordService,
} from './member.service'
import sendEmail from '../../utils/email'
import logger from '../../config/logger'
import { getOrganization } from '../organization/organization.service'
import Organization from '../organization/oragnization.model'
import { handleResponse } from '../../helpers/errorHandler'
export const addMember = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { email, userName } = req.body
    // check for role admin
    if (req.user.role !== 'organization') {
      throw new AppError('You are not authorized to access this route', 400)
    }
    const data = req.body
    data.organizationId = req.user._id
    const isMemberExist = await getMemeber({
      $or: [{ email }, { userName }],
    })
    if (isMemberExist) {
      throw new AppError('Email or user name is already registered', 409)
    }
    // check for organization is created with same
    const isExist = await getOrganization({
      $or: [{ email }, { userName }],
    })
    if (isExist) {
      throw new AppError('Email or user name is already registered', 409)
    }
    const doc = await createMember(data)
    await Organization.findByIdAndUpdate(doc?.organizationId, {
      $push: { members: doc?._id },
    })
    return res
      .status(200)
      .json({ status: 'success', message: 'Member added', data: doc })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.statusCode = 422
    }
    next(error)
  }
}
export const getprojectAllusers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // check for role if there is organization and ticketadminitrator true
    // if (req.user.role !== 'organization') {
    //     throw new AppError('You are not authorized to access this route', 400)
    // }
    const result = await getProjectAllusersService(req.params.project)
    return handleResponse({
      res,
      message: 'successfully fetched all project users',
      data: { ...result },
    })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.statusCode = 422
    }
    next(error)
  }
}
export const getorganizationAllusers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    // check for role if there is organization and ticketadminitrator true
    // if (req.user.role !== 'organization') {
    //     throw new AppError('You are not authorized to access this route', 400)
    // }
    const result = await getorganizationAllusersService(req.params.org)
    return handleResponse({
      res,
      message: 'successfully fetched all organization users',
      data: { ...result },
    })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.statusCode = 422
    }
    next(error)
  }
}

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const _id = req.user._id
    const data = await updateUserInput.validateAsync(req.body)
    const updatedDoc = await findAndUpdate({ _id }, data)
    if (!updatedDoc) {
      throw new AppError('Failed to update user', 400)
    }
    return res.status(200).json({
      status: 'success',
      message: 'updated successfully',
      data: updatedDoc,
    })
  } catch (error: any) {
    if (error.isJoi === true) {
      error.statusCode = 422
    }
    next(error)
  }
}

//======================== forgot password==========================

export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    logger.info('inside forget password controller')
    const { email } = await forgotPasswordInput.validateAsync(req.body)

    const resetToken = await forgotPasswordToken(email)

    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/user/resetPassword/${resetToken}`

    const text = `Forgot your password?\nReset your password here ${resetUrl}\nif you do not forgot your password, Please ignore this email\n your password is only valid for 10 min`

    const mailed = await sendEmail({
      email: email,
      subject: 'forgot password',
      message: text,
    })

    if (!mailed) {
      throw new AppError('failed to send email', 500)
    }
    return res.status(200).json({
      status: 'success',
      message: 'password reset link successfully sent',
    })
  } catch (error: any) {
    next(error)
  }
}

// ===================== reset password ===========================

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { newPassword } = await resetPasswordInput.validateAsync(req.body)
    const token = req.params.token
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
    const reset = await resetPasswordService(passwordResetToken, newPassword)
    if (!reset) {
      throw new AppError('password reset link has been expired! or Invalid')
    }

    return res.status(200).json({
      statau: 'Success',
      message: 'password successfully changed',
    })
  } catch (error) {
    next(error)
  }
}
