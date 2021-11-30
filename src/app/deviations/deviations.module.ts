import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeviationsPageRoutingModule } from './deviations-routing.module';

import { DeviationsPage } from './deviations.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    DeviationsPageRoutingModule
  ],
  declarations: [DeviationsPage]
})
export class DeviationsPageModule {}
