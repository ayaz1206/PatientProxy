import { Routes } from '@angular/router';
import { AppComponent } from './app.component'; // Import your standalone component

// Define your application routes
export const routes: Routes = [
  {
    path: '',
    component: AppComponent, // Default route loading AppComponent
  },
  // Add more routes here as needed
  // Example:
  // {
  //   path: 'other',
  //   component: OtherComponent,
  // },
  {
    path: '**', // Wildcard route for a 404 page
    redirectTo: '' // Redirect to the default route
  }
];
