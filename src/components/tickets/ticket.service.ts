/* eslint-disable no-useless-catch */
import logger from '../../config/logger'
import Ticket from './ticket.model'
import { TicketInput, comment } from './types'
import mongoose, { PipelineStage } from 'mongoose'
import Project from '../projects/projects.model'
import Comment from './comments.model'
import Reply from './replies.model'

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

export const searchTicketService = async (serachtext: string) => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $match: { $text: { $search: serachtext } },
      },
      {
        $sort: { score: { $meta: 'textScore' } },
      },
    ]
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
    const ticket: any = await Reply.create({ ...data, comment: commentId })
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
    const ticket: any = await Ticket.findByIdAndUpdate(
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
    const comment: any = await Comment.create({ ...data, replies: [] })

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
    // const comment = await Comment.aggregate([
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(ticketId),
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'replies', // Use the name of your reply model's collection
    //       localField: '_id',
    //       foreignField: 'comment',
    //       as: 'replies',
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 1,
    //       text: 1,
    //       author: 1,
    //       orgMember: 1,
    //       createdAt: 1,
    //       replies: {
    //         $map: {
    //           input: '$replies',
    //           as: 'reply',
    //           in: {
    //             _id: '$$reply._id',
    //             text: '$$reply.text',
    //             author: '$$reply.author',
    //             orgMember: '$$reply.orgMember',
    //             createdAt: '$$reply.createdAt',
    //           },
    //         },
    //       },
    //     },
    //   },
    // ])

    // const comment = await Ticket.findById(ticketId).populate({
    //   path: 'comments',
    //   populate: [
    //     {
    //       path: 'author',
    //       model: 'Member',
    //       select: 'userName name profilePic',
    //     },
    //     {
    //       path: 'replies.author',
    //       model: 'Member',
    //       select: 'userName name profilePic',
    //     },
    //   ],
    // })

    // const pipeline = [
    //   {
    //     $match: {
    //       _id: new mongoose.Types.ObjectId(ticketId), // Assuming ticketId is a valid ObjectId
    //     },
    //   },
    // ]
    const comment = await Ticket.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(ticketId),
        },
      },
      {
        $lookup: {
          from: 'comments',
          localField: 'comments',
          foreignField: '_id',
          as: 'comments',
          pipeline: [
            {
              $match: {
                $or: [
                  { author: { $exists: true } },
                  { orgMember: { $exists: true } },
                ],
              },
            },
            {
              $lookup: {
                from: 'members',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
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
                from: 'organizations',
                localField: 'orgMember',
                foreignField: '_id',
                as: 'orgMember',
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
              $unwind: {
                path: '$author',
              },
            },
            {
              $unwind: {
                path: '$orgMember',
                preserveNullAndEmptyArrays: true, // Handle cases where orgMember is missing
              },
            },
            {
              $lookup: {
                from: 'replies',
                localField: '_id',
                foreignField: 'comment',
                as: 'repliesData',
                pipeline: [
                  {
                    $lookup: {
                      from: 'members',
                      localField: 'author',
                      foreignField: '_id',
                      as: 'author',
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
                    $unwind: {
                      path: '$author',
                    },
                  },
                ],
              },
            },
            {
              $sort: {
                createdAt: -1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$comments',
        },
      },
      {
        $group: {
          _id: '$_id',
          comments: { $push: '$comments' },
          totalCommentCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          comments: { $slice: ['$comments', skipCount, pageSize] },
          totalCommentCount: 1,
        },
      },
    ])

    return {
      comments: comment[0]?.comments,
      totalCommentCount: comment[0]?.totalCommentCount,
      currentPage: pageNumber,
      totalPages: Math.ceil(comment[0]?.totalCommentCount / pageSize),
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
  label,
  notshowDone,
  isOrganization,
  currentuserid
) => {
  logger.info('Insite get all ticket service')
  try {
    const condition: any = {}
    if (projectId) {
      condition.projectId = new mongoose.Types.ObjectId(projectId)
    }
    if (search !== '') {
      if (isOrganization) {
        const projects = await Project.find(
          { organizationId: new mongoose.Types.ObjectId(currentuserid) },
          '_id'
        )
        const projectIds = projects.map((ele) => ele._id)
        condition.projectId = { $in: projectIds }
      } else {
        const projects = await Project.find(
          { members: { $in: [new mongoose.Types.ObjectId(currentuserid)] } },
          '_id'
        )
        const projectIds = projects.map((ele) => ele._id)
        condition.projectId = { $in: projectIds }
      }
      condition.$text = { $search: search }
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
    if (notshowDone) {
      condition.status = { $in: ['pending', 'progress'] }
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
    const pipeline: PipelineStage[] = [
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
          comments: 0,
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
    if (search != '') {
      pipeline.push({ $sort: { score: { $meta: 'textScore' } } })
      pipeline.push({
        $limit: 4,
      })
    }
    const list = await Ticket.aggregate(pipeline)
    return { list, count }
  } catch (error) {
    throw error
  }
}
