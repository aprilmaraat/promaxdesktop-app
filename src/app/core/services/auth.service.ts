import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { GenericService } from 'src/app/core/services/generic.service';
import { AuthRequest, AuthResponse } from '../models/auth';
import { LICENSE, TOKENAUTH } from 'src/app/shared/constants/endpoint.constants';
import { Router } from '@angular/router';
import { LOCAL_STORAGE } from 'src/app/shared/constants/local-storage.contants';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends GenericService {
  private currentUserSubject: BehaviorSubject<AuthResponse>;
  public loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public organizationId: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);

  constructor(private router: Router,
    authService: AuthService,
    public override http: HttpClient) {
    super(http, authService);
    this.baseUrl += TOKENAUTH.BASE;
    let currentUser = JSON.parse(localStorage.getItem(LOCAL_STORAGE.CURRENT_USER)!) as AuthResponse;
    this.currentUserSubject = new BehaviorSubject<AuthResponse>(currentUser);
  }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  get hasOrganizationId() {
    return this.organizationId.asObservable();
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  authenticateLogin(authRequest: AuthRequest) {
    return this.post(authRequest, TOKENAUTH.AUTHENTICATE).pipe(map(response => {
      // Add logic here
      this.setUserCache(response.result);
      return response
    }));
  }

  public logout() {
    localStorage.removeItem(LOCAL_STORAGE.CURRENT_USER);
    localStorage.removeItem(LOCAL_STORAGE.REMEMBER_ME);
    localStorage.removeItem(LOCAL_STORAGE.ORGANIZATION_ID);
    localStorage.removeItem(LOCAL_STORAGE.REMEMBER_MY_ORGANIZATION);
    this.loggedIn.next(false);
    this.organizationId.next(null);
    this.currentUserSubject.next(new AuthResponse);
    this.router.navigate(['/auth/login']);
  }

  private setUserCache(user: AuthResponse){
    let rememberMe = localStorage.getItem(LOCAL_STORAGE.REMEMBER_ME);
    if(rememberMe !== null && rememberMe === 'true') {
      localStorage.setItem(LOCAL_STORAGE.CURRENT_USER, JSON.stringify(user));
    }
    let organizationId = localStorage.getItem(LOCAL_STORAGE.ORGANIZATION_ID);
    this.loggedIn.next(true);
    if(organizationId !== null) {
      this.organizationId.next(parseInt(organizationId));
    }
    this.currentUserSubject.next(user);
  }

}
