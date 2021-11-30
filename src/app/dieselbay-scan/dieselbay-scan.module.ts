import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DieselbayScanPageRoutingModule } from './dieselbay-scan-routing.module';

import { DieselbayScanPage } from './dieselbay-scan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DieselbayScanPageRoutingModule
  ],
  declarations: [DieselbayScanPage]
})
export class DieselbayScanPageModule {}
