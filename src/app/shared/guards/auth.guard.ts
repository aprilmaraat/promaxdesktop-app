import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Route } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { LOCAL_STORAGE } from '../constants/local-storage.contants';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private router: Router,
      private authService: AuthService) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const currentUser = this.authService.currentUserValue;
      if (currentUser !== null) {
        // Check if selected organization has been remembered
        let rememberOrganizationCache = localStorage.getItem(LOCAL_STORAGE.REMEMBER_MY_ORGANIZATION);
        if(rememberOrganizationCache === 'true') {
          let organizationId = localStorage.getItem(LOCAL_STORAGE.ORGANIZATION_ID);
          this.authService.loggedIn.next(true);
          this.authService.organizationId.next(parseInt(organizationId!));
        } else {
          if(this.authService.organizationId.value === null || this.authService.organizationId.value === undefined || this.authService.organizationId.value === NaN) {
            if (currentUser.userLicences.length > 1) {
              this.router.navigate(['/auth/select-organization']);
              return false;
            } 
          }
        }

        if(this.authService.loggedIn.value) {
          if(this.authService.organizationId.value !== null) {
            return true;
          }
        }
      }
      this.authService.logout();
      return false;
    }

    canLoad(route: Route) {
      const currentUser = this.authService.currentUserValue;
      // Check if user has successful login
      if (currentUser !== null) {
        return true;
      }
      this.authService.logout();
      return false;
    }
}