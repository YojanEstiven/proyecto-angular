import { ApplicationConfig, LOCALE_ID } from '@angular/core'; 
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';


registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'es' } 
  ]
};