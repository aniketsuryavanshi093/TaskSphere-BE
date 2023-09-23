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
            ref: 'Member',
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
                    ref: 'Member',
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

const Comment = db.model<CommentInterface>('Comment', CommentSchema)

export default Comment
