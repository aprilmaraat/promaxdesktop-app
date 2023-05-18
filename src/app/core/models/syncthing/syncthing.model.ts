export interface SyncServiceResponse {
  Success: boolean;
  Error: boolean | null;
  Data: any[];
}

export interface LocalDrive {
  Name: string;
  AvailableFreeSpace: number;
  DriveFormat: string;
  DriveType: string;
  IsReady: boolean;
  RootDirectory: string;
  TotalFreeSpace: number;
  TotalSize: number;
  VolumeLabel: string;

  SyncSpaces: SyncSpace[];

  // Used in nz-table
  expand: boolean;
  usedProgress: number;
  freeProgress: number;
  driveName: string;
}

export interface SyncSpace {
  Path: string;
  Label: string;
  FolderID: string;
  SyncIPAddress: string | null;
  Paused: boolean;
  Devices: string;
  IPAddress: string;
  ServerName: string;

  SyncStatus: SyncStatus;

  // Used in nz-table
  expand: boolean;
}

export interface SyncStatus {
  GlobalBytes: number;
  GlobalBytesString: string;
  LocalBytesString: string;
  GlobalDeleted: number;
  GlobalDirectories: number;
  GlobalFiles: number;
  LocalBytes: number;
  LocalDeleted: number;
  LocalDirectories: number;
  LocalFiles: number;
  InSyncBytes: number;
  InSyncFiles: number;
  NeedBytes: number;
  NeedFiles: number;
  Invalid: string;
  State: string;
  StateChanged: string;
  Version: number;
  Label: string;
  FolderPath: string;
  SyncdWith: string[];
  ScanPercentage: number;
  Paused: boolean;

  ConnectionStatus: ConnectionStatus;
  SyncdWithDevices: SyncedDevices[]; // Field name typo

  // Used in nz-table
  expand: boolean;
}

export interface ConnectionStatus {
  DownloadInBPS: number;
  UploadInBPS: number;
  PercentComplete: number;
  Status: string;
}

// Temporary data
export interface SyncedDevices {
  deviceID: string;
  name: string;
  addresses: string[];
  compression: string;
  certName: string;
  introducer: boolean;
  skipIntroductionRemovals: boolean;
  introducedBy: string;
  paused: boolean;
  allowedNetworks: [];
  autoAcceptFolders: boolean;
  maxSendKbps: number;
  maxRecvKbps: number;
  ignoredFolders: [];
  pendingFolders: null;
  maxRequestKiB: number;

  DeviceCompletion: DeviceCompletion;
  DeviceConnection: DeviceConnection;

  // Used in nz-table
  expand: boolean;
}

export interface DeviceCompletion {
  DeviceID: string;
  Completion: number;
  GlobalBytes: number;
  NeededBytes: number;
  NeedItems: number;
  NeedDeletes: number;
  RemoteState: any;
  Sequence: number;
  IsPaused: boolean;
  IsUnused: boolean;
  IsInsync: true;
  IsSyncing: boolean;
  IsDisconnected: true;
  IsConnected: boolean;
  StateChanged: any
}

export interface DeviceConnection {
  At: string;
  InBytesTotal: number;
  OutBytesTotal: number;
  InBytesPerSecond: number;
  OutBytesPerSecond: number;
  Address: string;
  ClientVersion: string;
  Connected: boolean;
  Paused: boolean;
  Type: string;
  LastSeen: string;
  Ago: string
}