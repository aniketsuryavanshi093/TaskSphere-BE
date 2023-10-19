export interface ActivityInterface extends Document {
  activity: 'create' | 'update' | 'delete' | 'assign' | 'added' | 'close'
  type: 'Ticket' | 'Member' | 'Project'
  projectId?: string
  createdBy?: string
  createdByOrg?: string
  assignedTo?: string
}
