import mongoose from 'mongoose'

import db from '@connections/masterDB'
import { CommentInterface, ReplyInterface } from './types'
const { Schema } = mongoose

const ReplySchema = new Schema(
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
    comment: {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  {
    timestamps: true,
  }
)

const Reply = db.model<ReplyInterface>('Reply', ReplySchema)

export default Reply
