import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatisticsPageRoutingModule } from './statistics-routing.module';
import { StatisticsPage } from './statistics.page';
import { NgCircleProgressModule } from 'ng-circle-progress';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StatisticsPageRoutingModule,
    NgCircleProgressModule.forRoot({
      radius: 22,
      outerStrokeWidth: 6,
      innerStrokeWidth: 0,
      outerStrokeColor: "#FFA500",// Color orange in the progress circle
      animation: true,
      showUnits: false,
      showBackground: false,
      showSubtitle: false,
      showInnerStroke: false,
    })
  ],
  declarations: [StatisticsPage]
})
export class StatisticsPageModule {}
