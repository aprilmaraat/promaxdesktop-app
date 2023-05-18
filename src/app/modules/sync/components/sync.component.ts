import { ChangeDetectorRef, Component, SimpleChanges } from '@angular/core';
import { GenericComponent } from 'src/app/shared/components/generic.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SyncService } from 'src/app/core/services/sync-service/sync.service';
import { IPC, MESSAGE_TEXT, MESSAGE_TYPE, SPACE_CONFIRM_MESSAGE } from 'src/app/shared/constants/helper.constants';
import { LocalDrive, SyncedDevices, SyncSpace } from 'src/app/core/models/syncthing/syncthing.model';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DEFAULT_DATA, FORM_LABELS, SOS_TRANSACTION } from 'src/app/shared/constants/form.constants';
import { dialog, shell } from 'electron';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss']
})

export class SyncComponent extends GenericComponent {
  _shell!: typeof shell;
  _dialog!: typeof dialog;
  getLocalDrivesSub!: Subscription;

  textAlign: 'center' | 'left' | 'right' | null = 'center';
  selectedRowIndex: string = '';
  selectedSpaceData = {
    Label: '',
    FolderID: '',
    Path: '',
    DeviceID: '',
    SyncStatus: {
      SyncdWith: []
    }
  }

  testData: string = '';
  tplModalButtonLoading = false;
  showAddSyncSpace: boolean = false;
  showRenameNote: boolean = true;
  newSyncSpacePath: string = '';
  newSyncSpaceName?: string;
  syncSpaceTitle: string = SOS_TRANSACTION.addAction;
  syncAction: string = SOS_TRANSACTION.addAction;
  syncActionLabel: string = DEFAULT_DATA.defaultSyncActionLabel;
  uploading = false;
  fileList: NzUploadFile[] = [];
  selectedDrive = DEFAULT_DATA.defaultSelectedDrive;
  confirmDeleteText: string = '';
  value: string = '';
  searchText: string = '';
  localDrives: LocalDrive[] = [];
  filteredDrives: LocalDrive[] = [];

  constructor(private syncService: SyncService,
    private cdr: ChangeDetectorRef,
    message: NzMessageService,
    modal: NzModalService) {
    super(message, modal);
    this._shell = window.require('electron').shell;
    this._dialog = window.require('electron').dialog;
  }

  override ngOnInit(): void {
    this.generalLoading = true;
    setTimeout(() => {
      this.loadData(false);
    }, 8000);
    
    this.ipcRenderer.on(IPC.FEDERATE_SEARCH_RESULT, (event, args) => {
      this.generalLoading = true;
      this.searchText = args;
      if(this.isNonEmptyString(this.searchText)) {
        this.loadData(true);
      } else {
        this.loadData(false);
      }
    });

    this.ipcRenderer.on('file', (event, file) => {
      this.newSyncSpacePath = file;
    });
  }

  loadData(filter: boolean) {
    this.generalLoading = true;
    
    this.getLocalDrivesSub = this.syncService.getLocalDrives().subscribe({
      next: response => {
        this.generalLoading = false;
        if (response.Success) {
          this.localDrives = this.localDriveData(response.Data);
          this.filteredDrives = [];
          if(filter) {
            this.filteredDrives = this.filterLocalDrives(this.localDrives, this.searchText);
          } else {
            this.filteredDrives = this.localDrives;
          }
          this.getLocalDrivesSub.unsubscribe();
        }
      },
      error: response => {
        this.message.create(MESSAGE_TYPE.warning, MESSAGE_TEXT.pleaseWait + ' ' + MESSAGE_TEXT.syncthingBooting);
        this.getLocalDrivesSub.unsubscribe();
        this.loadData(false);
      }
    });
  }

  reloadTable() {
    this.loadData(false);
  }

  filterLocalDrives(drives: LocalDrive[], searchTerm: string): LocalDrive[] {
    return drives.filter(drive => {
      if (drive.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drive.VolumeLabel.toLowerCase().includes(searchTerm.toLowerCase())) {
        if (drive.SyncSpaces) {
          drive.SyncSpaces = this.filterSyncSpaces(drive.SyncSpaces, searchTerm);
          drive.expand = drive.SyncSpaces.length > 0;
        } else {
          drive.expand = false;
        }
        return true;
      } else if (drive.SyncSpaces) {
        drive.SyncSpaces = this.filterSyncSpaces(drive.SyncSpaces, searchTerm);
        drive.expand = drive.SyncSpaces.length > 0;
        return drive.SyncSpaces.length > 0;
      }
      return false;
    });
  }

