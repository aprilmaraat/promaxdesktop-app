import { NgModule } from '@angular/core';
import { PageModule } from 'src/app/pages/page.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SyncComponent } from './components/sync.component';
import { SyncRoutingModule } from './sync-routing.module';

@NgModule({
  imports: [
    SharedModule,
    PageModule,
    SyncRoutingModule
  ],
  exports: [
    SyncComponent
  ],
  declarations: [
    SyncComponent
  ],
})
export class SyncModule {}