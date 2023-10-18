// import AppError from '../../utils/appError'
// import { TUser, userInput } from './types'
// import User from './projects.model'

import AppError from '@utils/appError'
import Project from './projects.model'
import { projectTypes } from './types'
import Organization from '@organization/oragnization.model'
import logger from '@config/logger'
import mongoose from 'mongoose'

export const addProjectService = async (
  input: projectTypes
): Promise<projectTypes> => {
  try {
    const isprojectExists = await Project.findOne({ title: input.title })
    if (isprojectExists) {
      throw new AppError('Project already exists with same title!', 400)
    }
    const doc = await Project.create({ ...input })
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

export const getprojectbyuserService = async (userid: any, isForAnalytics) => {
  logger.info('Inside get project service')
  try {
    let data = null
    if (!isForAnalytics) {
      data = await Project.find({
        members: { $in: [userid] },
      })
    } else if (isForAnalytics) {
      data = await Project.aggregate([
        {
          $match: {
            members: {
              $elemMatch: {
                $eq: new mongoose.Types.ObjectId(userid),
              },
            },
          },
        },
        {
          $lookup: {
            from: 'members',
            localField: 'members',
            foreignField: '_id',
            as: 'members',
          },
        },
        {
          $lookup: {
            from: 'tickets',
            let: { projectId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$projectId', '$$projectId'],
                  },
                },
              },
            ],
            as: 'tickets',
          },
        },
        {
          $unwind: {
            path: '$tickets',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            title: { $first: '$title' },
            projectUrl: { $first: '$title' },
            logoUrl: { $first: '$logoUrl' },
            membersCount: { $first: { $size: '$members' } },
            ticketsCount: {
              $sum: {
                $cond: {
                  if: {
                    $ifNull: ['$tickets', null],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            progressCount: {
              $sum: {
                $cond: {
                  if: {
                    $in: [{ $ifNull: ['$tickets.status', null] }, ['progress']],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            todoCount: {
              $sum: {
                $cond: {
                  if: {
                    $in: [{ $ifNull: ['$tickets.status', null] }, ['pending']],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            doneCount: {
              $sum: {
                $cond: {
                  if: {
                    $in: [{ $ifNull: ['$tickets.status', null] }, ['done']],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            updatedAt: { $first: '$updatedAt' },
          },
        },
      ])
    }
    if (!data) {
      throw new AppError('project Does not exists!', 400)
    }
    return data
  } catch (error) {
    logger.error('----', error)
    throw error
  }
}
export const getprojectService = async (projectid: string, count?: boolean) => {
  logger.info('Inside get project service')
  try {
    let data: any
    if (!count) {
      data = await Project.findById(projectid)?.populate([
        {
          path: 'members',
        },
        { path: 'organizationId' },
      ])
    } else {
      data = await Project.findById(projectid).select('ticketsCount')
    }
    if (!data) {
      throw new AppError('project Does not exists!', 400)
    }
    return data
  } catch (error) {
    logger.error('----', error)
    throw error
  }
}

// test api
export const getProjectForAdminService = async () => {
  try {
    const projectDetails = await Project.aggregate([
      {
        $match: {
          organizationId: new mongoose.Types.ObjectId(
            '64cfde3c86ada85aa6c9d816'
          ),
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'members',
          foreignField: '_id',
          as: 'members',
        },
      },
      {
        $lookup: {
          from: 'tickets',
          localField: '_id',
          foreignField: 'projectId',
          as: 'tickets',
        },
      },
      {
        $unwind: '$tickets',
      },
      {
        $group: {
          _id: '$_id',
          title: { $first: '$title' },
          membersCount: { $first: { $size: '$members' } },
          ticketsCount: { $sum: 1 },
          activeCount: {
            $sum: {
              $cond: {
                if: {
                  $in: ['$tickets.status', ['progress', 'active']],
                },
                then: 1,
                else: 0,
              },
            },
          },
          createdAt: { $first: '$createdAt' },
        },
      },
      {
        $sort: {
          membersCount: 1,
        },
      },
    ])
    return projectDetails
  } catch (error) {
    logger.error(' error ----', error)
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
