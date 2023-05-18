import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { LICENSE } from 'src/app/shared/constants/endpoint.constants';
import { AuthService } from './auth.service';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class LicenseService extends GenericService {

  constructor(
    authService: AuthService,
    public override http: HttpClient) {
    super(http, authService);
    this.baseUrl += LICENSE.BASE;
    this.authAccess();
  }

  pingLicense(licenseKey: string) {
    let url = LICENSE.PING + '?licenseKey=' + licenseKey;
    return this.post({}, url).pipe(map(response => {
      return response;
    }));
  }
}
