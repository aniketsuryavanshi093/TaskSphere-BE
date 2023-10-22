import mongoose from 'mongoose'
import { projectTypes } from './types'
import db from '../../connections/masterDB'
const { Schema } = mongoose

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    ticketsCount: { type: Number, default: 0 },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    logoUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        required: false,
        ref: 'Member',
      },
    ],
  },
  {
    timestamps: true,
  }
)

const Project = db.model<projectTypes>('Project', ProjectSchema)
export default Project
