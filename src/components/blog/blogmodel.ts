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
        description: {
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
BlogSchema.index({ slug: 1, })
BlogSchema.index(
    { title: 'text', description: 'text' },
    {
        default_language: 'english', // Specify a language for stemming
        name: 'TextIndex', // Give the index a name
        weights: { title: 3, description: 1 }, // Adjust the weighting of fields
    }
)
const Blog = db.model<bloginterface>('Blog', BlogSchema)

export default Blog
