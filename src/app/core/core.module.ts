import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CoreRoutingModule } from './core-routing.module';
import { AccountService } from './services/account.service';
import { AuthService } from './services/auth.service';
import { CountryService } from './services/country.service';
import { HeartbeatService } from './services/heartbeat.service';
import { LicenseService } from './services/license.service';
import { OrganizationService } from './services/organization.service';

@NgModule({
  imports: [
    CoreRoutingModule
  ],
  exports: [],
  declarations: [],
  providers: [
    AccountService,
    AuthService,
    CountryService,
    HeartbeatService,
    LicenseService,
    OrganizationService
  ]
})

export class CoreModule {

  /* make sure CoreModule is imported only by one NgModule the AppModule */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }
}
