import { NgModule } from '@angular/core';
import { AngularSunburstRadarChartComponent } from './angular-sunburst-radar-chart.component';
import {CommonModule} from '@angular/common';



@NgModule({
  declarations: [AngularSunburstRadarChartComponent],
  imports: [
    CommonModule
  ],
  exports: [AngularSunburstRadarChartComponent]
})
export class AngularSunburstRadarChartModule { }
