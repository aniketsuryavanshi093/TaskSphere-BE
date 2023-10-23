import mongoose from 'mongoose'
import db from '../../connections/masterDB'
import { bloginterface } from './type'

const { Schema } = mongoose

const BlogSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
        },
        previewImage: {
            type: String,
            required: false,
        },
        content: {
            type: String,
            required: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'Organization',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)
const Blog = db.model<bloginterface>('Blog', BlogSchema)
export default Blog
