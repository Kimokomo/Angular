import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { JwtInterceptor } from './interceptors/jwt.interceptor';

import {
  provideHttpClient,
  withXsrfConfiguration,
  withInterceptors
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      }),
      withInterceptors([JwtInterceptor]) // ✅ hier dein Interceptor
    ),
    provideRouter(routes),
    provideZoneChangeDetection({ eventCoalescing: true })
  ]
};