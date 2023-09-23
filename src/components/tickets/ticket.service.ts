import logger from '@config/logger'
import Ticket from './ticket.model'
import { TicketInput, comment } from './types'
import mongoose from 'mongoose'
import Project from '@projects/projects.model'
import Comment from './comments.model'

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
    const ticket = await Comment.findByIdAndUpdate(
      commentId,
      {
        $addToSet: {
          replies: data,
        },
        $inc: { commentsCount: 1 },
      },
      { new: true, upsert: true }
    )
    await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $inc: { commentsCount: 1 },
      },
      { new: true }
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
    const ticket = await Ticket.findOneAndUpdate(
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
  data: Partial<TicketInput>,
  ticketId: string
) => {
  try {
    // Create a new Comment document
    const comment = await Comment.create({ ...data, replies: [] })
    console.log(comment)

    // Find and update the corresponding Ticket document
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId,
      {
        $inc: { commentsCount: 1 },
        $addToSet: {
          comments: new mongoose.Types.ObjectId(comment?._doc?._id),
        }, // Add the comment's ID to the Ticket's comments array
      },
      { new: true }
    )

    if (!updatedTicket) {
      // Handle the case where the ticket is not found
      return null
    }

    return comment
  } catch (error) {
    throw error
  }
}

export const getPaginatedCommentsService = async (
  ticketId: string,
  pageNumber: number,
  pageSize: number
) => {
  try {
    const skipCount = (pageNumber - 1) * pageSize

    // Use aggregation to retrieve paginated comments and total comment count
    const result = await Ticket.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(ticketId) } },
      {
        $project: {
          comments: 1,
          totalCommentCount: { $size: '$comments' },
        },
      },
      {
        $project: {
          totalCommentCount: 1,
          comments: {
            $slice: ['$comments', skipCount, pageSize],
          },
        },
      },
    ])

    if (!result || result.length === 0) {
      // Handle the case where the ticket is not found
      return null
    }
    const { comments, totalCommentCount } = result[0]
    return {
      comments,
      totalCommentCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalCommentCount / pageSize),
      itemsPerPage: pageSize,
    }
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
