import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { SYNC_SERVICE } from 'src/app/shared/constants/endpoint.constants';
import { GenericService } from '../generic.service';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../auth.service';
import { SyncServiceResponse, SyncSpace } from '../../models/syncthing/syncthing.model';
import { SOS_TRANSACTION } from 'src/app/shared/constants/form.constants';

@Injectable({
  providedIn: 'root'
})
export class SyncService extends GenericService {

  constructor(public override http: HttpClient, public override authService: AuthService) {
    super(http, authService);
    this.baseUrl = environment.syncthingApiUrl + SYNC_SERVICE.BASE;
  }

  killPids() {
    return this.get(SYNC_SERVICE.KILL_PIDS).pipe(map(response => {
      return response
    }));
  }

  getLocalDrives(): Observable<SyncServiceResponse> {
    return this.get(SYNC_SERVICE.GET_DRIVES_AND_SYNC_FOLDERS).pipe(map(response => {
      return response;
    }));
  }

  getMockDrives(): Observable<SyncServiceResponse> {
    let file = './assets/WithUsersJSON.json';
    return this.http.get<SyncServiceResponse>(file)
      .pipe(map(response => {
        return response;
      }));
  }

  postSyncService(transaction: string, data: any) {
    var action = "";
    if (transaction == SOS_TRANSACTION.addAction) {
      action = SYNC_SERVICE.ADD_SYNC_FOLDER;
    }
    else if (transaction == SOS_TRANSACTION.renameAction) {
      action = SYNC_SERVICE.RENAME_SYNC_FOLDER;
    }
    else if (transaction == SOS_TRANSACTION.removeAction) {
      action = SYNC_SERVICE.REMOVE_SYNC_FOLDER;
    }
    else if (transaction == SOS_TRANSACTION.deleteAction) {
      action = SYNC_SERVICE.DELETE_LOCAL_FOLDER;
    }

    return this.postSOS(data, action).pipe(map(response => {
      return response;
    }));

  }
}