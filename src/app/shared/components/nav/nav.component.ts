import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericComponent } from '../generic.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HeartbeatService } from 'src/app/core/services/heartbeat.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SyncService } from 'src/app/core/services/sync-service/sync.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FORM_PLACEHOLDERS } from '../../constants/form.constants';
import { IPC, MESSAGE_TYPE } from '../../constants/helper.constants';

@Component({
  selector: 'sos-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent extends GenericComponent {
  @Input() showKillPids: boolean = false;
  @Output() searchOutput: EventEmitter<string>  = new EventEmitter<string>();
  isCollapsed = false;
  searchPlaceholder = FORM_PLACEHOLDERS.search;
  currentName: string = '';
  searchKeyword: string = '';
  showErrorKillPids: boolean = false;
  syncServiceStopped: boolean = false;
  // Used so that error alert won't show again.
  showAgain: boolean = true;

  constructor(public authService: AuthService,
    private heartbeatService: HeartbeatService,
    private syncService: SyncService,
    message: NzMessageService,
    modal: NzModalService) { 
    super(message, modal);
    this.ipcRenderer.send(IPC.START_SYNC_SERVICE);
    this.currentName = this.authService.currentUserValue.user.name;
    this.showMessage(MESSAGE_TYPE.success, `Welcome ${this.currentName}!`);
    this.heartbeatService.startHeartbeat();
    this.windowsSize = {width: 1300, height: 800};
    this.showKillPids = false;
  }

  override ngOnInit(): void {
    this.ipcRenderer.on(IPC.SHOW_STOPPED_SYNCTHING, (event, args) => {
      if(this.showAgain) {
        this.syncServiceStopped = args;
      }
      if(args === true) {
        this.showAgain = false;
      } else{
        this.showAgain = true;
      }
    });
    this.setWindowSize();
  }

  search(keyword: string) {
    this.ipcRenderer.send(IPC.FEDERATE_SEARCH_NAV, keyword);
  }
  logout() {
    this.showKillPids = true;
    this.syncService.killPids().subscribe({
      next: response => {
      if(response.Data.success) {
        this.heartbeatService.stopHeartbeat();
        this.ipcRenderer.send(IPC.STOP_SYNC_SERVICE);
        this.showKillPids = false;
        this.authService.logout();
      }
    }, error: response => {
      this.authService.organizationId.next(null);
      this.ipcRenderer.send(IPC.STOP_SYNC_SERVICE);
      this.showKillPids = false;
      this.authService.logout();
    }});
  }

  override ngOnDestroy(): void {
    this.heartbeatService.stopHeartbeat();
    this.showKillPids = false;
  }

}
