import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppLayoutComponent } from './app.layout.component';
import { AppTopbarComponent } from './components/topbar/app.topbar.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AppLayoutComponent, AppTopbarComponent],
  imports: [BrowserModule, BrowserAnimationsModule, SharedModule],
  exports: [AppLayoutComponent],
})
export class AppLayoutModule {}
