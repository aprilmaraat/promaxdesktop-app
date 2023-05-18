import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { SyncService } from './core/services/sync-service/sync.service';
import { GenericComponent } from './shared/components/generic.component';
import { IPC } from './shared/constants/helper.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends GenericComponent {
  isLoggedIn$: Observable<boolean>;
  hasOrganizationId$: Observable<number | null>;
  killPidsModal?: NzModalRef;
  loginCheck: boolean = false;
  showKillPids: boolean = false;

  constructor(public authService: AuthService,
    private syncService: SyncService,
    message: NzMessageService,
    modal: NzModalService) { 
      super(message, modal);
    this.isLoggedIn$ = this.authService.isLoggedIn;
    this.hasOrganizationId$ = this.authService.hasOrganizationId;
    this.isLoggedIn$.subscribe(response => {
      this.loginCheck = response;
    });
    this.showKillPids = false;
  }

  openDevTools() {
    this.ipcRenderer.send(IPC.OPEN_DEV_TOOLS);
  }

  minimizeWindow() {
    this.ipcRenderer.send(IPC.MINIMIZE_WINDOW);
  }

  closeWindow() {
    if(this.loginCheck) {
      this.showKillPids = true;
      this.syncService.killPids().subscribe({
        next: response => {
          this.showKillPids = false;
          this.authService.organizationId.next(null);
          this.ipcRenderer.send(IPC.STOP_SYNC_SERVICE);
          this.ipcRenderer.send(IPC.CLOSE_WINDOW);
        }, error: response => {
          this.showKillPids = false;
          this.authService.organizationId.next(null);
          this.ipcRenderer.send(IPC.STOP_SYNC_SERVICE);
          this.ipcRenderer.send(IPC.CLOSE_WINDOW);
        }
      });
    } else {
      this.showKillPids = false;
      this.authService.organizationId.next(null);
      this.ipcRenderer.send(IPC.STOP_SYNC_SERVICE);
      this.ipcRenderer.send(IPC.CLOSE_WINDOW);
    }
  }
}
