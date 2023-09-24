import { Document } from 'mongoose'

export type comment = {
  text: string
  author: string
  createdAt: string
  replies: comment[]
  orgMember: string
}
export type Reply = {
  text: string
  author: string
  createdAt: string
  orgMember: string
  comment: string
}

export interface TicketInput {
  title: string
  label: 'BE' | 'FE' | 'QA'
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'progress' | 'readyForQA' | 'done' | 'close'
  projectId: string
  description: string
  createdBy: string
  createdByOrg: string
  commentsCount: number
  assignedTo: string
  comments: comment[]
  ticketTag: string
  updatedBy: string
  attachments: string[]
}

export interface TicketInterface extends TicketInput, Document {
  isDeleted: boolean
}
export interface CommentInterface extends comment, Document {
  isDeleted: boolean
}
export interface ReplyInterface extends Reply, Document {}
