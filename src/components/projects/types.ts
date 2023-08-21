import { memberInput } from '@members/types'
import { Document } from 'mongoose'
export interface projectTypes extends Document {
  title: string
  members: memberInput[]
  description: string
  tasks: any
  logoUrl: string
  organizationId: string
}
