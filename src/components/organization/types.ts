import { Document } from 'mongoose'
export interface organizationInput {
  name: string
  email: string
  password: string
  role?: string
  userName: string
}

export interface organizationInterface extends organizationInput, Document {
  isDeleted: boolean
  passwordResetToken: string
  passwordResetExpired: Date
  comparePassword: (password: string) => boolean
  createPasswordResetToken: () => string
}