  filterSyncSpaces(spaces: SyncSpace[], searchTerm: string): SyncSpace[] {
    return spaces.filter(space => {
      if (space.Label.toLowerCase().includes(searchTerm.toLowerCase())) {
        if (space.SyncStatus.SyncdWithDevices) {
          space.SyncStatus.SyncdWithDevices = 
            this.filterSyncedDevices(space.SyncStatus.SyncdWithDevices, searchTerm);
          space.expand = space.SyncStatus.SyncdWithDevices.length > 0;
        } else {
          space.SyncStatus.expand = false;
        }
        return true;
      } else if (space.SyncStatus.SyncdWithDevices) {
        space.SyncStatus.SyncdWithDevices = this.filterSyncedDevices(space.SyncStatus.SyncdWithDevices, searchTerm);
        space.expand = space.SyncStatus.SyncdWithDevices.length > 0;
        return space.SyncStatus.SyncdWithDevices.length > 0;
      }
      return false;
    });
  }

  filterSyncedDevices(devices: SyncedDevices[], searchTerm: string): SyncedDevices[] {
    return devices.filter(device => device.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  highlightRow(indexX: any, indexI: any, indexY: any) {
    this.selectedRowIndex = indexX + '' + indexI + '' + indexY;
  }

  localDriveData(data: any[]): LocalDrive[] {
    const returnData: LocalDrive[] = data;
    returnData.forEach(item => {
      item.driveName = `(${item.Name}) ${item.VolumeLabel}`;
      item.expand = false;
      item.SyncSpaces.forEach(space => {
        space.expand = false;
        space.SyncStatus.expand = true;
      });
      item.usedProgress = 100 - Math.round(((item.TotalFreeSpace / item.TotalSize) * 100));
    });
    return returnData;
  }

  openSyncSpace(location: any) {
    this._shell.openPath(location)
  }

  showSyncSpaceModal(data: any, defaultDrive: any): void {
    this.syncAction = data;

    if (this.syncAction == SOS_TRANSACTION.addAction) {
      this.selectedDrive = defaultDrive;
      this.syncSpaceTitle = SOS_TRANSACTION.addSyncSpaceTitle;
    }
    else if (this.syncAction == SOS_TRANSACTION.renameAction) {
      this.syncActionLabel = FORM_LABELS.syncActionLabel
      this.syncSpaceTitle = SOS_TRANSACTION.renameSyncSpaceTitle;
      this.showRenameNote = false;
    }
    this.showAddSyncSpace = true;
  }

  handleSyncSpaceOk(): void {
    var data = {};
    if (this.newSyncSpacePath.slice(-1) != "\\") {
      if (this.newSyncSpacePath.length > 1) {
        this.newSyncSpacePath += "\\";
      }
    }

    if (this.syncAction == SOS_TRANSACTION.addAction) {
      if (this.newSyncSpacePath != "") {
        data = { syncSpacePath: this.newSyncSpacePath + this.newSyncSpaceName + "\\", syncSpaceLabel: this.newSyncSpaceName };
      }
      else {
        this.message.create(MESSAGE_TYPE.error, MESSAGE_TEXT.emptyLocationError);
        return;
      }
    }
    else if (this.syncAction == SOS_TRANSACTION.renameAction) {
      var tmpPath = this.selectedSpaceData.Path;
      var splitPath = tmpPath.split("\\");

      if (splitPath.length > 1) {
        splitPath = splitPath.slice(0, splitPath.length - 2);
      }

      var location = splitPath.join("\\") + "\\";
      data = { folderID: this.selectedSpaceData.FolderID, newName: this.newSyncSpaceName, newPath: location + this.newSyncSpaceName + "\\" };
    }
    else if (this.syncAction == SOS_TRANSACTION.removeAction) {
      data = { folderID: this.selectedSpaceData.FolderID };
    }
    else if (this.syncAction == SOS_TRANSACTION.deleteAction) {
      data = { folderID: this.selectedSpaceData.FolderID, path: this.selectedSpaceData.Path };
    }
    this.syncService.postSyncService(this.syncAction, data).subscribe({
      next: response => {
        this.generalLoading = false;
        if (response.Success) {
          this.confirmMessage();
          this.resetModal();
          this.loadData(false);
        }
      },
      error: response => {
        this.message.create(MESSAGE_TYPE.warning, MESSAGE_TEXT.pleaseWait + ' ' + MESSAGE_TEXT.syncthingBooting);
        this.resetModal();
        this.loadData(false);
      }
    },);
  }

  handleSyncSpaceCancel(): void {
    this.resetModal();
  }

  resetModal() {
    this.syncSpaceTitle = SOS_TRANSACTION.addSyncSpaceTitle;
    this.newSyncSpacePath = '';
    this.newSyncSpaceName = '';
    this.showAddSyncSpace = false;
    this.showRenameNote = true;
    this.confirmDeleteText = '';
  }

  showConfirm(data: any, content: any): void {
    this.syncAction = data;

    if (this.syncAction == SOS_TRANSACTION.deleteAction) {
      this.modal.confirm({
        nzTitle: '<i>Type "' + SOS_TRANSACTION.deleteAction + '" to confirm deletion of ' + this.selectedSpaceData.Label + ' space?</i>',
        nzContent: content,//'<p><input nz-input/>asdfad</p>',
        nzOkText: 'Confirm',
        nzCancelText: 'Cancel',
        nzOnOk: () => {

          if (this.confirmDeleteText == SOS_TRANSACTION.confirmDeleteText) {
            this.modal.confirm({
              nzTitle: '<i>Are you sure you want to ' + this.syncAction.toLowerCase() + ' ' + this.selectedSpaceData.Label + ' space?</i>',
              nzContent: '',
              nzOkText: 'Yes',
              nzCancelText: 'No',
              nzOnOk: () => {
                this.handleSyncSpaceOk()
              },
            });
          }
          else {
            this.message.create(MESSAGE_TYPE.error, SPACE_CONFIRM_MESSAGE.invalidConfirm);
            this.confirmDeleteText = '';
          }

        },
        nzOnCancel: () => {
          this.confirmDeleteText = '';
        }
      });
    }
    else if (this.syncAction == SOS_TRANSACTION.removeAction) {
      this.modal.confirm({
        nzTitle: '<i>Are you sure you want to ' + this.syncAction.toLowerCase() + ' ' + this.selectedSpaceData.Label + ' space?</i>',
        nzOkText: 'Yes',
        nzCancelText: 'No',
        nzOnOk: () => this.handleSyncSpaceOk(),
      });
    }
  }

  confirmMessage() {
    if (this.syncAction == SOS_TRANSACTION.addAction) {
      this.message.create(MESSAGE_TYPE.success, this.newSyncSpaceName + SPACE_CONFIRM_MESSAGE.addConfirm);
    }
    else if (this.syncAction == SOS_TRANSACTION.renameAction) {
      this.message.create(MESSAGE_TYPE.success, this.newSyncSpaceName + SPACE_CONFIRM_MESSAGE.renameConfirm);
    }
    else if (this.syncAction == SOS_TRANSACTION.removeAction) {
      this.message.create(MESSAGE_TYPE.success, this.selectedSpaceData.Label + SPACE_CONFIRM_MESSAGE.removeConfirm);
    }
    else if (this.syncAction == SOS_TRANSACTION.deleteAction) {
      this.message.create(MESSAGE_TYPE.success, this.selectedSpaceData.Label + SPACE_CONFIRM_MESSAGE.deleteConfirm);
    }
  }

  selectFolderPath() {
    this.ipcRenderer.send('file-request', { defaultDrive: this.selectedDrive });
  }

  selectedRow(data: any) {
    this.selectedSpaceData = data;
  }

  override ngOnDestroy(): void {
    if(this.getLocalDrivesSub !== undefined) {
      this.getLocalDrivesSub.unsubscribe();
    }
  }

}

