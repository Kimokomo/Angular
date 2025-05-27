import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [

      provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',  // Default XSRF cookie name
        headerName: 'X-XSRF-TOKEN',  // Header for XSRF token
      })
    ),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes)
  ]
};
