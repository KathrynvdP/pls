import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartOrderPageRoutingModule } from './start-order-routing.module';

import { StartOrderPage } from './start-order.page';
import { IonicSelectableModule } from 'ionic-selectable';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    StartOrderPageRoutingModule
  ],
  declarations: [StartOrderPage]
})
export class StartOrderPageModule {}
