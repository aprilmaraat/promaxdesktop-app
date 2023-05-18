import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { SyncComponent } from './components/sync.component';

const routes: Routes = [
  { path: '', component: SyncComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes), NzTableModule, NzProgressModule, NzIconModule, NzButtonModule, NzInputModule],
  exports: [RouterModule]
})

export class SyncRoutingModule { }
