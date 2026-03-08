import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

export const appConfig = {
  providers: [
    provideRouter(routes)
  ]
};