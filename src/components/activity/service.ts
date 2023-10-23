import logger from '@config/logger'
import { ActivityInterface } from './type'
import Activity from './model'
import mongoose from 'mongoose'
import Project from '@projects/projects.model'

export const createActivity = async (payload) => {
  logger.info('inside get activity service')
  try {
    const data = await Activity.create(payload)
    return data
  } catch (error) {
    throw error
  }
}

export const getAllActivityService = async (
  userId: string,
  offset: number,
  limit: number,
  projectId: string | null,
  startDate: string,
  endDate: string,
  type: string,
  action: string,
  orderBy: string,
  orderType: number,
  isOrganization: boolean
) => {
  logger.info('Insite get all ticket service')
  try {
    const condition: any = {}

    if (projectId) {
      condition.projectId = new mongoose.Types.ObjectId(projectId)
    } else {
      if (isOrganization) {
        const projects = await Project.find(
          { organizationId: new mongoose.Types.ObjectId(userId) },
          '_id'
        )

        const projectIds = projects.map((ele) => ele._id)
        condition.projectId = { projectId: { $in: projectIds } }
      } else {
        const projects = await Project.find(
          { members: { $in: [new mongoose.Types.ObjectId(userId)] } },
          '_id'
        )

        const projectIds = projects.map((ele) => ele._id)
        condition.projectId = { $in: projectIds }
      }
    }

    if (startDate !== '') {
      condition.createdAt = {
        $lte: new Date(new Date(endDate).getTime() + 60 * 60 * 24 * 1000 - 1),
        $gte: new Date(startDate),
      }
    }
    if (type !== '') {
      condition.type = type
    }

    if (action !== '') {
      condition.action = action
    }
    const count = await Activity.countDocuments(condition)
    const pipeline: any = [
      {
        $match: condition,
      },
      {
        $lookup: {
          from: 'members',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignedTo',
          pipeline: [
            {
              $project: {
                name: 1,
                userName: 1,
                email: 1,
                profilePic: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'projectData',
          pipeline: [
            {
              $project: {
                title: 1,
                description: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'members',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdByData',
          pipeline: [
            {
              $project: {
                name: 1,
                userName: 1,
                profilePic: 1,
                email: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'organizations',
          localField: 'createdByOrg',
          foreignField: '_id',
          as: 'createdByOrgData',
        },
      },
      {
        $lookup: {
          from: 'tickets',
          localField: 'ticketId',
          foreignField: '_id',
          as: 'ticketdata',
          pipeline: [
            {
              $project: {
                title: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$assignedTo',
          preserveNullAndEmptyArrays: true, // Exclude null values
        },
      },
      {
        $unwind: {
          path: '$projectData',
          preserveNullAndEmptyArrays: true, // Exclude null values
        },
      },
      {
        $unwind: {
          path: '$createdByData',
          preserveNullAndEmptyArrays: true, // Exclude null values
        },
      },
      {
        $unwind: {
          path: '$createdByOrgData',
          preserveNullAndEmptyArrays: true, // Exclude null values
        },
      },
      {
        $unwind: {
          path: '$ticketdata',
          preserveNullAndEmptyArrays: true, // Exclude null values
        },
      },
      {
        $group: {
          _id: '$_id',
          action: { $first: '$action' },
          type: { $first: '$type' },
          projectId: { $first: '$projectId' },
          createdBy: { $first: '$createdBy' },
          createdByOrg: { $first: '$createdByOrg' },
          assignedTo: { $first: '$assignedTo' },
          ticketData: {
            $first: '$ticketdata',
          },
          projectData: { $first: '$projectData' },
          createdByOrgData: { $first: '$createdByOrgData' },
          createdAt: { $first: '$createdAt' },
          createdByData: { $first: '$createdByData' },
        },
      },
      {
        $sort: {
          [orderBy]: orderType,
        },
      },
    ]
    if (offset > 0) {
      pipeline.push({
        $skip: offset,
      })
    }
    if (limit > 0) {
      pipeline.push({
        $limit: limit,
      })
    }
    const list = await Activity.aggregate(pipeline)
    return { list, count }
  } catch (error) {
    throw error
  }
}
