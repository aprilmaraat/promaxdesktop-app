import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ORGANIZATION } from 'src/app/shared/constants/endpoint.constants';
import { AuthService } from './auth.service';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService extends GenericService {

  constructor(
    authService: AuthService,
    public override http: HttpClient) {
    super(http, authService);
    this.baseUrl += ORGANIZATION.BASE;
    this.authAccess();
  }

  getOrganizationById(id: number) {
    return this.getById(id, ORGANIZATION.GET).pipe(map(response => {
      return response;
    }))
  }
}
