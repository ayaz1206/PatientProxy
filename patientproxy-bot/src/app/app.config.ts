import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component'; // Import the standalone component
import { routes } from './app.routes'; // Import your defined routes
export const appConfig: ApplicationConfig = { // Specify the AppComponent as the bootstrap component
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes)
  ]
};
