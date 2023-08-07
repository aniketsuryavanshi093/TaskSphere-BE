import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { organizationInterface } from './types'
import db from '../../connections/masterDB'

const { Schema } = mongoose

const organizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
    },
    isGoogleLogin: {
      type: Boolean,
      default: false,
    },
    passwordResetExpired: Date,
    role: {
      type: String,
      default: 'organization',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password
        delete ret._v
        delete ret.isDeleted
        delete ret.passwordResetToken
        delete ret.passwordResetExpired
        return ret
      },
    },
  }
)

organizationSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const hashPass = await bcrypt.hash(this.password, 12)
    this.password = hashPass
    next()
  }
  next()
})

organizationSchema.methods.comparePassword = async function (password: string) {
  return await bcrypt.compare(password, this.password)
}

// create password reset token
organizationSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  this.passwordResetExpired = Date.now() + 10 * 60 * 1000 // 10 min
  await this.save()
  return resetToken
}
const Organization = db.model<organizationInterface>(
  'Organization',
  organizationSchema
)
export default Organization
