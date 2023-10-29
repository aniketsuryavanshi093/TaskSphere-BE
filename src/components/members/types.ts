import { Document } from 'mongoose'
export interface memberInput {
  name: string
  email: string
  password: string
  role?: string
  userName: string
  ticketAdministrator: boolean
  organizationId: string
}

export interface MemberInterface extends memberInput, Document {
  isDeleted: boolean
  passwordResetToken: string
  passwordResetExpired: Date
  comparePassword: (password: string) => boolean
  createPasswordResetToken: () => string
}
