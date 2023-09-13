import { Document } from 'mongoose'
export interface TicketInput {
  title: string
  label: 'BE' | 'FE' | 'QA'
  priority: 'low' | 'medium' | 'high'
  status: 'pending' | 'progress' | 'readyForQA' | 'done' | 'close'
  projectId: string
  description: string
  createdBy: string
  createdByOrg: string
  assignedTo: string
  ticketTag: string
  updatedBy: string
  attachments: string[]
}

export interface TicketInterface extends TicketInput, Document {
  isDeleted: boolean
}
