import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PageModule } from 'src/app/pages/page.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthorizationRoutingModule } from './authorization-routing.module';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SelectOrganizationComponent } from './components/select-organization/select-organization.component';

@NgModule({
  imports: [
    SharedModule,
    PageModule,
    AuthorizationRoutingModule
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    SelectOrganizationComponent
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    SelectOrganizationComponent
  ],
})
export class AuthorizationModule {
}