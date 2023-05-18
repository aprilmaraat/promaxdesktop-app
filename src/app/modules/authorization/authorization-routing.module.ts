import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { SelectOrganizationComponent } from './components/select-organization/select-organization.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
  { path: 'auth', 
    children: [
      { 
        path: 'login',
        component: LoginComponent
      },
      { 
        path: 'register',
        component: RegisterComponent
      },
      { 
        path: 'select-organization', 
        component: SelectOrganizationComponent, 
        canLoad: [AuthGuard] 
      },
    ]
  },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthorizationRoutingModule {
}