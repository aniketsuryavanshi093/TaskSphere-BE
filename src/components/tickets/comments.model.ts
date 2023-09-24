import mongoose from 'mongoose'

import db from '@connections/masterDB'
import { CommentInterface } from './types'
const { Schema } = mongoose

const CommentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
    orgMember: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    replies: [
      {
        text: {
          type: String,
          required: true,
        },
        orgMember: {
          type: Schema.Types.ObjectId,
          ref: 'Organization',
        },
        author: {
          type: Schema.Types.ObjectId,
          ref: 'Member',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

CommentSchema.pre(/^find/, function (next) {
  //   this.populate('replies.author', 'userName name profilePic')
  this.populate({
    path: 'replies.author',
    model: 'Member',
    select: 'userName name profilePic',
  })
  next()
})
const Comment = db.model<CommentInterface>('Comment', CommentSchema)

export default Comment
