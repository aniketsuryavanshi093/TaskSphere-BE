import mongoose from 'mongoose'
import db from '../../connections/masterDB'
import { ActivityInterface } from './type'

const { Schema } = mongoose

const activitySchema = new Schema(
  {
    // create update delete assign added
    action: {
      type: String,
      enum: ['create', 'update', 'delete', 'assign', 'added', 'close'],
    },
    // projects member ticket
    type: {
      type: String,
      enum: ['Ticket', 'Member', 'Project'],
    },
    ticketId: {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
    createdByOrg: {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret._v
        delete ret.isDeleted

        return ret
      },
    },
  }
)

const Activity = db.model<ActivityInterface>('Activity', activitySchema)
export default Activity
