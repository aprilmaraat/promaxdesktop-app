import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { EulaComponent } from './eula/eula.component';
import { GenericService } from '../core/services/generic.service';


@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    EulaComponent
  ],
  exports: [
    EulaComponent
  ],
  providers:[GenericService]
})
export class PageModule { }
