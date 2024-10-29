import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';  // Importing the standalone component

@NgModule({
  imports: [
    BrowserModule,
    AppComponent // Include the standalone component here
  ],
  providers: [] // Set AppComponent as the bootstrap component
})
export class AppModule { }
