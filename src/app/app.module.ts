import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { SharedModule } from './shared/shared.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';

import { NZ_I18N, en_US } from 'ng-zorro-antd/i18n';
import { PageModule } from './pages/page.module';
import { GenericService } from './core/services/generic.service';
import { CoreModule } from './core/core.module';
import { SyncModule } from './modules/sync/sync.module';

registerLocaleData(en);

@NgModule({ 
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    CoreModule,
    AuthorizationModule,
    SyncModule,
    PageModule // temp
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    GenericService
  ],
  bootstrap: [AppComponent]
 })
export class AppModule { }
