// import AppError from '../../utils/appError'
// import { TUser, userInput } from './types'
// import User from './projects.model'

import AppError from '@utils/appError'
import Project from './projects.model'
import { projectTypes } from './types'
import Organization from '@organization/oragnization.model'
import { Schema } from 'mongoose'
import logger from '@config/logger'

export const addProjectService = async (
  input: projectTypes
): Promise<projectTypes> => {
  try {
    const isprojectExists = await Project.findOne({ title: input.title })
    if (isprojectExists) {
      throw new AppError('Project already exists with same title!', 400)
    }
    const doc = await Project.create(input)
    await Organization.findByIdAndUpdate(input.organizationId, {
      $push: {
        projects: doc,
      },
    })
    return doc._doc
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

export const addMembertoProjectService = async (
  memberId: string,
  projectId: string
): Promise<projectTypes> => {
  try {
    const response = await Project.findByIdAndUpdate(
      projectId,
      {
        $addToSet: {
          members: memberId,
        },
      },
      { new: true }
    )
    if (!response) {
      throw new AppError('project Does not exists!', 400)
    }
    return response?._doc
  } catch (error: any) {
    throw new AppError(error, 400)
  }
}

export const getProjectService = async (query: any) => {
  logger.info('Inside get project service')
  try {
    const data = await Project.findOne(query).populate('members')
    return data
  } catch (error) {
    logger.error('----', error)
    throw error
  }
}

export const getprojectbyuserService = async (userid: any) => {
  logger.info('Inside get project service')
  try {
    const data = await Project.find({
      members: { $in: [userid] },
    })
    if (!data) {
      throw new AppError('project Does not exists!', 400)
    }
    return data
  } catch (error) {
    logger.error('----', error)
    throw error
  }
}


// export const findAndUpdate = async (
//   filter: any,
//   data: Partial<userInput>
// ): Promise<TUser | boolean> => {
//   try {
//     const doc = await User.findOne(filter)
//     doc.set(data)
//     const newdoc = await doc.save()
//     return newdoc
//   } catch (error) {
//     throw new AppError(error)
//   }
// }

// export const findAndDelete = async (data: any) => {
//   try {
//     data.isDeleted = false
//     const doc = await User.findOne(data, 'isDeleted')
//     if (!doc) {
//       return false
//     }
//     doc.isDeleted = true
//     const newDoc = await doc.save()
//     return newDoc ? true : false
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

// //=============================== forgot password service =======================================
// export const forgotPasswordToken = async (email: string): Promise<string> => {
//   try {
//     const user = await User.findOne({ email })
//     if (!user) {
//       throw new AppError('invalid email', 400)
//     }
//     const resetToken = await user.createPasswordResetToken()
//     return resetToken
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }

// // password reset service
// export const resetPasswordService = async (
//   passwordResetToken: string,
//   newPassword: string
// ): Promise<boolean> => {
//   try {
//     const user = await User.findOne(
//       {
//         passwordResetToken,
//         passwordResetExpired: { $gt: Date.now() },
//       },
//       'phone email password passwordResetToken passwordResetExpired'
//     )

//     if (!user) {
//       return false
//     }

//     user.password = newPassword
//     user.passwordResetToken = undefined
//     user.passwordResetExpired = undefined
//     const doc = await user.save()
//     return doc ? true : false
//   } catch (error) {
//     throw new AppError(error, 400)
//   }
// }
