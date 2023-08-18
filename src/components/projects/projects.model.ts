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
        organizationId: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
        },
        description: {
            type: String,
        },
        members: [{
            type: Schema.Types.ObjectId,
            required: false,
            ref: 'Member',
        }],
    },
    {
        timestamps: true,
    }
)


const Project = db.model<projectTypes>('Project', ProjectSchema)
export default Project