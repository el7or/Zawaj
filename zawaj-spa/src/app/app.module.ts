/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';
import { ErrorInterceptorProvidor } from './shared/interceptors/error-interceptor';
import { TokenInterceptorProvidor } from './shared/interceptors/token-interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { LOCALE_ID } from '@angular/core';
import { LanggService } from './shared/services/langg.service';
import { registerLocaleData } from '@angular/common';
import localeArabic from '@angular/common/locales/ar';
import localeEnglish from '@angular/common/locales/en';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { arLocale } from 'ngx-bootstrap/locale';

defineLocale('ar', arLocale);

registerLocaleData(localeArabic);
registerLocaleData(localeEnglish);

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    SharedModule.forRoot(),

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: ['localhost:5000/api/auth']
      }
    }),
    BsDatepickerModule.forRoot()
  ],
  providers:[TokenInterceptorProvidor,ErrorInterceptorProvidor,
    {provide: LOCALE_ID,
      deps: [LanggService],
      useFactory: (LanggService: { locale: string; }) => LanggService.locale
     }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
