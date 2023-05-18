import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'sync' },
  {
    path: 'sync',
    loadChildren: () => import('../modules/sync/sync.module').then(m => m.SyncModule)
  },
  { 
    path: 'auth',
    loadChildren: () => import('../modules/authorization/authorization.module').then(m => m.AuthorizationModule) 
  },
  {
    path: 'pages',
    loadChildren: () => import('../pages/page.module').then(m => m.PageModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {
}