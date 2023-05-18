import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroModule } from './ng-zorro/ng-zorro.module';
import { NavComponent } from './components/nav/nav.component';
import { GenericComponent } from './components/generic.component';
import { FormHeaderComponent } from './components/form-header/form-header.component';
import { StepsComponent } from './components/steps/steps.component';
import { AppRoutingModule } from '../app-routing.module';
import { LicenseService } from '../core/services/license.service';
import { FileSizePipe } from './pipes/file-size.pipe';
import { HighlightPipe } from './pipes/highlight-text.pipe';

@NgModule({ 
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgZorroModule,
      AppRoutingModule
    ],
    exports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      NgZorroModule,
      GenericComponent,
      NavComponent,
      FormHeaderComponent,
      StepsComponent,
      FileSizePipe,
      HighlightPipe
    ],
    declarations: [
      GenericComponent,
      NavComponent,
      FormHeaderComponent,
      StepsComponent,
      FileSizePipe,
      HighlightPipe
    ],
    providers: [LicenseService]
   })
  export class SharedModule {  }