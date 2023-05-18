import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { interval, Subscription } from 'rxjs'; 
import { IPC, MESSAGE_TEXT, MESSAGE_TYPE } from 'src/app/shared/constants/helper.constants';
import { environment } from 'src/environments/environment.prod';
import { AuthResponse } from '../models/auth';
import { AuthService } from './auth.service';
import { GenericService } from './generic.service';
import { LicenseService } from './license.service';
import { ipcRenderer } from 'electron';
import { SyncService } from './sync-service/sync.service';

@Injectable({
  providedIn: 'root'
})
export class HeartbeatService extends GenericService {
  intervalSubscription: Subscription = new Subscription();
  currentUser: AuthResponse = new AuthResponse();
  ipcRenderer!: typeof ipcRenderer;

  constructor(
    authService: AuthService,
    private licenseService: LicenseService,
    private syncService: SyncService,
    public override http: HttpClient,
    public message: NzMessageService) {
    super(http, authService);
    this.ipcRenderer = window.require('electron').ipcRenderer;
  }

  startHeartbeat() {
    this.currentUser = this.authService.currentUserValue;
    if (this.currentUser !== null) {
      let timeInterval = environment.heartbeatInterval * 1000;
      this.intervalSubscription = new Subscription();
      this.sendHeartbeat(); // Fire heartbeat in the first instance
      this.intervalSubscription = interval(timeInterval).subscribe(() => {
        this.sendHeartbeat();
      });
    } else {
      this.authService.logout();
    }
  }

  sendHeartbeat() {
    let timeInterval = environment.heartbeatInterval * 1000;
    let errorKillPids: boolean = false;
    let licenseSession = interval(timeInterval).subscribe(() => {
      errorKillPids = true;
      this.ipcRenderer.send(IPC.KILL_PIDS, errorKillPids);
      this.syncService.killPids().subscribe({
        next: response => {
        if(response.Data.success) {
          this.ipcRenderer.send(IPC.STOP_SYNC_SERVICE, errorKillPids);
          this.ipcRenderer.send(IPC.KILL_PIDS, errorKillPids);
          licenseSession.unsubscribe();
        }
      }, error: response => {
        this.ipcRenderer.send(IPC.STOP_SYNC_SERVICE);
        this.ipcRenderer.send(IPC.KILL_PIDS, errorKillPids);
        licenseSession.unsubscribe();
      }});
    });
    // Simulation value
    // Get the cached licenseKey the user has chosen after login
    let organizationId = this.authService.organizationId.value;
    let licenseKey = this.currentUser.userLicences.find(x => x.organizationId === organizationId)?.licenseKey;
    this.licenseService.pingLicense(licenseKey!)
    .subscribe({
      next: response => {
        if(response.result.result === 0) {
          errorKillPids = false;
          // Do something here
          licenseSession.unsubscribe();
        } else {
          this.message.create(MESSAGE_TYPE.error, response.result.message);
          this.ipcRenderer.send(IPC.KILL_PIDS, errorKillPids);
          this.syncService.killPids().subscribe({
            next: response => {
            if(response.Data.success) {
              this.ipcRenderer.send(IPC.STOP_SYNC_SERVICE);
              this.ipcRenderer.send(IPC.KILL_PIDS, errorKillPids);
              licenseSession.unsubscribe();
            }
          }, error: response => {
            this.ipcRenderer.send(IPC.STOP_SYNC_SERVICE);
            this.ipcRenderer.send(IPC.KILL_PIDS, errorKillPids);
            licenseSession.unsubscribe();
          }});
        }
      },
      error: response => {
        this.message.create(MESSAGE_TYPE.error, MESSAGE_TEXT.apiError);
      }
    });
  }

  stopHeartbeat() {
    this.intervalSubscription.unsubscribe();
    this.currentUser = new AuthResponse();
  }
}