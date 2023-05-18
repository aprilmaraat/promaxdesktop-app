export enum LOGIN_PLACEHOLDER {
  email = 'Enter your email',
  password = 'Enter you password'
}

export enum LOGIN_ERROR_TIP {
  email = 'Please input your email!',
  password = 'Please input your Password!'
}

export const REGISTER_STEPS = [
  { description: 'Create Account' },
  { description: 'Provide Contact Information' },
  { description: 'EULA' },
]

// Add more values if there are more steps needed
export enum STEPS_STAGES {
  inProgress = 'In Progress',
  completed = 'Completed',
  waiting = 'Waiting',
}

export enum FORM_LABELS {
  signIn = 'Sign In',
  syncActionLabel = "New Sync Space Name"
}

export enum FORM_PLACEHOLDERS {
  search = 'Search'
}

export enum DEFAULT_DATA {
  defaultSyncAction = "Add",
  defaultSyncActionLabel = "Sync Space Name",
  defaultSelectedDrive = "C:\\"
}

export enum SOS_TRANSACTION {
  addAction = "Add",
  renameAction = "Rename",
  removeAction = "Remove",
  deleteAction = "Delete",
  confirmDeleteText = "DELETE",
  addSyncSpaceTitle = "Add New Sync Space",
  renameSyncSpaceTitle = "Rename Sync Space",
  //defaultSyncSpaceTitle = "Add New Sync Space",

}