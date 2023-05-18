export enum TOKENAUTH {
  BASE = '/TokenAuth',
  AUTHENTICATE = '/Authenticate',
  EXTERNAL_AUTHENTICATE = '/ExtenralAuthenticate'
}

export enum ACCOUNT {
  BASE = '/services/app/Account',
  REGISTER = '/PromaxRegister',
  IS_TENANT_AVAILABLE = '/IsTenantAvailable',
}

export enum COUNTRIES {
  BASE = '/services/app/Countries',
  GET_ALL_COUNTRIES = '/GetAllCountries'
}

export enum LICENSE {
  BASE = '/License',
  PING = '/Ping'
}

export enum ORGANIZATION {
  BASE = '/services/app/Organization',
  UPDATE = '/Update',
  GET = '/Get',
  GETALL = '/GetAll',
  CREATE = '/Create',
  DELETE = '/Delete'
}

export enum SYNC_SERVICE {
  BASE = '/PromaxDesktopSyncService',
  KILL_PIDS = '/KillPids',
  GET_DRIVES_AND_SYNC_FOLDERS = '/GetDrivesAndSyncFolders',
  // Test API's
  GET_DEVICE_AND_SHARES = '/GetDeviceAndShares',
  GET_FOLDERS = '/GetFolders',  
  ADD_SYNC_FOLDER = '/AddSyncFolder',
  RENAME_SYNC_FOLDER = '/RenameSyncFolder',
  REMOVE_SYNC_FOLDER = '/DeleteFolder',
  DELETE_LOCAL_FOLDER = '/DeleteLocalFolder',
}