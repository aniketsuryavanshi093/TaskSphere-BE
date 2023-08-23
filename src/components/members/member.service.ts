import AppError from '@utils/appError'
import { MemberInterface, memberInput } from './types'
import Member from '@members/member.model'
import Project from '@projects/projects.model'
import { projectTypes } from '@projects/types'
import Organization from '@organization/oragnization.model'

export const createMember = async (
  input: memberInput
): Promise<MemberInterface | null> => {
  const doc = await Member.create(input)
  return doc
}

export const getMemeber = async (
  filter: any
): Promise<MemberInterface | null> => {
  try {
    filter.isDeleted = false
    const doc = await Member.findOne(filter)
    return doc
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

export const findAndUpdate = async (
  filter: any,
  data: Partial<memberInput>
): Promise<MemberInterface | boolean> => {
  try {
    const doc = await Member.findOne(filter)
    if (doc === null) {
      throw new AppError('user not found', 400)
    }
    doc.set(data)
    const newdoc = await doc.save()
    return newdoc
  } catch (error: any) {
    throw new AppError(error)
  }
}

export const findAndDelete = async (data: any) => {
  try {
    data.isDeleted = false
    const doc = await Member.findOne(data, 'isDeleted')
    if (!doc) {
      return false
    }
    doc.isDeleted = true
    const newDoc = await doc.save()
    return newDoc ? true : false
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

//=============================== forgot password service =======================================
export const forgotPasswordToken = async (email: string): Promise<string> => {
  try {
    const user = await Member.findOne({ email })
    if (!user) {
      throw new AppError('invalid email', 400)
    }
    const resetToken = await user.createPasswordResetToken()
    return resetToken
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

// password reset service
export const resetPasswordService = async (
  passwordResetToken: string,
  newPassword: string
): Promise<boolean> => {
  try {
    const user = await Member.findOne(
      {
        passwordResetToken,
        passwordResetExpired: { $gt: Date.now() },
      },
      'phone email password passwordResetToken passwordResetExpired'
    )

    if (!user) {
      return false
    }

    user.password = newPassword
    user.passwordResetToken = null!
    user.passwordResetExpired = null!
    const doc = await user.save()
    return doc ? true : false
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

export const getProjectAllusersService = async (projectId: string): Promise<projectTypes> => {
  try {
    const response = await Project.findById(projectId)
      .populate({
        path: 'members',
      })
      .select('members')
    if (response === null || response === undefined) {
      throw new AppError('project Does not exists!', 400)
    }
    return response?._doc
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}
export const getorganizationAllusersService = async (orgId: string): Promise<projectTypes> => {
  try {
    const response = await Organization.findById(orgId)
      .populate({
        path: 'members',
      })
      .select('members')
    if (response === null || response === undefined) {
      throw new AppError('Organization Does not exists!', 400)
    }
    return response?._doc
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}