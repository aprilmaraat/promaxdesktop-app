export enum MESSAGE_TYPE {
  success = 'success',
  error = 'error',
  warning = 'warning'
}

export enum MESSAGE_TEXT {
  apiError = 'Error accessing the API. Please contact your system administrator.',
  registerSuccess = 'Registration successful! Please login with the details you have registered.',
  serverDown = 'Server is down. Please contact your system administrator.',
  sessionExpired = 'License session expired.',
  invalidLicense = 'Invalid license.',
  syncServiceStopped = 'Sync service has stopped.',
  pleaseWait = 'Please wait.',
  syncthingBooting = 'Syncthing is booting up.',
  emptyLocationError = "Location cannot be empty. Please select location",
}

export enum SPACE_CONFIRM_MESSAGE {
  addConfirm = " space successfully created",
  renameConfirm = " space successfully renamed",
  removeConfirm = " space successfully removed",
  deleteConfirm = " space successfully deleted",
  invalidConfirm = "Invalid confirmation message",
}

export enum IPC {
  SET_WINDOW_SIZE = 'set-window-size',
  REFRESH_CHANGES = 'refresh-changes',
  OPEN_DEV_TOOLS = 'dev-tools-window',
  MINIMIZE_WINDOW = 'minimize-window',
  MAXIMIZE_WINDOW = 'maximize-window',
  CLOSE_WINDOW = 'close-window',
  START_SYNC_SERVICE = 'start-sync-service',
  STOP_SYNC_SERVICE = 'stop-sync-service',
  FEDERATE_SEARCH_NAV = 'federate-search-nav',
  FEDERATE_SEARCH_RESULT = 'federate-search-result',
  SHOW_STOPPED_SYNCTHING = 'show-stopped-syncthing',
  KILL_PIDS = 'kill-pids'
}