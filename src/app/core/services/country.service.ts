import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { COUNTRIES } from '../../shared/constants/endpoint.constants';
import { AuthService } from './auth.service';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends GenericService {

  constructor(authService: AuthService, 
    public override http: HttpClient) {
    super(http, authService);
    this.baseUrl += COUNTRIES.BASE;
  }

  getAllCountries() {
    return this.get(COUNTRIES.GET_ALL_COUNTRIES).pipe(map(response => {
      return response;
    }));
  }
}
