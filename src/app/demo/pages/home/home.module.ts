import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { MainStatisticComponent } from './components/main-statistics/main-statistic.component';

@NgModule({
  declarations: [HomeComponent, MainStatisticComponent],
  imports: [CommonModule, HomeRoutingModule],
})
export class HomeModule {}
