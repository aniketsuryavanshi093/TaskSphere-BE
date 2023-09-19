import mongoose from 'mongoose'

import db from '@connections/masterDB'
import { TicketInterface } from './types'
const { Schema } = mongoose

const TicketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ticketTag: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: true,
      enum: ['BE', 'FE', 'QA'],
    },
    priority: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high'],
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'progress', 'readyForQA', 'done', 'close'],
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    description: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    createdByOrg: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
    updatedBy: {
      type: String,
    },
    attachments: [
      {
        ext: { type: String },
        name: { type: String },
        url: { type: String },
      },
    ],
    commentsCount: { type: Number, default: 0, required: false },
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        author: {
          type: Schema.Types.ObjectId,
          ref: 'Member', // Reference to the user who posted the comment
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
            author: {
              type: Schema.Types.ObjectId,
              ref: 'Member', // Reference to the user who posted the reply
            },
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)
TicketSchema.index({ 'comments.createdAt': 1 })
const Ticket = db.model<TicketInterface>('Ticket', TicketSchema)
export default Ticket
