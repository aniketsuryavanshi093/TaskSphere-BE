import { Document } from 'mongoose'
export interface userInput {
  name: string
  email: string
  password: string
  phoneNo: string
  role?: string
}

export interface TUser extends userInput, Document {
  isDeleted: boolean
  passwordResetToken: string
  passwordResetExpired: Date
  comparePassword: (password: string) => boolean
  createPasswordResetToken: () => string
}
