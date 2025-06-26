import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { AuthInterceptor } from './core/auth.interceptor';
import { ErrorInterceptor } from './core/error.interceptor';
import { MessageService } from 'primeng/api';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './assets/i18n/', '.json');

const HTTP_INTERCEPTORS_PROVIDERS = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
];

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
  provideRouter(routes, withHashLocation()),
  provideAnimations(),
  provideHttpClient(withInterceptorsFromDi()),
    MessageService,
  provideTranslateService({
    loader: {
      provide: TranslateLoader,

      useFactory: httpLoaderFactory,
      deps: [HttpClient],
    },
  }),
    HTTP_INTERCEPTORS_PROVIDERS
  ]
};
