import logger from '@config/logger'
import Ticket from './ticket.model'
import { TicketInput, comment } from './types'
import mongoose from 'mongoose'
import Project from '@projects/projects.model'

export const createTicketService = async (data: Partial<TicketInput>) => {
  try {
    await Project.findByIdAndUpdate(data.projectId, {
      $inc: { ticketsCount: 1 },
    })
    return await Ticket.create(data)
  } catch (error) {
    throw error
  }
}

export const addReplytocommentService = async (
  data: Partial<comment>,
  ticketId: string,
  commentId: string
) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $addToSet: {
          'comments$[comment].replies': data,
        },
      },
      { new: true, upsert: true, arrayFilters: [{ 'comment._id': commentId }] }
    )
    return ticket?._doc
  } catch (error) {
    throw error
  }
}

export const updateTicketService = async (
  data: Partial<TicketInput>,
  ticketId: string
) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        ...data,
      },
      { new: true, upsert: true }
    )
    return ticket?._doc
  } catch (error) {
    throw error
  }
}
export const createCommentService = async (
  data: Partial<comment>,
  ticketId: string
) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $addToSet: {
          comments: data,
        },
      },
      { new: true, upsert: true }
    )
    return ticket?._doc
  } catch (error) {
    throw error
  }
}

export const getallCommentsService = async (ticketId: string) => {
  try {
    const ticket = await Ticket.findById(ticketId, 'comments')
    return ticket?._doc
  } catch (error) {
    throw error
  }
}

export const getAllTicketService = async (
  offset,
  limit,
  search,
  projectId,
  userId,
  startDate,
  endDate,
  status,
  priority,
  userIds,
  orderBy,
  orderType,
  label
) => {
  logger.info('Insite get all ticket service')
  try {
    const condition: any = {}
    if (projectId) {
      condition.projectId = new mongoose.Types.ObjectId(projectId)
    }
    if (search !== '') {
      condition.$or = [
        { title: { $regex: search, $options: 'i' } },
        { label: { $regex: search, $options: 'i' } },
      ]
    }
    if (userId) {
      condition.assignedTo = new mongoose.Types.ObjectId(userId)
    }
    if (startDate !== '') {
      condition.createdAt = {
        $lte: new Date(new Date(endDate).getTime() + 60 * 60 * 24 * 1000 - 1),
        $gte: new Date(startDate),
      }
    }
    if (status !== '') {
      condition.status = status
    }
    if (label !== '') {
      condition.label = label
    }
    if (priority !== '') {
      condition.priority = priority
    }
    if (userIds.length > 0) {
      condition.assignedTo = {
        $in: userIds,
      }
    }
    const count = await Ticket.countDocuments(condition)
    const pipeline: any = [
      {
        $match: condition,
      },
      {
        $lookup: {
          from: 'members',
          localField: 'assignedTo',
          foreignField: '_id',
          as: 'assignedUser',
        },
      },
      {
        $lookup: {
          from: 'projects',
          localField: 'projectId',
          foreignField: '_id',
          as: 'project',
        },
      },
      {
        $project: {
          comments: 0, // Exclude the "comments" field
        },
      },
      {
        $unwind: '$assignedUser',
      },
      {
        $unwind: '$project',
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
    const list = await Ticket.aggregate(pipeline)
    return { list, count }
  } catch (error) {
    throw error
  }
}
