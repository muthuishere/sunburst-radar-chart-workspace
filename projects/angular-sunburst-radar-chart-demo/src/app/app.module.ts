import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {EditorComponent} from './editor/editor.component';
import {AngularSunburstRadarChartModule} from '../../../angular-sunburst-radar-chart/src/lib/angular-sunburst-radar-chart.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AngularSunburstRadarChartModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
