import { ApplicationConfig, LOCALE_ID } from '@angular/core'; 
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';


registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'es' } 
    
  ]
};