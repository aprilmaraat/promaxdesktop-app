import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ACCOUNT } from 'src/app/shared/constants/endpoint.constants';
import { GenericService } from 'src/app/core/services/generic.service';
import { AccountRegister } from '../models/account';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService extends GenericService {

  constructor(authService: AuthService, 
    public override http: HttpClient) {
    super(http, authService);
    this.baseUrl += ACCOUNT.BASE;
  }

  register(data: AccountRegister) {
    return this.post(data, ACCOUNT.REGISTER).pipe(map(response => {
      return response
    }));
  }
}