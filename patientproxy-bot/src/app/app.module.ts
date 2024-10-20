import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';  // Importing the standalone component

@NgModule({
  imports: [
    BrowserModule,
    FormsModule // Ensure FormsModule is imported to use ngModel
  ],
  providers: [],
  bootstrap: []  // Remove AppComponent from declarations and bootstrap arrays
})
export class AppModule { }
