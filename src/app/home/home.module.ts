import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { StudyGoalsWidgetComponent } from '../components/study-goals-widget/study-goals-widget.component'; // Path to your widget component


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    IonicModule,  
],
  declarations: [HomePage, StudyGoalsWidgetComponent]
})
export class HomePageModule {}
